# zmonvif-trigger

A JS CLI tool that attempts to bridge the gap between your ONVIF camera's motion detection and Zoneminder.

## Why?
In a typical Zoneminder installation the server will do video processing to determine which frames have motion. Unfortunately this task is quite CPU intensive. 

Fortunately some ONVIF cameras have built in motion detection features, which notify subscribers when an event occurs. 

This tool connects to an ONVIF camera and subscribes to these messages. When the motion state changes, it uses Zoneminder's API to arm the selected monitor

## Install

```bash
npm install -g zmonvif-events
```

## Usage

```bash
zmonvif-events --help
usage: zmonvif-events [-h] -z ZM_BASE_URL -i ZM_MONITOR_ID -c HOSTNAME
                         [-u USERNAME] [-p PASSWORD]


ONVIF motion detection events bridge to Zoneminder

Optional arguments:
  -h, --help            Show this help message and exit.
  -z ZM_BASE_URL, --zm-base-url ZM_BASE_URL
                        Base URL for the Zoneminder instance (with trailing
                        slash)
  -i ZM_MONITOR_ID, --zm-monitor-id ZM_MONITOR_ID
                        The ID of the monitor in Zoneminder
  -c HOSTNAME, --hostname HOSTNAME
                        hostname/IP of the ONVIF camera
  -u USERNAME, --username USERNAME
                        username for the ONVIF camera
  -p PASSWORD, --password PASSWORD
                        password for the ONVIF camera
```

**Example**

```bash
  zmonvif-events \
      --zm-base-url http://my-zoneminder-instance.com/zm/ \
      --zm-monitor-id 1 \
      --hostname 192.168.1.55 \
      --username supersecretusername \
      --password dontshareme
```
```
[monitor 1]: Started
[monitor 1]: CellMotionDetector: Motion Detected: true
Setting monitor 1 to state true
[monitor 1]: CellMotionDetector: Motion Detected: false
Setting monitor 1 to state false
[monitor 1]: CellMotionDetector: Motion Detected: true
Setting monitor 1 to state true
[monitor 1]: CellMotionDetector: Motion Detected: false
```
