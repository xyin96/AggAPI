# AggApi (API Aggregate)
This project allows users to create a customizable API that chains different APIs together and returns the aggregated results in a single package.

# USAGE
ApiSequence(apis, [params, callback]);
 * apis - Array of Api Objects. this denotes how the api calls are formed. $() denotes a variable, which will be filled in based on the parameter schema
 * params - Array of param schemas. to retrieve parameter from url $get(id), to retrieve parameter from previous api response, $(response[api_index].param 
 * callback - function to call on sequence complete

Api(patterns, responseSchema);
 * patterns - array of urls with $() denoting variable content (based on parameters or previous api calls)
 * responseSchema - array of objects mapping desired response values to their location in the original json response.

# Demo Usage:
This demo takes an ip address, and runs through two apis to get the local weather ofat the location of the computer with that IP.

```
var $ip = new Api(["http://www.telize.com/geoip/$()"], [{lat:"latitude", lon:"longitude"}]);
var $a = new Api(["http://api.openweathermap.org/data/2.5/weather?lat=$()&lon=$()", 
                              "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"],
                             [{temp:"main.temp",weather:"weather[0].main"}, // return schema name:"location in original api response"
                              {"*":null}]);

var $as = new ApiSequence([$ip,$a], [["54.84.241.99"], ["$(response[0].lat)","$(response[0].lon)"]], function(data){
                console.log(data.response[1].weather);
            });
```
