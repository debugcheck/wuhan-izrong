/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
  ListView,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ScrollView,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager
  }=React;

let { Alert } = require('mx-artifacts');
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let NavBarView = require('../../framework/system/navBarView');
let SelectBtn = require('./selectBtn');
let Remarks = require('./remarks');
let SelectBusiness1 = require('./selectBusiness1');
let ImagePicker = require('../../comp/utils/imagePicker');


let AppStore = require('../../framework/store/appStore');
let MarketAction = require('../../framework/action/marketAction');
let ImAction = require('../../framework/action/imAction');

let bizOrientationUnit = ['出', '收'];
let termUnit = ['日', '月', '年'];
let amountUnit = ['万', '亿'];

let Publish = React.createClass({
  getInitialState(){
    let filterItems = AppStore.getFilters().filterItems;

    return {
      filterItems: filterItems,
      bizOrientationDefault: 0,
      termDefault: 0,
      amountDefault: 0,
      termText: '',
      amountText: '',
      rateText: '',
      //networt
      term: '',
      rate: '',
      remark: '',
      bizOrientation: 'IN',
      bizCategory: '',
      bizItem: '',
      amount: '',
      fileUrlList: []
    }
  },

  componentWillMount: function () {
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='发布' showBack={false} showBar={true}>
        <View style={{height:screenHeight-113,backgroundColor:'#153757'}}>
          <View style={{flex:1}}>
            <ScrollView>
              {this.renderSelectOrg()}
              {this.renderBusinessType()}
              {this.renderTimeLimit()}
              {this.renderAmount()}
              {this.renderRate()}
              {this.renderAddImg()}
              {this.renderRemarks()}
            </ScrollView>
            {this.renderReleaseBtn()}
          </View>
        </View>
      </NavBarView>
    );
  },
  _dataChange1 (index) {
    this.setState({
      bizOrientationDefault: index,
      bizOrientation: (index == 0) ? 'IN' : 'OUT'
    })
  },
  _dataChange2 (index) {
    this.setState({
      termDefault: index,
      termText: (this.state.termDefault == 0) ? Number(this.state.termText) : (this.state.termDefault == 1) ? Number(this.state.termText) * 30 : Number(text) * 365
    })
  },
  _dataChange3 (index) {
    this.setState({
      amountDefault: index,
      amountText: (this.state.amountDefault == 0) ? Number(this.state.amountText) * 10000 : Number(this.state.amountText) * 100000000
    })
  },
  _termTextChange (text) {
    this.setState({
      termText: (this.state.termDefault == 0) ? Number(text) : (this.state.termDefault == 1) ? Number(text) * 30 : Number(text) * 365
    })
  },
  _amountTextChange (text) {
    this.setState({
      amountText: (this.state.amountDefault == 0) ? Number(text) * 10000 : Number(text) * 100000000
    })
  },
  _rateTextChange (text) {
    this.setState({
      rateText: Number(text)/100
    })
  },
  renderSelectOrg: function () {
    return (
      <TouchableOpacity onPress={()=>this.toPage(SelectBusiness1)} activeOpacity={0.8} underlayColor="#f0f0f0">
        <View
          style={{width: screenWidth-20,marginLeft:10,borderRadius:5,height:36,backgroundColor:'#4fb9fc',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
          <Text
            style={{fontSize:16,marginLeft:10,color:'white'}}>{(this.state.bizCategory == '' && this.state.bizItem == '') ? '选择业务类型' : this.state.bizCategory.displayName + '-' + this.state.bizItem.displayName}</Text>
          <Image style={{margin:10,width:16,height:16}}
                 source={require('../../image/market/next.png')}
          />
        </View>
      </TouchableOpacity>
    )
  },
  renderBusinessType: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{marginLeft:10, color:'white'}}>{'方向'}</Text>
          <Text style={{color:'red'}}>{'*'}</Text>
        </View>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <SelectBtn dataList={bizOrientationUnit} defaultData={this.state.bizOrientationDefault}
                     change={this._dataChange1}/>
        </View>
      </View>
    )
  },
  renderTimeLimit: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white'}}>{'期限'}</Text>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <View style={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10}}>
            <TextInput
              placeholder={'天数'}
              placeholderTextColor='#325779'
              returnKeyType="search"
              maxLength={8}
              onChangeText={(text) => this._termTextChange(text)}
              style={{width:100,height:40,marginLeft:10,color:'#ffd547'}}/>
          </View>
          <SelectBtn dataList={termUnit} defaultData={this.state.termDefault} change={this._dataChange2}/>

        </View>
      </View>
    )
  },
  renderAmount: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white'}}>{'金额'}</Text>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <View style={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10}}>
            <TextInput
              placeholder={'1万-1000亿'}
              placeholderTextColor='#325779'
              returnKeyType="search"
              maxLength={8}
              onChangeText={(text) => this._amountTextChange(text)}
              style={{width:100,height:40,marginLeft:10,color:'#ffd547'}}/>
          </View>
          <SelectBtn dataList={amountUnit} defaultData={this.state.amountDefault} change={this._dataChange3}/>

        </View>
      </View>
    )
  },
  renderRate: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white'}}>{'利率'}</Text>
        <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
          <View style={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10}}>
            <TextInput
              placeholder={'0-100.00'}
              placeholderTextColor='#325779'
              returnKeyType="search"
              maxLength={8}
              onChangeText={(text) => this._rateTextChange(text)}
              style={{width:100,height:40,marginLeft:10,color:'#ffd547'}}/>
          </View>
          <Text style={{marginLeft:10,fontWeight: 'bold', color:'white'}}>{'%'}</Text>
        </View>
      </View>
    )
  },
  renderAddImg: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white'}}>{'添加图片'}</Text>
        <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
          <ImagePicker
            type="all"
            onSelected={(response) => {this.handleSendImage(response)}}
            onError={(error) => this.handleImageError(error)}
            title="选择图片"
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'white'}}
          >
            <Image
              style={{flex:1,width:(screenWidth-60)/5-2,height:(screenWidth-60)/5-2,borderRadius:5}}
              source={{uri:this.state.fileUrlList[0]}}
            />
          </ImagePicker>
        </View>
      </View>
    )
  },
  renderRemarks: function () {
    return (
      <View style={{marginTop:10}}>
        <TouchableHighlight onPress={() => this.toRemarks(Remarks)} underlayColor='rgba(129,127,201,0)'>
          <View
            style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height: 40, backgroundColor: '#102a42'}}>
            <Text style={{marginLeft:10, fontWeight: 'bold', color:'white'}}>
              {'备注'}
            </Text>
            <View>
              <Text style={{marginRight:10, fontWeight: 'bold', color:'#325779'}}
                    numberOfLines={1}>{(this.state.remarksText == '') ? '20字以内' : this.state.remark}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  },
  renderReleaseBtn: function () {
    return (
      <TouchableHighlight onPress={() => this._pressPublish()} underlayColor='rgba(129,127,201,0)'>
        <View
          style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4fb9fc'}}>
          <Text style={{fontWeight: 'bold', color:'white'}}>
            {'发布'}
          </Text>
        </View>
      </TouchableHighlight>
    )
  },
  _pressPublish: function () {
    {
      this.addBizOrder();
    }
  },

  callBackCategoryAndItem: function (category, item) {
    this.setState({
      bizCategory: category,
      bizItem: item
    })
  },

  callBackRemarks: function (remarkText) {
    this.setState({
      remark: remarkText
    })
  },

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          filterItems: this.state.filterItems,
          callBackCategoryAndItem: this.callBackCategoryAndItem
        },
      })
    }
  },

  toRemarks: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          callBackRemarks: this.callBackRemarks
        },
      })
    }
  },

  addBizOrder: function () {
    if (this.state.amountText.length == 0 || this.state.termText.length == 0 || this.state.rateText.length == 0) {

    } else {
      this.props.exec(
        ()=> {
          return MarketAction.addBizOrder({
            id: '',
            term: this.state.termText,
            rate: this.state.rateText,
            remark: this.state.remark,
            bizOrientation: this.state.bizOrientation,
            bizCategory: this.state.bizCategory.displayCode,
            bizItem: this.state.bizItem.displayCode,
            amount: this.state.amountText,
            fileUrlList: this.state.fileUrlList
          }).then((response)=> {
            Alert('发布成功');
          }).catch(
            (errorData) => {
              throw errorData;
            }
          );
        }
      );
    }
  },
  handleSendImage(uri) {
    ImAction.uploadImage(uri)
      .then((response) => {
        let arr = new Array();
        arr = this.state.fileUrlList;
        arr.push(response.fileUrl);
        this.setState({
          fileUrlList: arr
        });
      }).catch((errorData) => {
      console.log('Image upload error ' + JSON.stringify(errorData));
    });
  },

  handleImageError(error) {
    console.log('Image select error ' + JSON.stringify(error));
    Alert('图片选择失败');
  },

});

module.exports = Publish;
