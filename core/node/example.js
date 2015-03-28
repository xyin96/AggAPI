var http = require('http');
var req = require("request"); 

http.createServer(function (req, res) {
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log(req.headers);
    console.log(require('url').parse(req.url));
    
    var $ip = Api(["http://www.telize.com/geoip/$()"], [{lat:"latitude", lon:"longitude"}]);
    var $a = Api(["http://api.openweathermap.org/data/2.5/weather?lat=$()&lon=$()", 
                      "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"],
                     [{temp:"main.temp",weather:"weather[0].main"}, // return schema name:"location in original api response"
                      {"*":null}]);
    $a.test();
    var seq = [$ip, $a];
    var $as = ApiSequence(seq, [["54.84.241.99"], ["$(response[0].lat)","$(response[0].lon)"]], function(data){
        console.log(data.response[1].weather);
    });
    $as.execute(); 


}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

function Api(apis, res_type){
    return {
        apis: apis,
        res_type: res_type,
        test: function(){
            console.log(this.apis);
            console.log(this.req_vars);
            console.log(this.res_type);
        },
        execute: function(onComplete){
            this._onComplete = onComplete;
            this.response = this.res_type;
            this._constructRequest();        
            this._constructResponse();
        },
        _prepare: function(req_vars){
            this.req_vars = req_vars;
        },
        _constructRequest: function(){
            this.request = this.apis;
            for(var j = 0; j < this.request.length; j++){
                var req = this.request[j]
                var constructHelper = "";
                for(var i = 0; i < this.req_vars.length; i ++){
                    req = req.replace(/\$\(\)/, this.req_vars[i])
                }
                this.request[j] = req;

            }

        },
        _constructResponse: function(){
            var d, that = this, api_id = 0;
            
            req({url: this.request[api_id], json:true}, function(error, response, data){
                for(var propertyName in schema = that.res_type[api_id]){
                    if(propertyName === "*"){
                        that.response = data;
                    } else {
                        that.response[propertyName] = that._byString(data, schema[propertyName]);
                    }
                }
                that._onComplete(that.response);
            });
        },
        _byString: function(o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, '');           // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                    o = o[k];
                } else {
                    return;
                }
            }
            return o;
        },
        _onComplete: function(/* data */){}
    }
}
function ApiSequence(apis, vars, oncomplete){
    return {
        apis:apis,
        vars:vars,
        response:[],
        index:0,
        _onComplete:oncomplete,
        execute: function(){
            var that = this;
            if(this.index < this.apis.length){
                this._prepare(this.index);
                this.apis[this.index].execute(function(data){
                    that.response.push(data);
                    that._next();
                });
            } else {
                this._onComplete(this);
            }

        },
        _next: function(){
            this.index++;
            this.execute();
        },
        _prepare: function(api_index){
            var pApi = this.apis[api_index], var_schema = this.vars[api_index];
            pApi.req_vars = [];
            console.log(this.vars);
            console.log(api_index);
            for(var i = 0; i < var_schema.length; i ++){
                if(uri = var_schema[i].match(/\$\((.*)\)/)){
                    var_schema[i] = this._byString(this, var_schema[i].replace(/\$\((.*)\)/,"$1")); 
                }
                pApi.req_vars.push(var_schema[i]);
            }
        },
        _byString: function(o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, '');           // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                    o = o[k];
                } else {
                    return;
                }
            }
            return o;
        }
    }
}
