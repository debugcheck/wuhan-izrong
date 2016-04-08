'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  ActionSheetIOS,
  Text,
  View,
  } = React;
var Item = require('../../comp/utils/item');
var NavBarView = require('../../framework/system/navBarView');

var AboutUs = React.createClass({
  getInitialState(){
    return {
      phone: '022-28405347',
      email: 'bbcp.bankoftianjin.com',
      versionNo: '0.0.0.1',
      content: '     平台秉着"平等、互利、开放、合作、务实、创新"的原则,推动成员行在流动性互助、金融功能互助、投资业务互助、信贷业务互助和信息政策互助方面加强合作'
    }
  },

  render(){
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='关于我们' showBack={true} showBar={true}>
        <View style={{paddingBottom:24,backgroundColor:'#162a40'}}>
          <View style={{marginTop:20,flexDirection:'column',alignItems:'center',paddingHorizontal:16}}>
            <Image style={styles.logo} source={require('../../image/login/logo.png')}/>
            <Text style={styles.title}>环渤海银银合作平台</Text>
          </View>
          <Text style={styles.content}>
            {this.state.content}
          </Text>
        </View>
        <View style={[{backgroundColor:'white'}]}>
          <Item desc="客服热线:" img={false} icon={false} top={true} value={this.state.phone}/>
          <Item desc="网站邮箱:" img={false} icon={false} value={this.state.email}/>
          <Item desc="版本号:" img={false} icon={false} value={this.state.web}/>
        </View>
        <View style={{paddingTop:32,alignItems:'center'}}>
          <Text style={styles.font}>隐私政策</Text>
          <Text style={styles.font}>© 2015,all rights reserved.</Text>
        </View>
        <View style={[styles.borderBottom,{marginTop:6,marginHorizontal:12}]}/>
      </NavBarView>
    )
  }
});
var styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 1
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderColor: '#c8c7cc'
  },
  font: {
    color: '#ffffff',
    fontSize: 12
  },
  title: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 18
  },
  content: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 23,
    paddingHorizontal: 16
  },
  logo: {
    marginTop: 30,
    height: 80,
    width: 160
  }
});
module.exports = AboutUs;
