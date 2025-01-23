// jest.setup.js
global.BroadcastChannel = class {
  constructor(channel) {
    this.channel = channel;
    this.onmessage = null;
  }

  postMessage(data) {
    if (this.onmessage) {
      this.onmessage({ data });
    }
  }

  close() {
    // Mock any cleanup if needed
  }

  addEventListener(event, callback) {
    if (event === 'message') {
      this.onmessage = callback;
    }
  }

  removeEventListener(event) {
    if (event === 'message') {
      this.onmessage = null;
    }
  }
};
global.UnityBridge = class {
  constructor(channel) {
    this._channel = channel;
    this._message = null;
  }
};
