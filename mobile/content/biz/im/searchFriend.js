/**
 * Created by baoyinghai on 5/12/16.
 */
let React = require('react-native');
const {View, TextInput, Text, TouchableOpacity, Platform, ScrollView} = React;
let NavBarView = require('../../framework/system/navBarView');
let DictStyle = require('../../constants/dictStyle');
let HeaderPic = require('./headerPic');
let ImUserInfo = require('./searchResultDetail');
let { Alert } = require('mx-artifacts');
let ContactAction = require('../../framework/action/contactAction');
let ContactStore = require('../../framework/store/contactStore');
let initS = '输入姓名以搜索好友/手机号';
let nullRes = '无符合条件的用户';
let Validation = require('../../comp/utils/validation');

let SearchFriend = React.createClass({


  getInitialState:function(){
    return {
      dataSource: [],
      keyWord:'',
      justTop:true,
      totalUserAmount:0,
      desc: initS
    }
  },

  toOther: function(data) {
    this.props.navigator.push({
      comp:ImUserInfo,
      param:Object.assign(data,{isStranger:ContactStore.isStranger(data.userId),friendInvite:false})
    });
  },

  renderMore: function() {
    if(this.state.totalUserAmount > this.state.dataSource.length){
      return (
        <TouchableOpacity key={'morebtn'}
                          onPress={() => {this.state.justTop=false;this.searchFriend()}}
                          style={{marginHorizontal:10,borderTopWidth:0.5,  borderTopColor: DictStyle.colorSet.demarcationColor}}>
          <View style={{flexDirection:'row', paddingVertical:5, alignItems:'center',justifyContent:'center'}}>
            <Text>{'显示更多'}</Text>
          </View>
        </TouchableOpacity>
      );
    }else{
      return null;
    }
  },

  renderItem: function(data) {
    return (
    <TouchableOpacity key={data.userId}
                      onPress={() => this.toOther(data)}
                      style={{flex:1,marginHorizontal:10,borderTopWidth:0.5,  borderTopColor: DictStyle.colorSet.demarcationColor}}>
      <View style={{flex:1,flexDirection:'row', paddingVertical:5, alignItems:'center'}}>
        <HeaderPic photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
          <View style={{flex:1,paddingLeft:10}}>
            <Text
              numberOfLines={1}
              style={{flex:1,fontSize:15,color:DictStyle.colorSet.imTitleTextColor, marginLeft: 2}}>{data.realName + '-' +data.orgValue}</Text>
            <Text
              numberOfLines={1}
              style={{flex:1,fontSize:15,color:'#B7C0C7', marginLeft: 2,flexWrap:'wrap'}}>{data.mobileNumber }</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );
  },

  renderSearchResult: function() {
    let ret = [];
    this.state.dataSource.forEach((item)=>{
      ret.push(this.renderItem(item));
    });
    if(this.state.justTop){
      ret.push(this.renderMore());
    }
    return ret;
  },

  searchFriend : function(){
    if(!this.state.keyWord || this.state.keyWord.length == 0){
      Alert('请输入关键字');
      return;
    }
    //else if(!Validation.isMobile(this.state.keyWord)){
    //    Alert('请输入11位数字的手机号码');
    //  return;
    //}
    else{
      this.props.exec(()=>{

        if(this.state.justTop == true) {
          return ContactAction.getTop3IMUserByKeyWord(this.state.keyWord).then((response)=> {
            let userInfo = ContactStore.getUserInfo();
            let nIndex = -1;
            response.imSearchUsers && response.imSearchUsers.forEach((item, index)=> {
              if (userInfo.userId == item.userId) {
                nIndex = index;
              } else {
                item.certified = item.isCertificated;
                item.orgValue = ContactStore.getOrgValueByOrgId(item.orgId);
              }
            });
            if (nIndex != -1) {
              response.imSearchUsers.splice(nIndex, 1);

            }
            return response;
          }).then((response)=> {

            this.setState({dataSource: response.imSearchUsers, totalUserAmount: response.totalUserAmount,desc:nullRes});
          }).catch((err)=> {
            throw err;
          });
        }else{
          return ContactAction.searchUser(this.state.keyWord).then((response)=> {
            let userInfo = ContactStore.getUserInfo();
            let nIndex = -1;
            response.imSearchUsers && response.imSearchUsers.forEach((item, index)=> {
              if (userInfo.userId == item.userId) {
                nIndex = index;
              } else {
                item.certified = item.isCertificated;
                item.orgValue = ContactStore.getOrgValueByOrgId(item.orgId);
              }
            });
            if (nIndex != -1) {
              response.imSearchUsers.splice(nIndex, 1);

            }
            return response;
          }).then((response)=> {

            this.setState({dataSource: response.imSearchUsers, totalUserAmount: response.totalUserAmount,desc:nullRes});
          }).catch((err)=> {
            throw err;
          });

        }

      });
    }

  },


  textChange: function(keyWord){
    this.setState({keyWord:keyWord,dataSource:[],desc:initS});
  },

  render: function() {

    return (
      <NavBarView
        navigator={this.props.navigator}
        title='搜索好友'
      >
       <View style={{paddingTop:5}}>
         <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center',marginRight:10}}>
           <View style={{flex:8,height:40,backgroundColor:'#ffffff',marginHorizontal:10,borderRadius:6,
          justifyContent:'center', alignItems:'center',alignItems:'stretch'}}>
              <TextInput
                returnKeyType="search"
                onSubmitEditing={()=>{this.state.justTop=true;this.searchFriend()}}
                selectionColor={DictStyle.colorSet.textInputColor}
                onChangeText={(text) => this.textChange(text)}
                style={{flex:1,alignSelf:'stretch',color: DictStyle.colorSet.searchBarColor, height:(Platform.OS === 'ios')?30:60,backgroundColor:'#ffffff',marginTop:0,marginLeft:10,marginRight:10}}>
              </TextInput>
           </View>
           <TouchableOpacity style={{flex:1,height:(Platform.OS === 'ios')?30:60,justifyContent:'center',alignItems:'center'}}
                             onPress={()=>{this.state.justTop=true;this.searchFriend()}}>
             <Text style={{color:'#3C62E4',fontSize:16}}>搜索</Text>
           </TouchableOpacity>
         </View>

         {(()=>{

           if(this.state.dataSource && this.state.dataSource.length > 0){
             return (
               <ScrollView style={{flexDirection: 'column',backgroundColor:'#FEFEFE', marginTop:5}}>
                 {this.renderSearchResult()}
               </ScrollView>
             );

           }else{
             return (
               <View style={{flex:1,justifyContent:'center',marginTop:10}}>
                 <Text style={{textAlign:'center',color:DictStyle.searchFriend.nullUnitColor}}>{this.state.desc}</Text>
               </View>
             );
           }

         })()}

         </View>
      </NavBarView>
    );
  }
});

module.exports = SearchFriend;
