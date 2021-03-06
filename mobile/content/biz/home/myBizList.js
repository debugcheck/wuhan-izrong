/**
 * Created by cui on 16/4/21.
 */
let React = require('react-native');
let {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Dimensions,
  Image,
  StyleSheet,
  } = React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let { Alert, Button } = require('mx-artifacts');
let Adjust = require('../../comp/utils/adjust');
let MyBizDetail = require('./myBizDetail');

let MarketAction = require('../../framework/action/marketAction');

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let MyBizList = React.createClass({
  getInitialState: function () {
    return {
      dataSource: data.cloneWithRows(this.props.marketData.contentList),
    };
  },
  componentWillMount: function () {
  },
  render() {
    return (
      <View style={{width:screenWidth,height:screenHeight-144,backgroundColor: '#162a40'}}>
        <View style={{height:26,flexDirection:'row',marginTop:10,marginLeft:5}}>
          <Text style={{position:"absolute",left:0,top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'方向'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'期限'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(120),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'金额'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(200),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'利率'}
          </Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
        />
      </View>
    );
  },
  _renderRow: function (rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this.toDetail(MyBizDetail,rowData)} underlayColor='#000'>
        <View
          style={{flexDirection:'row',height: 50, backgroundColor: '#1e3754',alignItems:'center',borderBottomWidth:0.7,borderBottomColor:'#0a1926'}}>
          <Image style={{width:25,height:25,marginLeft:15,borderRadius:5}}
                 source={rowData.bizOrientationDesc == '出'?require('../../image/market/issue.png'):require('../../image/market/receive.png')}
          />
          <Text
            style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:15, marginTop:15,color:rowData.status == 'ACTIVE'?'white':'#386085'}}>
            {rowData.term == null || rowData.term == 0 ? '--' : rowData.term + '天'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(120),top:0, marginLeft:15,marginTop:15,color:rowData.status == 'ACTIVE'?'rgba(175,134,86,1)':'#386085'}}>
            {rowData.amount == null || rowData.amount == 0 ? '--' : rowData.amount / 10000 + '万'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(200),top:0, marginLeft:15, marginTop:15,color:rowData.status == 'ACTIVE'?'white':'#386085'}}
            numberOfLines={1}>
            {rowData.rate == null || rowData.rate == 0 ? '--' : rowData.rate + '%'}
          </Text>
          {this.renderFreshBtn(rowData)}
        </View>
      </TouchableHighlight>
    )
  },

  renderFreshBtn: function (rowData) {
    if (rowData.status == 'ACTIVE') {
      return (
        <View>
          <Button
            containerStyle={{flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:5,position:"absolute",left:Adjust.width(240),top:0,marginTop:-15,backgroundColor: '#4fb9fc',height:30,width:Adjust.width(85)}}
            style={{fontSize: 15, color: '#ffffff'}}
            disabled={this.state.disabled}
            onPress={() => this.freshBiz(rowData)}
          >
            刷新
          </Button>
        </View>
      );
    } else {
      return (
        <View></View>
      );
    }
  },

  freshBiz: function (rowData) {
    this.refreshBizOrder(rowData);
  },
  toDetail: function (name, rowData) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          marketInfo: rowData
        }
      })
    }
  },

  refreshBizOrder: function (rowData) {
    this.props.exec(
      ()=> {
        return MarketAction.refreshBizOrder({
            orderId: rowData.id
          }
        ).then((response)=> {
          Alert('刷新成功');
        }).catch((errorData) => {
          throw errorData;
        });
      }
    );
  },

  _changeData: function () {
    this.setState({
      dataSource: data.cloneWithRows(this.props.marketData.contentList),
    })
  }


})

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
module.exports = MyBizList;
