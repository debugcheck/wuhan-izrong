/**
 * Created by cui on 16/4/6.
 */
let React = require('react-native');
let {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  } = React;

let DictStyle = require('../../constants/dictStyle');
let NavBarView = require('../../framework/system/navBarView');
let CountedTextInput = require('../../comp/utils/CountedTextInput');
let {Alert} = require('mx-artifacts');

let Remarks = React.createClass({
  getInitialState(){
    return {
      remarkText:this.props.param.remarkText
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='备注' actionButton={this.renderFinish}>
        <View style={{backgroundColor:'white',marginTop:10}}>
          <CountedTextInput
              placeholder="请输入备注(限50字)"
              maxLength={50}
              callback={(text) => this.setState({remarkText: text})}
              stateCallback={(bOut) => this.setState({bOpinionOut: bOut})}
              value={this.state.remarkText}
          />
        </View>
      </NavBarView>
    )
  },
  renderFinish: function () {
    return (
      <TouchableOpacity style={{marginLeft: -20,padding:10}} onPress={()=>this.finish()}>
        <Text style={{color:'white'}}>{'完成'}</Text>
      </TouchableOpacity>
    );
  },
  onChangeText(value){
    this.setState({remarkText: value});
  },
  finish: function () {
    let reg = /^[\w\u4e00-\u9fa5\u0000-\u00FF\uFF00-\uFFFF。、“”……——【】《》]+$/g;

    if(this.state.remarkText.length >50){
        Alert('字数超过限制(50字以内)');
    } else if (!reg.test(this.state.remarkText)) {
        Alert('请输入正确的中英文文本');
    } else {
      this.props.param.callBackRemarks(this.state.remarkText);
      this.props.navigator.pop();
    }
  }
});

let styles = StyleSheet.create({});

module.exports = Remarks;
