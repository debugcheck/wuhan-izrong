'use strict';

let React = require('react-native');
let {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Dimensions,
  Image
} = React;
let dismissKeyboard = require('react-native-dismiss-keyboard');
let TimerMixin = require('react-timer-mixin');
let {Alert} = require('mx-artifacts');
let Validation = require('../../comp/utils/validation');

let SMSTimer = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function () {
    return {
      verify: '',
      time: '点击获取',
      active: '',
      click: false,
      disabled: false
    };
  },

  getDefaultProps(){
    return {
      isNeed: false
    };
  },

  changeVerify: function () {
    if (this.state.time == '重新获取' || this.props.isNeed) {
      this.setState({
        startTime: new Date().getTime(),
        deadline: 60,
        disabled: true,
        tim: this.setInterval(this.updateText, 1000)
      });
    } else if (this.state.time == '点击获取') {
      this.setState({
        startTime: new Date().getTime(),
        deadline: 60,
        disabled: true,
        tim: this.setInterval(this.updateText, 1000)
      });
    }
  },

  selectVerifyFunction: function () {
    if (!this.state.disabled) {
      if (this.props.parameter.length != 11) {
        Alert('请输入完整的手机号码');
      } else {
        dismissKeyboard();
        this.props.exec(() => {
          return this.props.func({
            mobileNo: this.props.parameter
          }).then((response) => {
            this.changeVerify();
          }).catch((errorData) => {
            throw errorData;
          });
        });
      }
    }
  },

  updateText: function () {
    let nowTime = new Date().getTime();
    let timeGo = Math.floor((nowTime - this.state.startTime) / 1000);
    let t = --this.state.deadline;
    if (t + timeGo > 60) {
      t = timeGo >= 60 ? 0 : 60 - timeGo;
    }
    this.setState({
      deadline: t,
      time: t + '秒'
    });
    if (t == 0) {
      this.setState({
        time: '重新获取',
        click: true,
        disabled: false
      });
      this.clearInterval(this.state.tim);
    }
  },

  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <View style={{flexDirection: 'row', flex: 1, marginTop: 20}}>
        <View style={[styles.view, styles.radius]}>
          <Image source={require('../../image/utils/phone.png')}
                 style={{height: 16, width: 16, marginLeft:9}}
          />
          <TextInput style={[styles.input, {width: width - 170}]} underlineColorAndroid="transparent"
                     placeholder="短信验证码" onChangeText={(text) => this.props.onChanged( 'verify',text)}
                     autoCorrect={false} maxLength={6} keyboardType="number-pad" placeholderTextColor="#386085"
                     clearButtonMode="while-editing"
          />
        </View>
        <View style={{width: 75, marginLeft: 12}}>
          <TouchableOpacity
            style={[{width: 75, height: 47}, styles.radius, styles.button,
            {backgroundColor: this.state.disabled ? '#86929e' : '#8bb0d9'}]}
            onPress={this.selectVerifyFunction}
            activeOpacity={this.state.disabled ? 1 : 0.5 }
          >
            <Text style={[styles.fontColor]}>{this.state.time}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

let styles = StyleSheet.create({
  view: {
    height: 47,
    borderColor: '#0a1926',
    borderWidth: 0.5,
    backgroundColor: '#0a1926',
    flexDirection: 'row',
    alignItems: 'center', flex: 1
  },
  input: {
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 9
  },
  radius: {
    borderRadius: 4
  },
  button: {
    height: 47,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fontColor: {
    color: 'white'
  },
  color: {
    backgroundColor: '#8bb0d9'
  }

});
module.exports = SMSTimer;
