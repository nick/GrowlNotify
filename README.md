Sencha Test Suite Growl Notifier
================================

This script will notify SpecRunner.html to re-run the test suite if it detects any source code changes. 

## Requirements

- Node v0.2.4
- Socket.IO
- Growl
- growlnotifier
- afplay (for playing sounds)

## Installation

Install [growl and growlnotify](http://growl.info) - growlnotify is in the 'Extras' folder of the Growl dmg.

Run the following commands. Please note this installs node into $HOME/local - if you already have node installed please see install.sh for manual installation

    git clone git@github.com:nick/GrowlNotify.git
    cd GrowlNotify
    ./install.sh

Edit the 'srcDir' variable at the top of autotest.js

Paste the following code before the `</head>` tag in ScriptRunner.html

    <!-- Growl notifier. Served from a CDN to minimise hassle -->
    <script src="http://cdn.socket.io/stable/socket.io.js"></script>         
    <script type="text/javascript">
        if(window.io) {
            var socket = new io.Socket('localhost', {port: 3001});
            var socketReconnect;

            socket.on('connect', function(){ 
                console.log('Socket.IO Connected OK');
                if(socketReconnect) {
                    window.location.reload(); // Re-run the tests if we have to re-connect
                } else {
                    socket.send("RUNNING"); // Sending the 'Running Tests' command                        
                }
            }) ;
            socket.on('message', function(msg){
                var shouldReload = msg.match(/updated/i);
                if(shouldReload) { // There's been a change in the source
                    window.location.reload();
                }
            }) 
            socket.on('disconnect', function() { 
                console.log('Socket.IO Disconnected')
                // Try to reconnect every 5 seconds to the backend
                socketReconnect = setInterval(function() {
                    console.log('Attempting Socket.IO reconnect');
                    socket.connect();
                }, 5000)
            });
            socket.connect();
            
            SenchaReporter.prototype._renderResults = SenchaReporter.prototype.renderResults;
            SenchaReporter.prototype.renderResults = function(runner) {
                this._renderResults(runner);
                var fails = jasmine.getEnv().currentRunner().results().failedCount;
                if(socket) socket.send("ERRORS: " + fails)
            }
        } else {
            console.log("The Socket.IO script was not loaded")
        }
    </script>
    <!-- End of Growl notifier -->
 
## How to use

    ./autotest.sh
