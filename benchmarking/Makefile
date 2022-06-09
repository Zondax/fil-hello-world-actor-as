install:
	npm install -g assemblyscript

benchmark:
	mkdir temp
	# git clone & compile wasm & move to `temp`
	cargo r

build-rust:
	cd fil-hello-world-actor && cargo build 
	mv fil-hello-world-actor/target/debug/wbuild/fil_hello_world_actor/fil_hello_world_actor.compact.wasm ./rust-hello-world-actor.wasm

build-as-incremental:
	cd .. && asc assembly/index.ts --target release --runtime incremental --outFile benchmarking/as-incremental-tmp.wasm --use abort=
	wizer as-incremental-tmp.wasm -f init -o as-incremental-hello-world-actor.wasm
	rm as-incremental-tmp.wasm

build-as-minimal:
	cd .. && asc assembly/index.ts --target release --runtime minimal --outFile benchmarking/as-minimal-tmp.wasm --use abort=
	wizer as-minimal-tmp.wasm -f init -o as-minimal-hello-world-actor.wasm
	rm as-minimal-tmp.wasm

build-as-stub:
	cd .. && asc assembly/index.ts --target release --runtime stub --outFile benchmarking/as-stub-tmp.wasm --use abort=
	wizer as-stub-tmp.wasm -f init -o as-stub-hello-world-actor.wasm
	rm as-stub-tmp.wasm

build-as: build-as-incremental build-as-minimal build-as-stub

.PHONY: benchmark build-rust build-as build-as-incremental build-as-minimal build-as-stub