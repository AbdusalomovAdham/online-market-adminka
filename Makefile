deploy:
	npm run build
	scp -r dist root@10.0.81.3:/var/www/dm/dashboard
