!#/bin/bash

echo 'This might take a minute or two...'

# Add ~/local/bin to the PATH
echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.profile

# Install node.js to ~/local - this saves having to sudo to use npm
. ~/.profile
mkdir ~/local
mkdir node-latest-install
cd node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
./configure --prefix=~/local
make install
cd ..
rm -rf node-latest-install

# Install npm
curl http://npmjs.org/install.sh | sh

# Install Socket.IO
npm install socket.io@0.6.1
