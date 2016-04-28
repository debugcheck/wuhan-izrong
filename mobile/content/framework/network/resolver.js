//let ImAction = require('../action/imAction');
let ImStore = require('../store/imStore');
let { MSG_TYPE, SESSION_TYPE, COMMAND_TYPE } = require('../../constants/dictIm');
let KeyGenerator = require('../../comp/utils/keyGenerator');
let ContactSotre = require('../store/contactStore');

let _dealMsg = function (message) {
  console.log(message);
  switch (message.msgType) {
    case MSG_TYPE.EXCEPTION:
      console.log('[error] %s', message.errMsg);
      break;
    case MSG_TYPE.REC_P2P_MSG:
      // ImAction.receive({
      ImStore.saveMsg({
        sessionId: KeyGenerator.getSessionKey(SESSION_TYPE.USER, message.fromUid),
        // sessionId: 'user:3',
        msgId: message.msgId,
        fromUId: message.fromUid,
        groupId: null,
        toId: null,
        type: SESSION_TYPE.USER,
        contentType: message.contentType,
        content: message.content,
        msgType: message.msgType,
        revTime: new Date(message.sendDate),
        isRead: Boolean(false),
        status: 'Seen'
      });
      break;
    case MSG_TYPE.SERVER_REC_CONFIRM:
      ImStore.ackMsg(message.msgId, message.toUid);
      break;
    case MSG_TYPE.GROUP_JOIN_INVITE:
      ImStore.saveMsg({
        sessionId:KeyGenerator.getSessionKey(SESSION_TYPE.INVITE, message.groupId),
        groupId:message.groupId,
        groupName:message.groupName,
        groupOwnerId:message.groupOwnerId,
        msgType:SESSION_TYPE.INVITE,
        revTime:new Date()
      });
      break;
    case MSG_TYPE.REC_GROUP_MSG:
      ImStore.saveMsg({
        sessionId:KeyGenerator.getSessionKey(SESSION_TYPE.GROUP, message.gid),
        msgId:message.msgId,
        fromUId:message.fromUid,
        groupId:message.gid,
        toId:null,
        type:SESSION_TYPE.GROUP,
        content:message.content,
        contentType:message.contentType,
        msgType:message.msgType,
        revTime:new Date(message.sendDate),
        isRead:Boolean(false),
        status:'Sean'
      });
      break;
    case MSG_TYPE.PLATFORM_INFO:
    {
      ImStore.createPlatFormInfo(message.req, message.url);
      ContactSotre.syncReq(message.createDate);
    }
      break;
    case MSG_TYPE.HOME_PAGE:
      ImStore.createHomePageInfo(message.info, message.title, message.content, message.createDate);
      break;
    case MSG_TYPE.CONTANCT_INFO_UPDATE:
      ImStore.updateContactInfo(message.address,
        message.realName, message.email, message.nameCardFileUrl, message.department,
        message.publicDepart, message.jobTitle, message.publicTitle, message.mobileNumber, message.publicMobile,
        message.phoneNumber, message.publicPhone, message.publicEmail, message.publicAddress, message.publicWeChat,
        message.photoFileUrl, message.qqNo, message.publicQQ, message.weChatNo, message.userId, message.orgId)
      break;
    case MSG_TYPE.CONTANCT_INFO_DELETE:
      ImStore.deleteContactInfo(message.userIdList);
      break;
    case MSG_TYPE.GROUP_INFO_UPDATE:
      ContactSotre.createGroup(message.groupId, message.groupName,message.groupOwnerId,message.members,false);
      break;
    case MSG_TYPE.GROUP_INFO_DELETE:
      ContactSotre.leaveGroup(message.groupId);
      break;
    case MSG_TYPE.SYNC_REQ:
      message.msgArray.forEach((item)=>{
        _dealMsg(JSON.parse(item));
      });
      break;
    default:
      console.log('None message type matched! [%s]', message.msgType);
  }
};


let Resolver = {

  deal: function (message) {
    switch (message.type) {
      case 'message':
        this._dealMessage(JSON.parse(message.data));
    }
  },
  _dealMessage: _dealMsg,

  solve: function(message) {
    let msgToSend = {};
    switch (message.msgType) {
      case COMMAND_TYPE.SEND_P2P_MSG:
        msgToSend = {
          toUid: message.toId,
          contentType: message.contentType,
          content: message.content,
          msgId: message.msgId,
          command: COMMAND_TYPE.SEND_P2P_MSG
        };
        break;
      case COMMAND_TYPE.SEND_GROUP_MSG:
        msgToSend = {
          toGid: message.groupId,
          // type: message.contentType,
          contentType: message.contentType,
          content: message.content,
          msgId: message.msgId,
          command: COMMAND_TYPE.SEND_GROUP_MSG
        };
        break;
      default:
        console.log('None message type matched! [%s]', message.msgType);
    }

    return msgToSend;
  }

};

module.exports = Resolver;
