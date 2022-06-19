install:
	npm install -g assemblyscript
	yarn --cwd ../ install
	cargo install wizer --all-features --force

benchmark:
	mkdir -p temp
	# git clone & compile wasm & move to `temp`
	make build-all
	cargo r

build-rust:
	cd fil-hello-world-actor && cargo build
	mv fil-hello-world-actor/target/debug/wbuild/fil_hello_world_actor/fil_hello_world_actor.compact.wasm ./temp/rust-hello-world-actor.wasm

build-as-incremental:
	cd .. && asc assembly/index.ts --target release --runtime incremental --outFile benchmarking/as-incremental-tmp.wasm --use abort= --transform  @zondax/fvm-as-bindgen
	wizer as-incremental-tmp.wasm -f init -o ./temp/as-incremental-hello-world-actor.wasm
	rm as-incremental-tmp.wasm

build-as-minimal:
	cd .. && asc assembly/index.ts --target release --runtime minimal --outFile benchmarking/as-minimal-tmp.wasm --use abort= --transform  @zondax/fvm-as-bindgen
	wizer as-minimal-tmp.wasm -f init -o ./temp/as-minimal-hello-world-actor.wasm
	rm as-minimal-tmp.wasm

build-as-stub:
	cd .. && asc assembly/index.ts --target release --runtime stub --outFile benchmarking/as-stub-tmp.wasm --use abort= --transform  @zondax/fvm-as-bindgen
	wizer as-stub-tmp.wasm -f init -o ./temp/as-stub-hello-world-actor.wasm
	rm as-stub-tmp.wasm

build-as: build-as-incremental build-as-minimal build-as-stub

install-llvm-ci:
	echo 'deb http://apt.llvm.org/focal/ llvm-toolchain-focal-13 main' | sudo tee /etc/apt/sources.list.d/llvm.list
	wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | sudo apt-key add -
	sudo apt-get update
	sudo apt-get install clang-13 llvm-13-dev lld-13 libclang-13-dev

install-tinygo:
	git clone https://github.com/ipfs-force-community/tinygo.git /tmp/tinygo
	cd /tmp/tinygo && \
	git checkout fvm && \
	git submodule update --init && \
	go install && \
	make wasi-libc

build-go:
	cd go-fvm-sdk/examples/hellocontract && \
	tinygo build -target wasi -no-debug -panic trap -scheduler none -o ../../../temp/go-hello-world-actor.wasm ./helloworld.go

build-all: build-rust build-go build-as

.PHONY: benchmark build-rust build-as build-as-incremental build-as-minimal build-as-stub install-tinygo build-all install-llvm-ci
