/**
 * Created by cui on 16/4/7.
 */
let React = require('react-native');
let {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager
  } = React;

let Adjust = require('../../comp/utils/adjust');
let DictStyle = require('../../constants/dictStyle');

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let FilterSelectBtn = React.createClass({
  getInitialState(){
    let rowDefault = this.props.rowDefault;
    let isAll = this.props.isAll;
    return {
      isAll: isAll,
      rowDefault: rowDefault,
      dataSource: this.props.dataList == null ? [] : this.props.dataList
    }
  },
  setDefaultState: function () {
    if (this.props.dataList == null) {

    }else{
      this.setState({
        isAll: true,
        rowDefault: 10000
      });
      {
        this._returnSelectOption(0, this.props.typeTitle, 10000, this.state.isAll)
      }
    }
  },
  render: function () {
    return (
      <View>
        <Text style={{marginTop:5,marginLeft:10,color:'#3b4549'}}>{this.props.typeTitle}</Text>
        <View style={{flexDirection:'row'}}>
          {this.returnAllBtn()}
          <ListView
            contentContainerStyle={{justifyContent: 'flex-start',flexDirection: 'row',flexWrap: 'wrap',}}
            dataSource={data.cloneWithRows(this.deleteFirstObj(this.props.dataList))}
            scrollEnabled={false}
            renderRow={this._renderRow}
            enableEmptySections={true}
          />
        </View>
      </View>
    )
  },
  returnAllBtn: function () {
    if (this.props.dataList == null){
      return <View></View>;
    }else{
      return (
        <TouchableHighlight onPress={() => this._pressAll()} underlayColor='transparent'>
          <View>
            <View
              style={{flex: 1, justifyContent: 'center', marginLeft: 10, marginTop:5, width:Adjust.width(80), height: 33, backgroundColor: this.state.isAll ? '#817fc9':'#e1e3e6', alignItems: 'center', borderRadius: 5,paddingHorizontal:5}}>
              <Text style={{color:this.state.isAll ?'white' : DictStyle.marketSet.fontColor}}>
                {this.props.dataList[0].displayName}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  },
  _renderRow: function (rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={this.state.rowDefault == rowID ? null : () => this._pressRow(rowID)}
                          underlayColor='transparent'>
          <View
            style={{flex: 1,justifyContent: 'center', marginLeft: 10, marginTop:5, width:(this.props.section == 3)?Adjust.width(80):Adjust.width(125.5), height: 33, backgroundColor: this.state.isAll ? '#e1e3e6' : (this.state.rowDefault == rowID ? '#817fc9':'#e1e3e6'), alignItems: 'center', borderRadius: 5 ,paddingHorizontal:5}}>
            <Text
              style={{ fontSize:12, color:(this.state.rowDefault == rowID)? 'white' : DictStyle.marketSet.fontColor}}
              numberOfLines={1}>
              {rowData.displayName}
            </Text>
          </View>
      </TouchableHighlight>
    );
  },
  _pressRow: function (rowID) {
    this.setState({
      isAll: false,
      rowDefault: rowID
    });
    {
      this._returnSelectOption(Number(rowID) + 1, this.props.typeTitle, Number(rowID), this.state.isAll)
    }
  },
  _pressAll: function () {
    this.setState({
      isAll: true,
      rowDefault: 10000
    });
    {
      this._returnSelectOption(0, this.props.typeTitle , 10000, this.state.isAll)
    }
  },
  _returnSelectOption: function (number, title, rowDefault, isAll) {
    this.props.callBack(this.props.dataList[number], title, rowDefault, isAll);
  },

  deleteFirstObj: function (obj) {
    let arr = [];
    if (!!obj) {
      obj.forEach(function (item) {
        if (item.displayCode != 'ALL') {
          arr.push(item);
        }
      });
    }
    return arr;
  }
});

let styles = StyleSheet.create({});

module.exports = FilterSelectBtn;
