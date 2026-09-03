class PubSub {
  subscribe(_event, _callback) {
    return () => {};
  }
  publish(_event, _data) {}
}

class AndroidInterface {
  constructor(options) {
    AndroidInterface.instances.push(options);
  }

  logSummaryData(_summary, _options) {}

  logUserSessionsData(_payload, _options) {}
}

// Test-only hook: records every constructor call's options so tests can assert on the
// metadata payload passed to AndroidInterface without a real Android host present.
AndroidInterface.instances = [];

module.exports = {
  PubSub,
  AndroidInterface,
};
