# https://www.tecmint.com/nginx-as-reverse-proxy-for-nodejs-app/
# to launch in sudo

#args
while getopts u:a:f: flag
do
    case "${flag}" in
        i) passed_ip=${OPTARG};;
    esac
done
# doesn't work
# if [![-z ${passed_ip+x}]]
# then 
#     echo 'missing -i parameter'
#     exit 1
# fi

# install node
apt update
apt install curl -y
curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt install -y nodejs
# node server directory
mkdir /usr/share/just_bi_api
#placeholder script
echo "
require('http').createServer((req,res)=>{res.end('this is a placeholder server')}).listen(8080)
" > /usr/share/just_bi_api/main.js
#install nginx
apt install nginx -y
#config reverse proxy
echo "server{
    listen 80;
    server_name biapi.proxy;
    location / {
        proxy_set_header   X-Forwarded-For \$remote_addr;
        proxy_set_header   Host \$http_host;
        proxy_pass         http://${ip}:8080;
    }
}" > /etc/nginx/conf.d/biapi.conf

systemctl restart nginx

