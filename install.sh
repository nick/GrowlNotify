!#/bin/bash

echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
. ~/.bashrc
mkdir ~/local
mkdir node-latest-install
cd node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
./configure --prefix=~/local
make install
cd ..
rm -rf node-latest-install
curl http://npmjs.org/install.sh | sh

npm install socket.io@0.6.1
