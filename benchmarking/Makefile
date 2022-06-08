
benchmark:
	mkdir temp
	# git clone & compile wasm & move to `temp`
	cargo r

build-rust:
	cd fil-hello-world-actor && cargo build 
	mv fil-hello-world-actor/target/debug/wbuild/fil_hello_world_actor/fil_hello_world_actor.compact.wasm ./rust-hello-world-actor.wasm

.PHONY: benchmark build-rust