echo "\"$(git rev-parse --short HEAD)\"" > assets/hash.json

nuxi build && \
rsync -va .output/ zly@dcdccssy.cn:/www/website/node/

ssh zly@dcdccssy.cn 'kill -9 $(lsof -t -i:3000); cd /www/website/node/ && screen -d -m bash -c "node server/index.mjs"'
echo 1 | ssh zly@dcdccssy.cn '~/mt.py'

#nuxi generate && \
#rsync -va .output/public/ zly@dcdccssy.cn:/www/website/prod/
