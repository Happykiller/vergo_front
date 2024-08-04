# Start the Docker containers in detached mode
start: 
	docker compose up -d

# Build and start the Docker containers in detached mode
startall: 
	docker compose up --build -d

# Stop the Docker container named 'vergo_front'
down:
	docker stop vergo_front

# Reset the Docker container by stopping and removing it
reset: down
	docker rm vergo_front

# Build the Docker image and save it as a tarball
tar: 
	docker build -t vergo_front -f Dockerfile .
	docker save vergo_front -o vergo_front.tar

# Install the Docker image by loading it from a tarball and running it
install:
	docker stop vergo_front
	docker rm vergo_front
	docker image rm vergo_front
	docker load -i vergo_front.tar
	docker compose -f docker-compose.prod.yml up -d

# Display help information about the available Makefile commands
help:
	@echo ""
	@echo "~~ vergo Front Makefile ~~"
	@echo ""
	@echo "\033[33m make start\033[39m    : Start the project"
	@echo "\033[33m make startall\033[39m : Build and start the project"
	@echo "\033[33m make down\033[39m     : Stop the project"
	@echo "\033[33m make reset\033[39m    : Reset containers, volumes, networks, and local data"
	@echo ""
