'use strict';

let React = require('react-native');
let {
  View,
  TouchableOpacity,
  Text,
  Platform
} = React;
let Icon = require('react-native-vector-icons/Ionicons');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Device } = require('mx-artifacts');

const DictStyle = require('../../constants/dictStyle');

let NavBarView =
  React.createClass({
  PropTypes: {
    showBar: React.PropTypes.bool,
    showBack: React.PropTypes.bool,
    title: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    fontColor: React.PropTypes.string,
    contentBackgroundColor: React.PropTypes.string,
    actionButton: React.PropTypes.func,
    backAction: React.PropTypes.func,
    navBarBottomWidth: React.PropTypes.string
  },
  getDefaultProps: function () {
    return {
      showBar: true,
      showBack: true,
      title: '',
      backgroundColor: DictStyle.colorSet.navBar,
      fontColor: DictStyle.colorSet.navBarFont,
      contentBackgroundColor: DictStyle.colorSet.content,
      actionButton: null,
      backAction: null,
      navBarBottomWidth: 0
    };
  },
  _renderLeft: function () {
    if (this.props.showBack) {
      return (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={this.props.backAction ? () => this.props.backAction() : () => this.props.navigator.pop()}
        >
          <Icon name="ios-arrow-left" size={30} color={this.props.fontColor} />
        </TouchableOpacity>
      );
    }
  },
  _renderRight: function () {
    if (this.props.actionButton) {
      return this.props.actionButton();
    }
  },
  _renderBar: function () {
    if (this.props.showBar) {
      return (
        <View
          style={[DictStyle.navBar, {
            backgroundColor: this.props.backgroundColor,
            borderBottomWidth: this.props.navBarBottomWidth,
          }]}
        >
          <View style={{width: 44,flex:1}}>
            {this._renderLeft()}
          </View>

            <Text numberOfLines={1} style={{flex:Platform.OS==='ios'?5:2,textAlign:'center',fontSize: 18, color: this.props.fontColor}}>
              {this.props.title}
            </Text>


          <View style={{width:Platform.OS==='ios'? 44:114,flex:1,alignItems:'flex-end',marginRight:10}}>
            {this._renderRight()}
          </View>
        </View>
      );
    }
  },

  render: function () {
    return (
      <View style={{ flex: 1 }} onStartShouldSetResponder={() => dismissKeyboard()}>
        {this._renderBar()}

        <View style={{ flex: 1, backgroundColor: this.props.contentBackgroundColor }} >
            {this.props.children}
        </View>

      </View>
    );
  }
});

module.exports = NavBarView;
