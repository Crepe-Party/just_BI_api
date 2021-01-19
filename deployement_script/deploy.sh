BASEDIR="$HOME"
DIR="$BASEDIR/just_BI_api"

if [ ! -d "$DIR" ]; then
  cd "$BASEDIR"
  echo "Clone just_BI_api files in ${DIR}..."
  git clone https://github.com/Crepe-Party/just_BI_api
fi

cd "$DIR"
git stash
git pull
npm i --prod
rm -r deployement_script install test config.json.example jest.config.js README.md

if [ ! -d "$DIR" ]; then
  pm2 start server.js
else
  pm2 restart server.js
fi