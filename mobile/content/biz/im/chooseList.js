/**
 * Created by baoyinghai on 16/4/13.
 */
let React = require('react-native');
const {View, ScrollView} = React;
let NameCircular = require('./nameCircular');
let _ = require('lodash');

let ChooseList = React.createClass({

  getInitialState: function(){
    let memberView = new Array();
    let memberList = this.props.memberList;
    for(let userId in memberList){
      if(!!memberList[userId]){
        memberView.push(memberList[userId]);
      }
    }
    return {
      orgData : _.clone(this.props.memberList),
      memberView:memberView
    }
  },

  deleteMem: function(userId) {
    for(let i =0 ;i < this.state.memberView.length; i ++ ){
      if(this.state.memberView[i].userId == parseInt(userId)){
        this.state.memberView.splice(i,1);
        break;
      }
    }
    this.setState({memberView:this.state.memberView});
  },

  addMem: function(item) {
    this.state.memberView.push(item);
    this.setState({memberView:this.state.memberView});
  },

  componentWillReceiveProps:function(nextProps){
    for(let userId in this.state.orgData){
      if(!this.state.orgData[userId]){
        continue;
      }
      let f = false;
      for(let newUserId in nextProps.memberList){
        if(!nextProps.memberList[newUserId]){
          continue;
        }
        if(userId == newUserId ){
          f = true;
          break;
        }
      }
      if( f == false){
        this.deleteMem(userId);
        this.setState({orgData:_.clone(nextProps.memberList)});
        return;
      }
    }

    for(let userId in nextProps.memberList) {
      if(!nextProps.memberList[userId]){
        continue;
      }
      let f = false;
      for (let newUserId in this.state.orgData) {
        if(!this.state.orgData[newUserId]){
          continue;
        }
        if (userId == newUserId) {
          f = true;
          break;
        }
      }
      if (f == false) {
        this.addMem(nextProps.memberList[userId]);
        this.setState({orgData:_.clone(nextProps.memberList)});
        return;
      }
    }
    this.setState({orgData:_.clone(nextProps.memberList)});

  },

  renderMemberView: function(data) {
    return data.map((item, index)=>{
      return (
        <View key={item.userId} style={{padding:2}}>
          <NameCircular name={item.realName}/>
        </View>
      );
    });
  },

  render: function(){

    return (
      <View style={{backgroundColor:'#1B385E',padding:5, borderBottomWidth:5, borderBottomColor:'#15263A',overflow:'hidden'}}>
        <ScrollView horizontal={true} style={{flexDirection:'row', backgroundColor:'#15263A',overflow:'hidden'}}>
          {this.renderMemberView(this.state.memberView)}
        </ScrollView>
      </View>
    );
  }

});

module.exports = ChooseList;
