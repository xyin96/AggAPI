var req = require('request');

function Api(apis){
    return {
        apis: apis,
        test: function(){
            console.log(this.apis);
            console.log(this.req_vars);
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
                var req = this.request[j].url
                var constructHelper = "";
                for(var i = 0; i < this.req_vars.length; i ++){
                    req = req.replace(/\$\(\)/, this.req_vars[i])
                }
                console.log(req);
                this.request[j].url = req;

            }

        },
        _constructResponse: function(api_id){
            var d, that = this;
            console.log("Request: " + api_id);
            req.get(this.request[api_id].url, function(error, r, data){
                try{
                    data = JSON.parse(data);
                    for(var propertyName in schema = that.apis[api_id].res_type){
                        console.log(that.apis[api_id].res_type);
                        if(propertyName === "*"){
                            that.response = data;
                        } else {
                            console.log(data);
                            that.response[propertyName] = that._byString(data, schema[propertyName]);
                            console.log(that.response[propertyName]);
                        }
                    }
                    that._onComplete(that.response);
                    that._onComplete = function(){};
                } catch (err) {
                    if(api_id < that.apis.length - 1){
                        that._constructResponse(api_id + 1);
                    } else {
                        /* Stale return */
                        that._onComplete(that.response);
                        that._onComplete = function(){};
                    }
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