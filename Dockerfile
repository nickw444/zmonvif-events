FROM node:12.9-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git tzdata && \
    cp -r /usr/share/zoneinfo/$TZ /etc/localtime && \
    npm install -g motion-onvif-events

CMD motion-onvif-events \
    --motion-base-url $MOTION_BASE_URL \
    --motion-camera-id $MOTION_CAMERA_ID \
    --hostname $HOSTNAME \
    --username $USERNAME \
    --password $PASSWORD \
    --port $PORT \
    --delay $DELAY