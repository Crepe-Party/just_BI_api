DIR="$HOME/git/just_BI_api"

if [[ -d "$DIR" ]]; then
  echo "Update just_BI_api files in ${DIR}..."
  cd "$DIR"
  git pull
else
  # Take action if $DIR exists. #
  echo "Clone just_BI_api files in ${DIR}..."
  git clone https://github.com/Crepe-Party/just_BI_api
  cd "$DIR"
  rm -r test jest.config.js config.json.example README.md

  #COPY the config file on project
  cp ../config.json config.json
fi

npm i --prod