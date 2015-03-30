var api = require('./../apimodules/api.js');
var apisequence = require('./../apimodules/api-sequence.js');

function wp1(req, res){
    var $params = req.params.vars.split("/");
    var $ip = api([
        {
            url: "http://www.telize.com/geoip/$()", 
            res_type: {lat:"latitude", lon:"longitude"}
        }
    ]);
    var $reverseGeoCode = api([
        {
            url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=$(),$()&key=AIzaSyDmqbOvCO6seEzPfFoQi-xn3phiv8igk5M",
            res_type: {addr: "results[0].formatted_address"}
        }
    ])
    var $weather = api([
        {
            url:"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22$()%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
            res_type: {temp:"query.results.channel.item.condition.temp", weather:"query.results.channel.item.condition.text"}
        },
        {
            url:"http://api.openweathermap.org/data/2.5/weather?q=$()",
            res_type: {temp:"main.temp", weather:"weather[0].description"}
        }
    ]);
    var $translate = api([
        {
            url:"https://www.googleapis.com/language/translate/v2?key=AIzaSyDmqbOvCO6seEzPfFoQi-xn3phiv8igk5M&source=en&target=es&q=$()",
            res_type: {de:"data.translations[0].translatedText"}
        }
    ]);
    var seq = [$ip, $reverseGeoCode, $weather, $translate];
    var $as = apisequence(seq, [
        ["$get(0)"],
        ["$(response.response0.lat)","$(response.response0.lon)"],
        ["$(response.response1.country)"],
        ["$(response.response2.weather)"]
    ]);
    var $res = res;
    $as.execute($params, [
        function(data){
            console.log(data);
        },
        function(data){
            console.log("hi");
            var temp = data.response1.addr.split(", ");
            data.response1.country = temp[temp.length - 1];
        },
        function(data){
            
        },
        function(data){
            console.log("end");
            console.log(data);
            $res.write(JSON.stringify(data, undefined, 2));
            $res.end();
        }
    ]); 
}

module.exports = wp1;