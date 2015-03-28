function Api(apis, req_vars, res_type){
    this.apis = apis;
    this.req_vars = req_vars;
    this.res_type = res_type;
    
}
Api.prototype = {
    test: function(){
        console.log(this.apis);
        console.log(this.req_vars);
        console.log(this.res_type);
    },
    execute: function(){
        this.response = this.res_type;
        this._constructRequest();        
        this._constructResponse();

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
        var d, that = this;
        $.getJSON(this.request[0], function(data){
            d = data;
            console.log(d);
            for(var propertyName in that.res_type){
                that.response[propertyName] = that._byString(data, that.res_type.main);
            }
            console.log(that.response);
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
    }
}