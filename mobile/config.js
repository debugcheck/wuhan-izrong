
var developConfig = {
  Dev: false, // Switch for log. true means print.
  Host: 'http://192.168.64.205:9101/fas',
  //Host: 'http://192.168.64.248:9081/fas',
  //Host: 'http://192.168.64.216:9081/fas',
  //Host: 'http://139.196.174.42:9201/fas',
  //Host: 'http://192.168.64.248:9081/fas',
  //ImHost: '139.196.174.42:4000',
  //ImHost:'192.168.61.84:4000',//dev

  //ImHost:'192.168.64.205:4000',
  //ImHost:'192.168.64.231:3000',
  ImHost: '192.168.64.223:3000'
};

var productConfig = {
  Dev: false, // Switch for log. true means print.
  //Host: 'http://192.168.64.205:9101/fas',
  //Host: 'http://192.168.64.216:9081/fas',
  Host: 'http://139.196.174.42:9201/fas',
  //Host: 'http://192.168.64.248:9081/fas',
  ImHost: '139.196.174.42:4000',
  //ImHost:'192.168.61.84:4000',//dev
  //ImHost:'139.196.174.42:4000',
  //ImHost:'192.168.64.231:3000',
  //ImHost: '192.168.64.223:3000'
};

var Config = developConfig;

module.exports = Config;
//module.exports = function () {
//  //switch(process.env.NODE_ENV){
//  //  case 'develop':
//  //    return developConfig;
//  //  case 'product':
//  //    return productConfig;
//  //  default :
//  //    return productConfig;
//  //}
//  return {...developConfig};
//};

