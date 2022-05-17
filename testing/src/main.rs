use fvm_integration_tests::tester::{Account, Tester};
use fvm_shared::state::StateTreeVersion;
use fvm_shared::version::NetworkVersion;
use fvm_ipld_blockstore::MemoryBlockstore;
use fvm_ipld_encoding::tuple::*;
use fvm_shared::address::Address;
use fvm_shared::bigint::BigInt;
use wabt::wat2wasm;
use std::fs::File;
use std::io::prelude::*;
use std::env;

const WASM_COMPILED_PATH: &str =
    "../build/release.wasm";

const WAT: &str = r#"
(module
    (type $i32_=>_i32 (func (param i32) (result i32)))
    (type $none_=>_none (func))
    (memory $0 1)
    (export "invoke" (func $assembly/index/invoke))
    (export "constructor" (func $assembly/index/constructor))
    (export "memory" (memory $0))
    (func $assembly/index/invoke (param $0 i32) (result i32)
     i32.const 0
    )
    (func $assembly/index/constructor
     nop
    )
   ) 
"#;

/// The state object.
#[derive(Serialize_tuple, Deserialize_tuple, Clone, Debug, Default)]
pub struct State {
    pub count: u64,
}

fn main() {
    println!("Testing Hello World contract in assembly script");

    let mut tester = Tester::new(
        NetworkVersion::V15,
        StateTreeVersion::V4,
        //MemoryBlockstore::default(),
    )
    .unwrap();

    let sender: [Account; 1] = tester.create_accounts().unwrap();

    let wasm_path = env::current_dir()
    .unwrap()
    .join(WASM_COMPILED_PATH)
    .canonicalize()
    .unwrap();
    let wasm_bin = std::fs::read(wasm_path).expect("Unable to read file");

    //let wasm_bin = wat2wasm(WAT).unwrap();

    let mut file = File::create("foo.wasm").unwrap();
    file.write_all(&wasm_bin).unwrap();

    let actor_state = State::default();
    let state_cid = tester.set_state(&actor_state).unwrap();

    // Set actor
    let actor_address = Address::new_id(10000);


    tester
        .set_actor_from_bin(&wasm_bin, state_cid, actor_address, BigInt::default())
        .unwrap();
    
    // Instantiate machine
    tester.instantiate_machine().unwrap();
}
