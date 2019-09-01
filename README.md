# motion-onvif-events

A JS CLI tool that attempts to bridge the gap between your ONVIF camera's motion detection and [Motion](https://motion-project.github.io).

Forked from [zmonvif-events](https://github.com/nickw444/zmonvif-events).

## Why?
In a typical Motion installation the server will do video processing to determine which frames have motion. Unfortunately this task is quite CPU intensive. 

Fortunately some ONVIF cameras have built in motion detection features, which notify subscribers when an event occurs. 

This tool connects to an ONVIF camera and subscribes to these messages. When the motion state changes, it uses Motion's API to arm the selected camera.

Recording triggered using special url, description in [Issue 563](https://github.com/ccrisan/motioneye/issues/563). You need to enable [webcontrol options](https://motion-project.github.io/motion_config.html#OptDetail_Webcontrol) in Motion config.

## Install

```bash
npm install -g motion-onvif-events
```

## Usage

```bash
motion-onvif-events --help
usage: motion-onvif-events [-h] -m MOTION_BASE_URL -i MOTION_CAMERA_ID -c HOSTNAME
                         [-u USERNAME] [-p PASSWORD] [-o PORT]


ONVIF motion detection events bridge to Motion

Optional arguments:
  -h, --help            Show this help message and exit.
  -m MOTION_BASE_URL, --motion-base-url MOTION_BASE_URL
                        Base URL for the Motion instance (with trailing
                        slash)
  -i MOTION_CAMERA_ID, --motion-camera-id MOTION_CAMERA_ID
                        The ID of the camera in Motion
  -c HOSTNAME, --hostname HOSTNAME
                        hostname/IP of the ONVIF camera
  -u USERNAME, --username USERNAME
                        username for the ONVIF camera
  -p PASSWORD, --password PASSWORD
                        password for the ONVIF camera
  -o PORT, --port PORT
                        port for the ONVIF camera
```

**Example**

```bash
  motion-onvif-events \
      --motion-base-url http://my-motion-instance.com/ \
      --motion-camera-id 1 \
      --hostname 192.168.1.55 \
      --username supersecretusername \
      --password dontshareme
      --port 8899
```
```
[camera 1]: Started
[camera 1]: CellMotionDetector: Motion Detected: true
[9/1/2019, 5:33:39 PM] Setting camera 1 to state true
[camera 1]: CellMotionDetector: Motion Detected: false
[9/1/2019, 5:33:40 PM] Setting camera 1 to state false
[camera 1]: CellMotionDetector: Motion Detected: true
[9/1/2019, 5:33:42 PM] Setting camera 1 to state true
[camera 1]: CellMotionDetector: Motion Detected: false
```
