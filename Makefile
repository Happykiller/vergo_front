start: 
	docker compose up -d

startall: 
	docker compose up --build -d

down:
	docker stop vergo_front

reset: down
	docker rm vergo_front

tar: 
	docker build -t vergo_front -f Dockerfile .
	docker save vergo_front -o vergo_front.tar

install:
	docker stop vergo_front
	docker rm vergo_front
	docker image rm vergo_front
	docker load -i vergo_front.tar
	docker run -d --restart=always -p 8086:80 --name vergo_front vergo_front

help:
	@echo ""
	@echo "~~ vergo Front Makefile ~~"
	@echo ""
	@echo "\033[33m make start\033[39m    : Démarre le projet"
	@echo "\033[33m make startall\033[39m : Build et démarre le projet"
	@echo "\033[33m make down\033[39m     : Stop le projet"
	@echo "\033[33m make reset\033[39m    : Reset les containers, les volumes, les networks et les données local"
	@echo ""