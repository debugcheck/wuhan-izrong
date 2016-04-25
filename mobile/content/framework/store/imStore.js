let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;

let { SESSION_TYPE } = require('../../constants/dictIm');

let Persister = require('../persister/persisterFacade');
let SessionAction = require('../action/sessionAction');
let ContactStore = require('./contactStore');

let _info = {
  initLoadingState: true,
  CHANGE_EVENT: 'change',
  netWorkState: false,
  isLogout: false,
  isForceLogout: false
};
const {CHANGE_EVENT} = require('../../constants/dictIm');

let _data = {
  toId: '',
  sessionId: '',
  page: 1,
  userId: '',
  userPhotoFileUrl: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
  messages: []
};

let ImStore = _.assign({}, EventEmitter.prototype, {
  addChangeListener: function (callback, event = CHANGE_EVENT.CHANGE) {
    this.on(event, callback);
  },
  removeChangeListener: function (callback, event = CHANGE_EVENT.CHANGE) {
    this.removeListener(event, callback);
  },
  emitChange: function (event = CHANGE_EVENT.CHANGE, data = {}) {
    this.emit(event, data);
  },

  imInit: () => _imInit(),
  sessionInit: (data) => _sessionInit(data),
  getMessages: () => _data.messages,
  saveMsg: (message) => _saveMsg(message),
  ackMsg: (msgId, toUid) => _ackMsg(msgId, toUid),
  getEarlier: () => _getEarlier(),
  createHomePageInfo:(seq, url)=>Persister.createHomePageInfo(seq, url),
  createPlatFormInfo:(infoId, title, content, createDate)=>Persister.createPlatFormInfo(infoId, title, content, createDate),
  deleteContactInfo:(userIdList)=>Persister.deleteContactInfo(userIdList),
  updateContactInfo:(address, realName, email, nameCardFileUrl, department, publicDepart, jobTitle, publicTitle, mobileNumber, publicMobile, phoneNumber, publicPhone, publicEmail, publicAddress, publicWeChat, photoFileUrl, qqNo, publicQQ, weChatNo, userId, orgId) =>
    Persister.updateContactInfo(address, realName, email, nameCardFileUrl, department, publicDepart, jobTitle, publicTitle, mobileNumber, publicMobile, phoneNumber, publicPhone, publicEmail, publicAddress, publicWeChat, photoFileUrl, qqNo, publicQQ, weChatNo, userId, orgId)

});

// Private Functions
let _imInit = () => {

};

let _resovleMessages = (bInit = false) => {
  let savedMessages = Persister.getMessageBySessionId(_data.sessionId, _data.page);
  let tmpMessages = [];
  let tmpMessage = {};
  savedMessages.forEach((object, index, collection) => {
    if (object.fromUId) { // Received
      tmpMessage = {
        msgId: object.msgId,
        contentType: object.contentType,
        content: object.content,
        name: object.fromUId,
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: object.revTime
      };
    } else { // Sent
      tmpMessage = {
        msgId: object.msgId,
        contentType: object.contentType,
        content: object.content,
        name: _data.userId,
        image: _data.userPhotoFileUrl,
        position: 'right',
        date: object.revTime,
        status: object.status
      };
    }

    bInit ? null : tmpMessages.unshift(tmpMessage);
    _data.messages.unshift(tmpMessage);
  });

  if (bInit) {
    ImStore.emitChange();
  } else {
    return tmpMessages;
  }
};

let _sessionInit = (data) => {
  _data.toId = data.toId;
  _data.sessionId = data.sessionId;
  _data.page = 1;
  _data.messages = [];
  _resovleMessages(true);
  ImStore.emitChange();
};

let _saveMsg = (message) => {

  console.log(message);
  if(message.msgType == SESSION_TYPE.INVITE){
    //TODO  这种情况考虑换个地方处理
    //let group = ContactStore.getGroupDetailById(message.groupId);
    SessionAction.updateSession(SESSION_TYPE.INVITE, message.sessionId,message.groupName,'群邀请',message.revTime,message.contentType, message.groupId);
    return ;
  }
  if(message.type == SESSION_TYPE.USER){
    let user = ContactStore.getUserInfoByUserId(message.toId || message.fromUId);
    SessionAction.updateSession(message.type, message.sessionId,user.realName,message.content,message.revTime,message.contentType);
  }else if(message.type == SESSION_TYPE.GROUP){
    let group = ContactStore.getGroupDetailById(message.groupId);
    SessionAction.updateSession(message.type, message.sessionId,group.groupName,message.content,message.revTime,message.contentType);
  }

  if (message.sessionId === _data.sessionId) {
    if (message.fromUId) { // Received
      // TODO. Get user info by id.
      _data.messages.push({
        msgId: message.msgId,
        contentType: message.contentType,
        content: message.content,
        name: message.fromUId,
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: message.revTime
      });
    } else { // Send
      _data.messages.push({
        msgId: message.msgId,
        contentType: message.contentType,
        content: message.content,
        name: _data.userId,
        image: _data.userPhotoFileUrl,
        position: 'right',
        date: message.revTime,
        status: message.status
      });
    }

    ImStore.emitChange();
  }

  Persister.saveMessage(message);
};

let _ackMsg = (msgId, toUid) => {
  if (_data.toId === toUid) {
    _data.messages.find((value, index, arr) => {
      if (value.msgId === msgId) {
        value.status = 'Seen';
        return true;
      }
      return false;
    });

    ImStore.emitChange();
  }

  // TODO. Update realm of the status for message.
  Persister.resetMessageStatus(msgId);
  // ImStore.emitChange(CHANGE_EVENT.UPDATE, message);
};

let _getEarlier = () => {
  _data.page++;
  return _resovleMessages(false);
  // ImStore.emitChange();
};

module.exports = ImStore;
