/**
 * Created by baoyinghai on 5/16/16.
 */

let React = require('react-native');
let {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let ContactAction = require('../../framework/action/contactAction');
let ContactSotre = require('../../framework/store/contactStore');
let NewFriendStore = require('../../framework/store/newFriendStore');
let { NEW_FRIEND } = require('../../constants/dictEvent');
let AppStore = require('../../framework/store/appStore');
let { Device,Alert } = require('mx-artifacts');
let DictStyle = require('../../constants/dictStyle');
let HeaderPic = require('./headerPic');

let NewFriendList = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, NEW_FRIEND);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, NEW_FRIEND);
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getStateFromStores: function() {
    let userInfo = ContactSotre.getUserInfo();
    return {dataSource:NewFriendStore.queryAllNewNotic(userInfo.userId),
      userInfo:userInfo};
  },

  getInitialState:function(){
    return this.getStateFromStores();
  },

  deleteSession: function(item){
   NewFriendStore.deleteFriendInvite(item.noticId, this.state.userInfo.userInfo)
  },


  acceptInvite: function(item) {
    this.props.exec(()=>{
      ContactAction.acceptFriend(item.userId).then((response) => {
        NewFriendStore.modifyInviteState(item.noticId, this.state.userInfo.userId);
      });
    });

  },

  renderItem: function(item) {
    let {width} = Device;

    return (
      <TouchableOpacity
        key={item.userId}
        onLongPress={
        ()=>
          {
            Alert('确定删除该条记录?', () => {this.deleteSession(item)},()=>{})
          }
        }
        onPress={()=>{

        }}>
        <View
          style={{borderBottomColor: DictStyle.colorSet.demarcationColor,borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, marginHorizontal:10}}>
          <HeaderPic badge={0} name={item.realName} photoFileUrl={item.photoFileUrl} certified={item.certified}/>
          <View
            style={{ flexDirection:'row',paddingHorizontal:10, height:40, width:width-70, justifyContent:'space-between', alignItems:'center'}}>
            <View>
              <Text style={{color:DictStyle.colorSet.imTitleTextColor}}>{item.realName + '-' + item.orgName}</Text>
              <Text numberOfLines={1}
                    style={{marginTop:5,color:'#687886'}}>{'已加你为好友'}</Text>
            </View>

            {(()=>{
              if(item.isAccept){
                return (
                  <Text
                    style={{borderRadius:5,color:'#ffffff', paddingHorizontal:20,paddingVertical:5}}>{'已接受'}</Text>

                );
              }else{
                return (
                  <TouchableOpacity style={{marginRight:10}} onPress={()=>this.acceptInvite(item)}>
                    <View style={{borderRadius: 5, backgroundColor: '#3EC3A4',paddingHorizontal:20,paddingVertical:5}}>
                      <Text
                        style={{color: '#ffffff', textAlign:'center'}}>{'加为好友'}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            })()}

          </View>
        </View>
      </TouchableOpacity>
    );
  },

  renderMessage: function() {
    let ret = [];

    this.state.dataSource.forEach((item) => {
      ret.push(this.renderItem(item));
    });
    return ret;
  },

  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} title='新好友' >
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={{flexDirection: 'column',marginTop:0,backgroundColor:'#F4F4F4'}}>
          {this.renderMessage()}
        </ScrollView>
      </NavBarView>
    );
  }
});

module.exports = NewFriendList ;