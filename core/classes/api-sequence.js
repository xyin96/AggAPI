function ApiSequence(apis, vars){
    return {
        apis:apis,
        vars:vars,
        response:{},
        execute: function(params, callbacks, index){
            var that = this, callback = callbacks[index];
            if(index == undefined || index == null || index == NaN|| index < 0){
                index = 0;
            }
            console.log("index" + index);
            console.log("apilength" + this.apis.length);
            this._prepare(index, params);
            if(index < apis.length){
                this.apis[index].execute(function(data){
                    console.log("poop: " + index);
                    that.response["response" + index] = data;
                    if(callback){
                        callback(that.response);
                    }
                    console.log(JSON.stringify(that.response));
                    if(index + 1 < apis.length){
                        that.execute(params, callbacks, index + 1);
                    }
                });
            }
                
            
        },
        _prepare: function(api_index, params){
            var pApi = this.apis[api_index], var_schema = this.vars[api_index];
            pApi.req_vars = [];
            console.log(this.vars);
            for(var i = 0; i < var_schema.length; i ++){
                if(uri = var_schema[i].match(/\$\((.*)\)/)){
                    var_schema[i] = this._byString(this, var_schema[i].replace(/\$\((.*)\)/,"$1").trim(" ")); 
                    console.log(var_schema[i]);
                } else if (uri = var_schema[i].match(/\$get\((.*)\)/)){
                    var_schema[i] = params[parseInt(var_schema[i].replace(/\$get\((.*)\)/, "$1"))];
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
