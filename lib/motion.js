const fetch = require("node-fetch");

module.exports = class Motion {
  constructor({ base, camId }) {
    this.base = base;
    this.camId = camId;
  }

  fetch(path) {
    const url = new URL(`${this.camId}${path}`, this.base);
    return fetch(url);
  }

  eventStart() {
    this.log("Motion: Trigger a new event");
    return this.fetch("/action/eventstart");
  }

  eventEnd() {
    this.log("Motion: Trigger the end of a event");
    return this.fetch("/action/eventend");
  }

  log(msg) {
    const date = new Date().toLocaleString();
    console.log(`[${date}] ${msg}`);
  }
};
