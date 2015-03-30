# AggApi (API Aggregate)
This project allows users to create a customizable API that chains different APIs together and returns the aggregated results in a single package.

# Features
AggAPI allows developers to create customizable API macros. Features include:

 * Chain Linking API calls: Automatically call several API's with one HTTP request
 * API Backup system: developers can designate backup apis, which will be called if higher priority API's fail
 * Response Schemas: using the API backup system, response schemas all developers to map response properties to response values in the original response
 * Response Forwarding: responses from API calls can be forwarded to API's called afterward
 * Aggregated response: keep all the response information that you used along the entire process.

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
            var $reverseGeoCode = new Api(["https://maps.googleapis.com/maps/api/geocode/json?latlng=$(),$()&key=AIzaSyDmqbOvCO6seEzPfFoQi-xn3phiv8igk5M"], [{addr: "results[0].formatted_address"}])
            var $weather = new Api(["http://api.openweathermap.org/data/2.5/weather?q=$()", 
                              "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22$()%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"],
                             [{temp:"main.temp",weather:"weather[0].description"}, // return schema name:"location in original api response"
                              {temp:"query.results.channel.condition.temp", weather:"query.results.channel.condition.text"}]);
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
                    $("body").html(data.response2.weather);
                }
            ]);    

```
