export NODE_ENV=productionœ
nuxi generate
rsync -va .output/public/ zly@cagayake.top:/www/website/prod/
ssh zly@cagayake.top '~/main.py'
