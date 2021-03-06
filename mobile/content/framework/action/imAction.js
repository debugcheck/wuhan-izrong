let { Alert } = require('mx-artifacts');

let ImStore = require('../store/imStore');
let ImSocket = require('../network/imSocket');

let AppLinks = require('../../constants/appLinks');
let { UFetch, DPUFetch } = require('../network/fetch');
// Private Functions
let _send = (data, bFlag = false, userId, notSend = false) => {
  if (bFlag) {
    console.log('Message sent again!');
  } else {
    ImStore.saveMsg(data, userId);
  }

  if(!notSend)
  ImSocket.send(data)
    .then(() => {
      // ImStore.send();
    }).catch((err) => {
       ImStore.ackMsg(data.msgId,data.toId,false,true);
      Alert('请检查网络连接');

    });
};

let _uploadImage = function (url, fileFieldName) {
  return new Promise((resolve, reject) => {
    UFetch(url, {
      uri: fileFieldName,
      type: 'image/jpeg',
      name: fileFieldName
    }).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _uploadImage2 = function (url, uri, fileFieldName) {
  return new Promise((resolve, reject) => {
    DPUFetch(url, {
      uri: uri,
      type: 'image/jpeg',
      name: fileFieldName
    }).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _isInGroupById = function (id, userId) {
  return ImStore.isInGroupById(id, userId);
}

let ImAction = {
  imInit: () => ImSocket.init(),
  sessionInit: function(data) {
    ImStore.sessionInit(data);
    //ImSocket.init();
  },
  send: (data, bFlag, userId, isSend) => _send(data, bFlag, userId, isSend),
  //receive: (data) => ImStore.saveMsg(data),
  uploadImage: (fileFieldName) => _uploadImage(AppLinks.uploadFile, fileFieldName),
  uploadImage2: (uri, fileFieldName) => _uploadImage2(AppLinks.uploadFile, uri, fileFieldName),
  notificationRegister: (token) => _notificationRegister(token),
  onNotification: (notification) => _onNotification(notification),
  freshNotification: (notification) => _onNotification(notification),
  initSend:() => {
    _send();
  },
  isInGroupById: (id, userId) => _isInGroupById(id, userId)
};

module.exports = ImAction;
