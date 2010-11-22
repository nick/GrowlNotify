// Change this to the path of your source files
var srcDir = "/Users/nick/Projects/sencha/Mobile/src/platform/src";
var playSounds = true;
var port = 3001; // Socket.IO listener port

// Shouldn't need to change anything below here...

var io = require('socket.io'),
  http = require('http'), 
  exec = require('child_process').exec,
   sys = require('sys'),
    fs = require('fs');

var server = http.createServer(function(req, res){
    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.writeBody('<h1>Growl Notifier running</h1>');
    res.finish();
});

server.listen(port);
var socket = io.listen(server);

socket.on('connection', function(client){
  client.on('message', function(msg){ 
      var running = msg.match(/RUNNING/),
          errors = msg.match(/ERRORS: ([0-9]+)/);
      if(running) {
          if(playSounds) exec('afplay run.mp3');
      } else if(errors) {
          if(errors[1] != "0") { 
              if(playSounds) exec('afplay fail.mp3');
              var msg = errors[1] + ' failures';
                  img = "fail.png";
          } else {
              var msg = "All tests pass";
                  img = "pass.png";
          }
          exec('growlnotify -n SenchaTest --image=' + img + ' -m "' + msg + '" Sencha Autotest');
      }
  })
});

child = exec('find ' + srcDir + ' | grep \.js', 
    function (err, stdout, stderr) {
        if(err || stderr) { sys.puts(err || stderr); process.exit(); }
        var files = stdout.split("\n");
        for(var i=0; i< files.length; i++) {
            (function(path) {                    
                fs.watchFile(path, {persistent: true, interval: 200}, function (curr, prev) {
                    if(String(curr.mtime) != String(prev.mtime)) {
                        sys.puts("Detected change on " + path + " - updating client");
                        socket.broadcast("Updated: " + path);            
                    }
                });
            })(files[i]);
        }            
    }
);
