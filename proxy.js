var http = require('http'),
httpProxy = require('http-proxy');
process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

console.log('press enter to start server or provide parameters');
process.stdin.on('data', function (text) {
  console.log('received data:', util.inspect(text));
  if (text === '\n') {
    init({url:'/ng',port1:4200,port2:8013});
  }
  if (text === 'quit\n') {
    done();
  }
});

function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
  }

var proxy = httpProxy.createProxyServer({});

function init(parameters){
  try {
  	startServer(parameters);
  	console.log('Server started on http://localhost:9000/ng/index.html');
  }catch(err){
  	console.log(err);
  }
}



function startServer(parameters){
  var url = parameters.url;
  http.createServer(function (req, res) {
    if (req.url.indexOf(url) === 0){
      proxy.web(req, res, { target: 'http://127.0.0.1:'+parameters.port1 });
    }else{
      proxy.web(req, res, { target: 'http://127.0.0.1:'+parameters.port2 });
    }
    for (var key in req){
      // console.log(key);
    }
    // console.log(req.url,req.url.indexOf(url) === 0);
  }).listen(9000);
  proxy.on('error', function (err, req, res) {
    console.log(req.headers.host);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    var message = "";
    if (req.url.indexOf(url) === 0){
      message += "Inner url ("+url+")";
    } else {
      message += "Outer url";
    }
    res.end(message + ' is down?');
  });
}

//
// Create your proxy server and set the target in the options.
//
/*
httpProxy.createProxyServer({target:'http://localhost:9000'}).listen(8027); // See (†)
httpProxy.createProxyServer({target:'http://localhost:9000'}).listen(4200); // See (†)
*/

//
// Create your target server
//