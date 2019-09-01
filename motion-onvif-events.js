#!/usr/bin/env node

const {Cam} = require('onvif');
const fetch = require('node-fetch');
const {ArgumentParser} = require('argparse');
const pjson = require('./package.json');

class MotionService {
  constructor(basePath) {
    this.basePath = basePath
  }

  /**
   * @param {number} cameraId
   * @param {boolean} state
   */
  setAlarm(cameraId, state) {
    const date = new Date().toLocaleString();
    console.log(`[${date}] Setting camera ${cameraId} to state ${state}`);
    const cmd = state ? 'on' : 'off';
    const url = `${this.basePath}${cameraId}/config/set?emulate_motion=${cmd}`;
    return fetch(url);
  }
}

let MotionTopic = {
  CELL_MOTION_DETECTOR: 'CELL_MOTION_DETECTOR',
  MOTION_ALARM: 'MOTION_ALARM',
};

class Monitor {
  constructor(id, onvifCam, motion) {
    this.id = id;
    this.onvifCam = onvifCam;
    this.motion = motion;
    this.lastMotionDetectedState = null;
    this.topic = MotionTopic.MOTION_ALARM;
  }

  log(msg, ...rest) {
    console.log(`[camera ${this.id}]: ${msg}`, ...rest);
  }

  async start() {
    this.onvifCam.on('event', camMessage => this.onEventReceived(camMessage));
    this.log('Started');
  }

  onEventReceived(camMessage) {
    const topic = camMessage.topic._;
    if (topic.match(/RuleEngine\/CellMotionDetector\/Motion$/)) {
      this.onMotionDetectedEvent(camMessage);
    }
  }

  onMotionDetectedEvent(camMessage) {
    const isMotion = camMessage.message.message.data.simpleItem.$.Value;
    if (this.lastMotionDetectedState !== isMotion) {
      this.log(`CellMotionDetector: Motion Detected: ${isMotion}`);
      this.motion.setAlarm(this.id, isMotion);
    }
    this.lastMotionDetectedState = isMotion
  }

  static createCamera(conf) {
    return new Promise(resolve => {
      const cam = new Cam(conf, () => resolve(cam));
    })
  }

  static async create({id, hostname, username, password, port}, motion) {
    const cam = await this.createCamera({
      hostname,
      username,
      password,
      port
    });
    return new Monitor(id, cam, motion);
  }
}

async function start(args) {
  const motion = new MotionService(args.motion_base_url);
  const monitor = await Monitor.create({
    id: args.motion_camera_id,
    hostname: args.hostname,
    username: args.username,
    password: args.password,
    port: args.port
  }, motion);
  monitor.start();
}

function main() {
  const parser = new ArgumentParser({
    addHelp: true,
    description: 'ONVIF motion detection events bridge to Motion',
    version: pjson.version,
  });

  parser.addArgument(['-m', '--motion-base-url'], {
    help: 'Base URL for the Motion instance (with trailing slash)',
    required: true
  });
  parser.addArgument(['-i', '--motion-camera-id'], {
    help: 'The ID of the camera in Motion',
    required: true
  });
  parser.addArgument(['-c', '--hostname'], {
    help: 'hostname/IP of the ONVIF camera',
    required: true
  });
  parser.addArgument(['-u', '--username'], {
    help: 'username for the ONVIF camera'
  });
  parser.addArgument(['-p', '--password'], {
    help: 'password for the ONVIF camera'
  });
  parser.addArgument(['-o', '--port'], {
    help: 'port for the ONVIF camera'
  });
  const args = parser.parseArgs();

  start(args);
}

main();
