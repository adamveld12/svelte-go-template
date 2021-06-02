dev-server: clean .bin/webapp
	cd .bin && ./webapp

dev-client: client/node_modules
	cd ./client && npm run dev

build: clobber client/public/build .bin/webapp

clean:
	@rm -rf .bin/webapp .bin/client client/public/build

clobber: clean
	@rm -rf .bin ./client/node_modules ./client/public/build

.PHONY: build clean clobber dev-client dev-server

.bin:
	mkdir -p .bin

.bin/webapp: .bin
	@go build -v -o .bin/webapp .

.bin/client/public: .bin client/public/build
	mkdir -p .bin/client/public
	cp -R ./client/public/ .bin/client/

client/public/build: client/node_modules
	cd ./client && npm run build

client/node_modules:
	cd ./client && npm install
