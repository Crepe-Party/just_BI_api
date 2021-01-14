DIR="$HOME/just_BI_api"

if [ ! -d "$DIR" ]; then
  echo "Clone just_BI_api files in ${DIR}..."
  git clone https://github.com/Crepe-Party/just_BI_api
fi

cd "$DIR"
git stash
git pull
cp ../config.json config.json
npm i --prod
rm -r test jest.config.js config.json.example README.md

if [ ! -d "$DIR" ]; then
  pm2 start server.js
else
  pm2 restart server.js
fi