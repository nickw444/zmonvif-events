# motion-onvif-events

A JS CLI tool that attempts to bridge the gap between your ONVIF camera's motion detection and [Motion](https://motion-project.github.io).

Forked from [zmonvif-events](https://github.com/nickw444/zmonvif-events).

## Why?
In a typical Motion installation the server will do video processing to determine which frames have motion. Unfortunately this task is quite CPU intensive. 

Fortunately some ONVIF cameras have built in motion detection features, which notify subscribers when an event occurs. 

This tool connects to an ONVIF camera and subscribes to these messages. When the motion state changes, it uses Motion's API to arm the selected camera.

Recording triggered using Motion`s Web Control action url. You need to enable [webcontrol options](https://motion-project.github.io/motion_config.html#OptDetail_Webcontrol) in Motion config.

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
      --motion-base-url http://my-motion-instance.com:7999/ \
      --motion-camera-id 1 \
      --hostname 192.168.1.55 \
      --username supersecretusername \
      --password dontshareme
      --port 8899
      --timeout 5000
```
```
[1/13/2021, 11:06:40 AM] Camera: Start event listener
[1/13/2021, 11:07:28 AM] Camera: Motion detected: true
[1/13/2021, 11:07:28 AM] Motion: Trigger a new event
[1/13/2021, 11:07:29 AM] Camera: Motion detected: false
[1/13/2021, 11:07:30 AM] Camera: Motion detected: true
[1/13/2021, 11:07:31 AM] Camera: Motion detected: false
[1/13/2021, 11:07:51 AM] Motion: Trigger the end of a event
```

## Docker

Environment variables
* `MOTION_BASE_URL` - Base URL for the Motion instance (with trailing slash)
* `MOTION_CAMERA_ID` - The ID of the camera in Motion
* `HOSTNAME` - hostname/IP of the ONVIF camera
* `USERNAME` - username for the ONVIF camera
* `PASSWORD` - password for the ONVIF camera
* `PORT` - port for the ONVIF camera