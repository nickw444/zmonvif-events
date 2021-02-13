const { Cam } = require('onvif');

module.exports = class Camera {
  constructor(onvifCam, motion, delay) {
    this.onvifCam = onvifCam;
    this.motion = motion;
    this.timeout = {
      id: null,
      delay,
    };
    this.prevMotionValue = false;
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
          this.log(`Error connecting to ONVIF Camera ${err}`);
          process.exit();
        }
        resolve(cam);
      });
    });
  }

  addEventListener() {
    this.onvifCam.on('event', (camMessage) => this.onEvent(camMessage));
    this.log(new Date(), 'Start event listener');
  }

  onEvent(camMessage) {
    const topic = camMessage.topic._;
    if (topic.indexOf('RuleEngine/CellMotionDetector/Motion') !== -1) {
      this.onMotionDetected(camMessage);
    }
  }

  onMotionDetected(camMessage) {
    const time = camMessage.message.message.$.UtcTime;
    const isMotion = camMessage.message.message.data.simpleItem.$.Value;

    if (this.prevMotionValue === isMotion) {
      return;
    }

    this.log(time, `Motion detected: ${isMotion}`);

    if (isMotion && !this.timeout.id) {
      this.motion.eventStart();
    }

    if (isMotion && this.timeout.id) {
      clearTimeout(this.timeout.id);
      this.timeout.id = null;
    }

    if (!isMotion) {
      this.timeout.id = setTimeout(() => {
        this.motion.eventEnd();
        this.timeout.id = null;
      }, this.timeout.delay);
    }

    this.prevMotionValue = isMotion;
  }

  log(date, msg) {
    console.log(`[${date.toLocaleString()}] Camera: ${msg}`);
  }
};
