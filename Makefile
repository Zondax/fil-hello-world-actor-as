deps:
	yarn install
	cargo install wizer --all-features --force

build:
	yarn asbuild
	wizer build/release.wasm -f init -o build/release-final.wasm
	wizer build/debug.wasm -f init -o build/debug-final.wasm

.PHONY: deps build
