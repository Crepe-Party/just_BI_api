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
    listen              443 ssl;

    ssl_certificate     /home/admin/.ssl/37637387_justbiapi.diduno.education.cert;
    ssl_certificate_key /home/admin/.ssl/37637387_justbiapi.diduno.education.key;

    location / {
        proxy_pass http://localhost:3000;
    }
}" > /etc/nginx/sites-available/default

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