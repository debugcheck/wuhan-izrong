const DeviceInfoDetail = require('./deviceInfo');
const _device_id = DeviceInfoDetail.getDeviceId();

const _getSessionKey = (t, id) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  return '${t}:${id}';
};

const _getMessageKey = (s) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  return '${s}:${new Date().getTime()}:${_device_id}';
};

const KeyGenerator = {
  getSessionKey: (t, id) => _getSessionKey(t, id),
  getMessageKey: (s) => _getMessageKey(s),
};

module.exports = KeyGenerator;
