function ApiSequence(apis, vars, oncomplete){
    return {
        apis:apis,
        vars:vars,
        response:{},
        index:0,
        _onComplete:oncomplete,
        execute: function(params){
            console.log(this.response);
            var that = this;
            if(this.index < this.apis.length){
                this._prepare(this.index, params);
                this.apis[this.index].execute(function(data){
                    console.log("poop: " + data);
                    that.response["response" + that.index] = data;
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
        _prepare: function(api_index, params){
            var pApi = this.apis[api_index], var_schema = this.vars[api_index];
            pApi.req_vars = [];
            console.log(this.vars);
            console.log(api_index);
            for(var i = 0; i < var_schema.length; i ++){
                if(uri = var_schema[i].match(/\$\((.*)\)/)){
                    console.log("matched");
                    console.log(var_schema[i].replace(/\$\((.*)\)/,"$1"));
                    var_schema[i] = this._byString(this, var_schema[i].replace(/\$\((.*)\)/,"$1").trim(" ")); 
                    console.log(this.response.response0.lon);
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

module.exports = ApiSequence;