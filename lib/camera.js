const { Cam } = require("onvif");

module.exports = class Camera {
  constructor(onvifCam, motion, timeout) {
    this.onvifCam = onvifCam;
    this.motion = motion;
    this.prevMotionValue = false;
    this.timeout = timeout;
    this.timeoutId = null;
  }

  static async create({ hostname, username, password, port, timeout }, motion) {
    const onvifCam = await this.createOnvifCam({
      hostname,
      username,
      password,
      port,
    });

    return new Camera(onvifCam, motion, timeout);
  }

  static createOnvifCam(conf) {
    return new Promise((resolve) => {
      const cam = new Cam(conf, (err) => {
        if (err) {
          this.log("Error connecting to ONVIF Camera " + err);
          process.exit();
        }
        resolve(cam);
      });
    });
  }

  addEventListener() {
    this.onvifCam.on("event", (camMessage) => this.onEvent(camMessage));
    this.log("Camera: Start event listener");
  }

  onEvent(camMessage) {
    const topic = camMessage.topic._;
    if (topic.indexOf("RuleEngine/CellMotionDetector/Motion") !== -1) {
      this.onMotionDetected(camMessage);
    }
  }

  onMotionDetected(camMessage) {
    const isMotion = camMessage.message.message.data.simpleItem.$.Value;

    if (this.prevMotionValue !== isMotion) {
      this.log(`Camera: Motion detected: ${isMotion}`);

      if (isMotion && !this.timeoutId) {
        this.motion.eventStart();
      }

      if (isMotion && this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      if (!isMotion) {
        this.timeoutId = setTimeout(() => {
          this.motion.eventEnd();
          this.timeoutId = null;
        }, this.timeout);
      }

      this.prevMotionValue = isMotion;
    }
  }

  log(msg) {
    const date = new Date().toLocaleString();
    console.log(`[${date}] ${msg}`);
  }
};
