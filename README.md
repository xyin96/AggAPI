# AggApi (API Aggregate)
This project allows users to create a customizable API that chains different APIs together and returns the aggregated results in a single package.

# Features
AggAPI allows developers to create customizable API macros. Features include:

 * Chain Linking API calls: Automatically call several API's with one HTTP request
 * API Backup system: developers can designate backup apis, which will be called if higher priority API's fail
 * Response Schemas: using the API backup system, response schemas all developers to map response properties to values from the original response
 * Response Forwarding: responses from API calls can be forwarded to API's called afterward
 * Aggregated response: keep all the response information that you used along the entire process.

# USAGE
ApiSequence(apis, [param-schema]);
 * apis - Array of Api Objects. this denotes how the api calls are formed. $() denotes a variable, which will be filled in based on the parameter schema
 * params-schema - Array of param schemas. This is how params will be passed from api to api. To retrieve parameter from url $get(id), to retrieve parameter from previous api response, $(response["response" + api_id].{paramname})

ApiSequence.execute([params, callback])
 * params - parameters to be passed into the ApiSequence
 * callback - array of callback functions to be executed on completion of corresponding api

Api(patterns);
 * patterns - array of Objects with 2 fields:
   * url with $() denoting variable content (based on parameters or previous api calls)
   * response schema: map origin api response values into a new data structure that can be used in future calls

# Demo Usage:
This demo takes an ip address, converts it into lat/lng, reverse geocodes it for the country name, and gets the weather.

```
// full code for this demo can be found /core/tests/test.html
var $ip = new Api([
      {
        url: "http://www.telize.com/geoip/$()", 
        res_type: {lat:"latitude", lon:"longitude"}
      }
]);
var $reverseGeoCode = new Api([
    {
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=$(),$()&key=AIzaSyDmqbOvCO6seEzPfFoQi-xn3phiv8igk5M",
        res_type: {addr: "results[0].formatted_address"}
    }
])
var $weather = new Api([
    {
       url:"http://api.openweathermap.org/data/2.5/weather?q=$()",
       res_type: {temp:"main.temp", weather:"weather[0].description"}
    }, 
    {
        url:"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22$()%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
        res_type: {temp:"query.results.channel.item.condition.temp", weather:"query.results.channel.item.condition.text"}
    }
]);
var seq = [$ip, $reverseGeoCode, $weather];
var $as = new ApiSequence(seq, [["$get(0)"],["$(response.response0.lat)","$(response.response0.lon)"],["$(response.response1.country)"]]);

$as.execute(["46.19.37.108"], [
    null,
    function(data){
        console.log("hi");
        var temp = data.response1.addr.split(", ");
        data.response1.country = temp[temp.length - 1];
    },
    function(data){
        console.log("final");
        var newDoc = document.open("text","replace");
        newDoc = newDoc.write("<pre>" + JSON.stringify(data, undefined, 2) + "</pre>");
        newDoc.close();
    }
]);    

```
