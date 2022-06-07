deps:
	yarn install
	cargo install wizer --all-features

build:
	yarn asbuild
	wizer build/release.wasm -f init -o release-final.wasm
	wizer build/debug.wasm -f init -o debug-final.wasm

.PHONY: deps build