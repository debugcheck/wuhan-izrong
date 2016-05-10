/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
let Icon = require('react-native-vector-icons/Ionicons');
const {View, TextInput, Platform,TouchableOpacity, Text} = React;

let SearchBar = React.createClass({

  getInitialState: function() {
    return {
      editAble:false,
      text:''
    }
  },

  propTypes:{
    textChange:React.PropTypes.func.isRequired
  },

  textChange: function(text){
    this.props.textChange(text);
    this.setState({text:text});
  },

  renderBar: function() {
    if(this.state.text!='' || this.state.editAble) {
      return (
        <TextInput
          autoFocus={this.state.editAble}
          onBlur={() => this.setState({editAble:false}) }
          onFocus={() => this.setState({editAble:true}) }
          onChangeText={(text) => this.textChange(text)}
          returnKeyType={'search'}
          style={{color: '#4fc1e9',height:(Platform.OS === 'ios')?30:60,backgroundColor:'#ffffff',marginTop:(Platform.OS === 'ios')?0:-15,marginLeft:10,marginRight:10}}>
        </TextInput>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => {this.setState({editAble:true})}}
          style={{height:(Platform.OS === 'ios')?30:60,justifyContent:'center', alignItems:'center',backgroundColor:'#ffffff',marginTop:(Platform.OS === 'ios')?0:-15,marginLeft:10,marginRight:10}}
        >
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Icon name="ios-search-strong" size={20} color='#b4b4b4' />
            <Text style={{color:'#b4b4b4', marginLeft:5, fontSize:18}}>搜索</Text>
          </View>
        </TouchableOpacity>
      );
    }
  },

  render: function() {
    return (
      <View style={{backgroundColor:'#f0f0f0',paddingBottom:5,borderBottomColor:'#d3d5e0',borderBottomWidth:1}}>
        <View
          style={{height:30,backgroundColor:'#ffffff',marginTop:5,marginLeft:10,marginRight:10,borderRadius:6}}>
          {this.renderBar()}
        </View>
      </View>
    );
  }
});

module.exports = SearchBar;
