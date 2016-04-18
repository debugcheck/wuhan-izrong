/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Component,
  TouchableHighlight
  } = React;
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Alert, Button ,Device} = require('mx-artifacts');
var AlphabetListView = require('react-native-alphabetlistview');

let Register_selectOrg = React.createClass({
  getStateFromStores() {
    this.getOrgList();
    let orgBuildList = AppStore.getOrgList();
    return {
      data: orgBuildList
    };
  },

  //网络请求获取
  getOrgList: function (orgList) {
    this.props.exec(() => {
      return LoginAction.getOrgList({})
        .then((response) => {
          console.log(response);
          AppStore.saveOrgList(response);
          return response;
        }).catch((errorData) => {
          throw errorData;
        });
    });
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },
  componentDidMount() {

  },

  componentWillUnmount: function () {

  },
  _onChange: function () {

  },
  selectItem: function(a,b){

  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='选择机构' showBack={true} showBar={true}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <AlphabetListView
            data={this.state.data}
            cell={Cell}
            cellHeight={30}
            sectionListItem={SectionItem}
            sectionHeader={SectionHeader}
            sectionHeaderHeight={22.5}
            updateScrollState={true}
            onCellSelect={(a,b)=>{
               console.log(a.toString+b.toString());
            }}/>
        </View>
      </NavBarView>
    )
  }
});

let SectionHeader = React.createClass({
  render() {
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.textStyle}>{this.props.title}</Text>
      </View>
    );
  }
});

let SectionItem = React.createClass({
  render() {
    return (
      <Text style={{color:"#327efb"}}>{this.props.title}</Text>
    );
  }
});

let Cell = React.createClass({

  render() {
    return (
      <TouchableHighlight style={{backgroundColor:'#162a40'}} activeOpacity={0.8} underlayColor='#18304b'
                          onPress={()=>this.selectOrgItem(this.props.item)}>
        <View style={{height:40,marginLeft:20,justifyContent:"center",borderBottomWidth:1,borderBottomColor:'#122335'}}>
          <Text style={{color:"#FFFFFF",textAlign:"left"}}>{this.props.item.orgValue}</Text>
        </View>
      </TouchableHighlight>
    );
  },

  selectOrgItem: function (orgItem, callback) {
    console.log(orgItem);
  }
});

let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  textStyle: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  viewStyle: {
    backgroundColor: '#244266',
    marginTop: -1,
    height: 30,
    justifyContent: "center"
  }
});

module.exports = Register_selectOrg;
