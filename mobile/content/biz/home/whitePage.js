/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableHighlight,
  }=React;
var NavBarView = require('./navBarView');

var WhitePage = React.createClass({

  render: function() {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} title={title} showBack={false}>
      </NavBarView>
    );
  }
});

module.exports = WhitePage;
