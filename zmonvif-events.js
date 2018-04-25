const {Cam} = require('onvif');
const fetch = require('node-fetch');
const {ArgumentParser} = require('argparse');
const pjson = require('./package.json');

class ZoneminderService {
  constructor(basePath) {
    this.basePath = basePath
  }

  /**
   * @param {number} monitorId
   * @param {boolean} state
   */
  setAlarm(monitorId, state) {
    console.log(`Setting monitor ${monitorId} to state ${state}`);
    const cmd = state ? 'on' : 'off';
    const url = `${this.basePath}api/monitors/alarm/id:${monitorId}/command:${cmd}.json`;
    return fetch(url);
  }
}

let MotionTopic = {
  CELL_MOTION_DETECTOR: 'CELL_MOTION_DETECTOR',
  MOTION_ALARM: 'MOTION_ALARM',
};

class Monitor {
  constructor(id, onvifCam, zoneminder) {
    this.id = id;
    this.onvifCam = onvifCam;
    this.zoneminder = zoneminder;
    this.lastMotionDetectedState = null;
    this.topic = MotionTopic.MOTION_ALARM;
  }

  log(msg, ...rest) {
    console.log(`[monitor ${this.id}]: ${msg}`, ...rest);
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
      this.zoneminder.setAlarm(this.id, isMotion);
    }
    this.lastMotionDetectedState = isMotion
  }

  static createCamera(conf) {
    return new Promise(resolve => {
      const cam = new Cam(conf, () => resolve(cam));
    })
  }

  static async create({id, hostname, username, password}, zoneminder) {
    const cam = await this.createCamera({
      hostname,
      username,
      password
    });
    return new Monitor(id, cam, zoneminder);
  }
}

async function start(args) {
  const zoneminder = new ZoneminderService(args.zm_base_url);
  const monitor = await Monitor.create({
    id: args.zm_monitor_id,
    hostname: args.hostname,
    username: args.username,
    password: args.password
  }, zoneminder);
  monitor.start();
}

function main() {
  const parser = new ArgumentParser({
    addHelp: true,
    description: 'ONVIF motion detection events bridge to Zoneminder',
    version: pjson.version,
  });

  parser.addArgument(['-z', '--zm-base-url'], {
    help: 'Base URL for the Zoneminder instance (with trailing slash)',
    required: true
  });
  parser.addArgument(['-i', '--zm-monitor-id'], {
    help: 'The ID of the monitor in Zoneminder',
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
  const args = parser.parseArgs();

  start(args);
}

main();
