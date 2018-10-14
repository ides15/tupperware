FROM alpine:latest

RUN apk update && \
    apk upgrade && \
    apk add nodejs-npm && \
    rm -rf /var/cache/apk/*

RUN mkdir -p /tupperware
ENTRYPOINT ["node", "/tupperware/server/server.js"]
