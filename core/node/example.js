var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log(req.headers);
    console.log(require('url').parse(req.url));
    
    var req = http.get("http://xiaofish.me/", function (r) {
        r.on('data', function(chunk){
            res.write(chunk);
        });
        r.on('end', function(){
            res.end('END');
        });
    });


}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');