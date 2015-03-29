var req = require('request');

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
            this.response = {};
            this._constructRequest();        
            this._constructResponse(0);
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
        _constructResponse: function(api_id){
            var d, that = this;
            console.log(api_id);
            req({url: this.request[api_id], json:true}, function(error, response, data){
                console.log("Inside request: " + api_id);
                if(response.statusCode != 200 && api_id < that.apis.length - 1){
                    console.log("it happened");
                    that._constructResponse(api_id + 1);
                } else {
                    for(var propertyName in schema = that.res_type[api_id]){
                        if(propertyName === "*"){
                            that.response = data;
                        } else {
                            console.log(propertyName.type);
                            that.response[propertyName] = that._byString(data, schema[propertyName]);
                        }
                    }
                    that._onComplete(that.response);
                }
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

module.exports = Api;