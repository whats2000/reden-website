echo "\"$(git rev-parse --short HEAD)\"" > assets/hash.json

nuxi cleanup && nuxi build

echo
echo "==========="
echo
echo Press Enter to deploy...
echo
echo "==========="

read

rsync -vac .output/ zly@dcdccssy.cn:/www/website/node/ || exit 1
ssh zly@dcdccssy.cn 'kill -9 $(lsof -t -i:3000); cd /www/website/node/ && screen -d -m bash -c "node server/index.mjs"' || exit 1
echo restarting nginx...
ssh zly@dcdccssy.cn sudo service nginx restart
#echo 1 | ssh zly@dcdccssy.cn '~/mt.py'

#nuxi generate && \
#rsync -va .output/public/ zly@dcdccssy.cn:/www/website/prod/
#curl -v --connect-to redenmc.com:80:dcdccssy.cn http://redenmc.com/
