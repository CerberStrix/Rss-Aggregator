lint:
	npx eslint .

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack
	
test:
	NODE_OPTIONS=--experimental-vm-modules npx jest

test-coverage:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

.PHONY: test