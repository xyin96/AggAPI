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
        this.constructRequest();
        $.getJSON(this.apis[0], function(data){
            var items = [];
            console.log(data);
            $.each( data, function( key, val ) {
                items.push( "<li id='" + key + "'>" + val + "</li>" );
            });

            $( "<ul/>", {
                "class": "my-new-list",
                html: items.join( "" )
            }).appendTo( "body" );
        });
    },
    constructRequest: function(){
        this.request = this.apis;
        for(var j = 0; j < request.length; j++){
            console.log(this);
            for(var i = 0; i < req_vars.length; i ++){
                that.replace("{{}}", this.req_vars[index]);
            }
        }
        
    }
}