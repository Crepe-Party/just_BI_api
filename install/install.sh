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
require('http').createServer((req,res)=>{res.end('this is a placeholder server')}).listen(3000)
" > /home/admin/just_bi_api/server.js
#install nginx
apt install nginx -y
#config reverse proxy
echo "server {
    location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
    }
    listen 80 default_server;
}
" > /etc/nginx/sites-available/default

systemctl restart nginx

# auto restart node server (pm2)
npm install pm2@latest -g

pm2 start /home/admin/just_bi_api/server.js

username = $(whoami)
path_command=$(pm2 startup systemd | tail -n 1)
eval $(path_command)

pm2 save

systemctl start pm2-${username}

#https
apt install fail2ban