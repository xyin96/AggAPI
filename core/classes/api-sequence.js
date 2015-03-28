function ApiSequence(apis, vars, oncomplete){
    this.apis = apis;
    this.vars = vars;
    this.response = [];
    this.index = 0;
    this._onComplete = oncomplete;
    return this;
}
ApiSequence.prototype = {
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