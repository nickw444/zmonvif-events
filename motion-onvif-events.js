#!/usr/bin/env node

const { ArgumentParser } = require('argparse');
const pjson = require('./package.json');
const Motion = require('./lib/motion');
const Camera = require('./lib/camera');

async function start(args) {
  const motion = new Motion({
    base: args.motion_base_url,
    camId: args.motion_camera_id,
  });

  const camera = await Camera.create(
    {
      hostname: args.hostname,
      username: args.username,
      password: args.password,
      port: args.port,
      timeout: args.timeout,
    },
    motion
  );

  camera.addEventListener();
}

function main() {
  const parser = new ArgumentParser({
    addHelp: true,
    description: 'ONVIF motion detection events bridge to Motion',
    version: pjson.version,
  });

  parser.addArgument(['-m', '--motion-base-url'], {
    help: 'Base URL for the Motion instance (with trailing slash)',
    required: true,
  });
  parser.addArgument(['-i', '--motion-camera-id'], {
    help: 'The ID of the camera in Motion',
    required: true,
  });
  parser.addArgument(['-c', '--hostname'], {
    help: 'hostname/IP of the ONVIF camera',
    required: true,
  });
  parser.addArgument(['-u', '--username'], {
    help: 'username for the ONVIF camera',
  });
  parser.addArgument(['-p', '--password'], {
    help: 'password for the ONVIF camera',
  });
  parser.addArgument(['-o', '--port'], {
    help: 'port for the ONVIF camera',
  });
  parser.addArgument(['-d', '--delay'], {
    help:
      'delay (in ms) between no motion in the Camera and trigger the end of event to Motion',
    defaultValue: 10000,
  });
  const args = parser.parseArgs();

  start(args);
}

main();
