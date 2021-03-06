//let ImAction = require('../action/imAction');
let ImStore = require('../store/imStore');
let { MSG_TYPE, SESSION_TYPE, COMMAND_TYPE, UPDATE_GROUP_TYPE, NOTICE_TYPE, DELETE_TYPE } = require('../../constants/dictIm');
let KeyGenerator = require('../../comp/utils/keyGenerator');
let ContactSotre = require('../store/contactStore');
let AppStore = require('../store/appStore');
let {Alert} = require('mx-artifacts');

let _dealMsg = function (message, socket) {
  try {
    let userInfo = ContactSotre.getUserInfo();
    let userId = userInfo.userId;
    //let lastSyncTime = userInfo.lastSyncTime ? userInfo.lastSyncTime.getTime() : new Date().getTime();
  console.log(message);
  switch (message.msgType) {
    case MSG_TYPE.EXCEPTION:
      console.log('[error] %s', message.errMsg);
      break;
    case MSG_TYPE.REC_P2P_MSG:
      ImStore.saveMsg({
        sessionId: KeyGenerator.getSessionKey(SESSION_TYPE.USER, message.fromUid, userId),
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
      }, userId);
      break;
    case MSG_TYPE.SERVER_REC_CONFIRM:
      ImStore.ackMsg(message.msgId, message.toUid);
      break;
    case MSG_TYPE.MSG_IS_MUTE:
      ImStore.ackMsg(message.msgId, message.toUid,true);
      break;
    case MSG_TYPE.GROUP_JOIN_INVITE:
      ImStore.saveMsg({
        sessionId: KeyGenerator.getSessionKey(NOTICE_TYPE.INVITE, message.groupId, userId, message.inviterId),
        groupId: message.groupId,
        groupName: message.groupName,
        groupOwnerId: message.groupOwnerId,
        msgType: SESSION_TYPE.GROUP_NOTICE,
        revTime: new Date(),
        noticeType: NOTICE_TYPE.INVITE,
        groupInviterName: message.groupInviterName,
        groupInviterOrgValue: message.groupInviterOrgValue
      }, userId);
      break;
    case MSG_TYPE.REC_GROUP_MSG:
      ImStore.saveMsg({
        sessionId: KeyGenerator.getSessionKey(SESSION_TYPE.GROUP, message.gid, userId),
        msgId: message.msgId,
        fromUId: message.fromUid,
        groupId: message.gid,
        toId: null,
        type: SESSION_TYPE.GROUP,
        content: message.content,
        contentType: message.contentType,
        msgType: message.msgType,
        revTime: new Date(message.sendDate),
        isRead: Boolean(false),
        status: 'Sean'
      }, userId);
      break;
    //已测,小红点及数字不消失
    case MSG_TYPE.PLATFORM_INFO:
      //if (lastSyncTime < message.createDate) {
        ImStore.createPlatFormInfo(message.infoId,
          message.title, message.content,
          new Date(message.createDate), userId);
        ContactSotre.syncReq(new Date(message.createDate));
        //lastSyncTime = message.createDate;
      //}
      break;
    //已测 weisen
    case MSG_TYPE.HOME_PAGE:
      message.homePageList && ImStore.createHomePageInfo(message.homePageList);
      break;
    //已测  weisen
    case MSG_TYPE.CONTANCT_INFO_UPDATE:
    {
      if (message.userId == AppStore.getUserId()) {
        AppStore.updateUserInfoByPush(message);
      }
      //也要更新联系人  群主消息在联系人中有备份.
      ImStore.updateContactInfo(message);
    }
      break;
    //已测
    case MSG_TYPE.CONTANCT_INFO_DELETE:
      if (message.userId == AppStore.getUserId()) {
        AppStore.deleteLoginUser();
      } else {
        ImStore.deleteContactInfo(message.userId);
      }
      break;
    case MSG_TYPE.GROUP_INFO_UPDATE:
      ContactSotre.createGroup(message.groupId, message.groupName, message.groupOwnerId, message.members, false);
      switch (message.action) {
        case UPDATE_GROUP_TYPE.CREATE_GROUP:
          ContactSotre.createGroup(message.groupId, message.groupName, message.groupOwnerId, message.members, false);
          break;
        case UPDATE_GROUP_TYPE.UPDATE_GROUP_NAME:
          if (message.groupOwnerId != userId) {
            ImStore.saveMsg({
              sessionId: KeyGenerator.getSessionKey(NOTICE_TYPE.UPDATE_GROUP_NAME, message.groupId, userId),
              groupId: message.groupId,
              groupName: message.groupName,
              groupOwnerId: message.groupOwnerId,
              msgType: SESSION_TYPE.GROUP_NOTICE,
              revTime: new Date(),
              noticeType: NOTICE_TYPE.UPDATE_GROUP_NAME
            }, userId);
          }
          break;
        case UPDATE_GROUP_TYPE.UPDATE_GROUP_IMAGE_URL:
          break;
        case UPDATE_GROUP_TYPE.ADD_GROUP_MEMBER:
          //TODO: 把userInfo加入到IMUserInfo表中
          if (userId != message.userInfo.fulfillmentValue.userId) {
            ContactSotre.saveIMUserInfo(message.userInfo.fulfillmentValue);
            ImStore.saveMsg({
              sessionId: KeyGenerator.getSessionKey(NOTICE_TYPE.INVITED, message.groupId, userId, message.userInfo.fulfillmentValue.userId),
              groupId: message.groupId,
              groupName: message.groupName,
              groupOwnerId: message.groupOwnerId,
              msgType: SESSION_TYPE.GROUP_NOTICE,
              revTime: new Date(),
              noticeType: NOTICE_TYPE.INVITED,
              realName: message.userInfo.fulfillmentValue.realName,
              orgValue: ContactSotre.getOrgValueByOrgId(message.userInfo.fulfillmentValue.orgId)
            }, userId);

          }
          break;
        case UPDATE_GROUP_TYPE.KICK_OUT_GROUP_MEMBER:
        case UPDATE_GROUP_TYPE.LEAVE_GROUP:
          //TODO 退出群组的处理...
          if (message.action == UPDATE_GROUP_TYPE.LEAVE_GROUP || userId != message.groupOwnerId) {
            ImStore.saveMsg({
              sessionId: KeyGenerator.getSessionKey(NOTICE_TYPE.LEAVE_GROUP, message.groupId, userId, message.userInfo.userId),
              groupId: message.groupId,
              groupName: message.groupName,
              groupOwnerId: message.groupOwnerId,
              msgType: SESSION_TYPE.GROUP_NOTICE,
              revTime: new Date(),
              noticeType: NOTICE_TYPE.LEAVE_GROUP,
              userId: message.userInfo.userId
            }, userId);
          }
          break;
        default:
          console.log('None message type matched! [%s]', message.msgType);
          console.log('NOT_MATCH' + message);
          break;
      }
      break;
    case MSG_TYPE.GROUP_INFO_DELETE:
      // 区分被踢和解散
      let noticeType = DELETE_TYPE.KICK_OUT;
      if (message.action == DELETE_TYPE.DELETE_GROUP) {
        noticeType = DELETE_TYPE.DELETE_GROUP;
      }
      let group = ContactSotre.getGroupDetailById(message.groupId);
      if (message.action == DELETE_TYPE.DELETE_GROUP && userId != group.groupMasterUid) {
        ImStore.saveMsg({
          sessionId: KeyGenerator.getSessionKey(noticeType, message.groupId, userId),
          groupId: message.groupId,
          groupName: group.groupName,
          groupOwnerId: group.groupMasterUid,
          msgType: SESSION_TYPE.GROUP_NOTICE,
          revTime: new Date(),
          noticeType: noticeType,
          userId: group.groupMasterUid
        }, userId);
        ContactSotre.leaveGroup(message.groupId);
      } else {
        //ContactSotre.deleteMemberFromGroup(message.groupId, userId)
        // 是否删除
        ContactSotre.kickOut(message.groupId);
      }
      break;
    case MSG_TYPE.SYNC_REQ:
      socket.send({command: COMMAND_TYPE.SYNC_REQ});
      break;
    case MSG_TYPE.FORCE_LOGOUT:
      //强制登出
      AppStore.forceLogout();
      break;
    case MSG_TYPE.SYNC_RES:
      console.log('sync' , message);
        message.msgArray && message.msgArray.forEach((item)=> {
          _dealMsg(JSON.parse(item), socket);
        });
        //ContactSotre.syncReq(new Date());
        break;
      //已测
      case MSG_TYPE.CONTANCT_INFO_CERTIFY:
      {
        if (message.userId == AppStore.getUserId()) {
          AppStore.updateUserInfo('isCertificated', message.isCertificated);
          //if (Platform.OS == 'android') {
          //  NotificationModule.showNotification("系统提示", "爱资融", "您已通过系统管理员的认证");
          //}
        }
        //也要更新联系人  群主消息在联系人中有备份.
        ImStore.updateContactInfo(message);
      }
        break;
      //已测
      case MSG_TYPE.CONTANCT_INFO_UNCERTIFY:
      {
        if (message.userId == AppStore.getUserId()) {
          AppStore.updateUserInfo('isCertificated', message.isCertificated);

          //if (Platform.OS == 'android') {
          //  NotificationModule.showNotification("系统提示", "爱资融", "您已被系统管理员取消认证");
          //}
        }
        //也要更新联系人  群主消息在联系人中有备份.
        ImStore.updateContactInfo(message);
      }
        break;
      //已测
      case MSG_TYPE.CONTANCT_INFO_FREEZE:
        //if (message.userId == AppStore.getUserId()) {
        //  if (Platform.OS == 'android') {
        //    NotificationModule.showNotification("系统提示", "爱资融", "您的帐户已被冻结,请联系系统管理员");
        //  }
        //  AppStore.freezAccount();
        //}
        break;
      case MSG_TYPE.FRIEND_INVITE:
        ContactSotre.newFriendNotic(Object.assign({
          noticId: KeyGenerator.getSessionKey(SESSION_TYPE.NEWFRIEND, message.userInfo.userId, userId),
          sessionId: KeyGenerator.getSessionKey(SESSION_TYPE.NEWFRIEND, 'new', userId)
        }, message.userInfo), userId);
        break;
      case MSG_TYPE.FRIEND_PROMISE:
      {
        //ContactSotre.updateFriendList({userId:message.uid},userId);
        let userInfo = ContactSotre.getUserInfoByUserId(message.uid);
        ContactSotre.acceptNewFriendInvite({
          noticId: KeyGenerator.getSessionKey(SESSION_TYPE.ACCEPTNEWFRIEND, userInfo.userId, userId),
          userId: userInfo.userId,
          sessionId: KeyGenerator.getSessionKey(SESSION_TYPE.NEWFRIEND, 'new', userId)
        }, userId);
        //console.log(message.uid + '同意加你为好友');
      }
        break;
      case MSG_TYPE.ORG_INFO_UPDATE:
        AppStore.updateOrgInfo(message);
        break;
      default:
        console.log('None message type matched! [%s]', message.msgType);
        console.log('NOT_MATCH' + message);
    }
  }catch(err){
    Alert('推送异常,请联系管理员['+ message.msgType+'],' + err);
  }
};


let Resolver = {
  deal: function (message, socket) {
    switch (message.type) {
      case 'message':
        this._dealMessage(JSON.parse(message.data), socket);
    }
  },
  _dealMessage: _dealMsg,

  solve: function (message) {
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
      case COMMAND_TYPE.SYNC_REQ:
        msgToSend = message;
        break;
      case COMMAND_TYPE.KPI_APP:
        msgToSend = message;
        break;
      default:
        //console.log('None message type matched! [%s]', message.msgType);
    }
    return msgToSend;
  }
};

module.exports = Resolver;
