# hackpsu
This project allows users to create a customizable API that chains different APIs together and returns the result from a single API. By doing so, inputs from a user can generate outputs from another API that would normally not take those inputs. An example of this would be if a user wanted to check the weather using an IP address. With this user-created API, the IP address could be used to find the location of the IP address and determine the weather with a location input.

# USAGE
var $ip = new Api(["http://www.telize.com/geoip/$()"], [{lat:"latitude", lon:"longitude"}]);

var $a = new Api(["http://api.openweathermap.org/data/2.5/weather?lat=$()&lon=$()", 
                              "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"],
                             [{temp:"main.temp",weather:"weather[0].main"}, // return schema name:"location in original api response"
                              {"*":null}]);

var $as = new ApiSequence([$ip,$a], [["54.84.241.99"], ["$(response[0].lat)","$(response[0].lon)"]], function(data){
                console.log(data.response[1].weather);
            });
