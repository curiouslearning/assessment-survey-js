class PubSub {
  subscribe(_event, _callback) { return () => {}; }
  publish(_event, _data) {}
}

class AndroidInterface {
  constructor(_options) {}

  logSummaryData(_summary, _options) {}

  logUserSessionsData(_payload, _options) {}
}

module.exports = {
  PubSub,
  AndroidInterface,
};