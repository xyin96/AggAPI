function Api(apis, res_type){
    this.apis = apis;
    this.res_type = res_type;
    this.req_vars = [];
    return this;
}
Api.prototype = {
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
        $.getJSON(this.request[api_id], function(data){
            
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