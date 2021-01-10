# https://www.tecmint.com/nginx-as-reverse-proxy-for-nodejs-app/
# to launch in sudo
apt update
apt install curl -y

# install node
curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt install -y nodejs
# node server directory
mkdir /usr/share/just_bi_api
