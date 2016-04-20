/**
 * Created by vison on 16/4/8.
 */
'use strict';

let React = require('react-native');
let {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
  TouchableOpacity
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let Validation = require('../../comp/utils/validation');
let Item = require('../../comp/utils/item');
let Icon = require('react-native-vector-icons/Ionicons');
let TextEdit = require('./textEdit');
let { Alert } = require('mx-artifacts');
let UserInfoAction = require('../../framework/action/userInfoAction');
let LoginAction = require('../../framework/action/loginAction');
let Login = require('../../biz/login/login');

let UserInfo = React.createClass({
  getInitialState: function () {
    let userInfo = UserInfoAction.getLoginUserInfo();
    let orgBean = UserInfoAction.getOrgById(userInfo.orgId);
    return {
      photoFileUrl: userInfo.photoFileUrl,
      realName: userInfo.realName,
      userId: userInfo.userId,
      mobileNumber: userInfo.mobileNumber,
      publicMobile: userInfo.publicMobile,
      phoneNumber: userInfo.phoneNumber,
      publicPhone: userInfo.publicPhone,
      qqNo: userInfo.qqNo,
      publicQQ: userInfo.publicQQ,
      weChatNo: userInfo.weChatNo,
      publicWeChat: userInfo.publicWeChat,
      email: userInfo.email,
      publicEmail: userInfo.publicEmail,
      orgBeanName: orgBean.orgValue,
      department: userInfo.department,
      publicDepart: userInfo.publicDepart,
      jobTitle: userInfo.jobTitle,
      publicTitle: userInfo.publicTitle,
      address: userInfo.address,
      publicAddress: userInfo.publicAddress,
      nameCardFileUrl: userInfo.nameCardFileUrl
    }
  },
  componentDidMount() {

  },

  componentWillUnmount: function () {

  },


  selectPhoto: function () {

  },

  toEdit: function (title, name, value, publicName, publicValue, type, maxLength, valid) {
    if (value == '未设置') {
      value = ''
    }
    let {navigator} = this.props;
    if (navigator) {
      navigator.push({
        comp: TextEdit,
        param: {
          title: title,
          name: name,
          value: value,
          publicName: publicName,
          publicValue: publicValue,
          type: type,
          maxLength: maxLength,
          valid: valid
        },
        callBack: this.callBack
      })
    }
  },

  logout: function () {
    this.props.exec(() => {
      return LoginAction.logout(this.state.userId)
        .then((response) => {
          const { navigator } = this.props;
          navigator.resetTo(Login);
        }).catch((errorData) => {
          Alert(errorData);
        });
    });
  },

  renderRow: function (desc, imagePath, name, value, pubName, pubValue, type, maxLength, valid) {

    let showValue = '';
    if (value == null || value == '未填写') {
      showValue = '未填写';
    } else {
      if (pubValue) {
        showValue = value + '(公开)';
      } else {
        showValue = value + '(不公开)';
      }
    }
    return (
      <Item desc={desc} imgPath={imagePath} value={showValue}
            func={() => this.toEdit(desc, name, value, pubName ,pubValue, type, maxLength, valid)}/>
    )
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='个人信息' showBack={true} showBar={true}
                  actionButton={this.renderLogout}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false} backgroundColor='#18304b'>

          <TouchableHighlight style={{backgroundColor:'#162a40'}} activeOpacity={0.8} underlayColor='#18304b'
                              onPress={()=>this.selectPhoto()}>
            <View style = {styles.layout}>
              <View style = {{flex:1}}>
                <Image style={styles.head} resizeMode="cover" source={require('../../image/user/head.png')}/>
              </View>
              <View style = {{flex:1,flexDirection:"row",justifyContent:'flex-end',alignItems:'center'}}>
                <Text style={{color:'#ffffff',fontSize:18,textAlign:'right',paddingRight:20}}>{this.state.realName}</Text>
                <Icon style={{marginRight:20}} name="ios-arrow-right" size={30} color={'#ffffff'}/>
              </View>
            </View>
          </TouchableHighlight>

          {this.renderRow("手机号", require('../../image/user/mobileNo.png'), 'mobile', this.state.mobileNumber, 'publicMobile',
            this.state.publicMobile, 'name', 20, Validation.isPhone)}

          {this.renderRow("座机号", require('../../image/user/telephoneNo.png'), 'telephoneNo', this.state.phoneNumber, 'publicPhone',
            this.state.publicPhone, 'telephone', 13, Validation.isTelephone)}

          {this.renderRow("QQ", require('../../image/user/qqNo.png'), 'qqNo', this.state.qqNo, 'publicQQ',
            this.state.publicQQ, 'number', 20, Validation.isQQ)}

          {this.renderRow("微信", require('../../image/user/wechatNo.png'), 'wechatNo', this.state.weChatNo, 'publicWeChat',
            this.state.publicWeChat, '', 40, '')}

          {this.renderRow("邮箱", require('../../image/user/email.png'), 'email', this.state.email, 'publicEmail',
            this.state.publicEmail, '', 60, Validation.isEmail)}

          {this.renderRow("机构", require('../../image/user/comp.png'), 'organization', this.state.orgBeanName, '',
            '', 'name', 20, '')}

          {this.renderRow("部门", require('../../image/user/comp.png'), 'depart', this.state.department, 'publicDepart',
            this.state.publicDepart, 'name', 20, '')}

          {this.renderRow("职位", require('../../image/user/jobTitle.png'), 'jobTitle', this.state.jobTitle, 'publicTitle',
            this.state.publicTitle, 'name', 20, '')}

        </ScrollView>
      </NavBarView>
    );
  },
  renderLogout: function () {
    return (
      <TouchableOpacity style={{width:150,marginLeft:-20}}
                        onPress={()=>this.logout()}>
        <Text style={{color:'#ffffff'}}>退出登陆</Text>
      </TouchableOpacity>
    );

  }
});

let styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    height: 84,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0a1926'
  },
  img: {
    width: 63,
    height: 63,
    borderRadius: 5,
    marginTop: 18,
    borderColor: '#7f7f7f',
    borderWidth: 1
  },
  head: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginLeft: 20
  }
});


module.exports = UserInfo;
