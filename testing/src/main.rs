use fvm_integration_tests::tester::{Account, Tester};
use fvm_shared::message::Message;
use fvm_shared::state::StateTreeVersion;
use fvm_shared::version::NetworkVersion;
use fvm::executor::{ApplyKind, Executor};
//use fvm_ipld_blockstore::MemoryBlockstore;
use fvm_ipld_blockstore::Blockstore;
use fvm_ipld_encoding::tuple::*;
use fvm_shared::address::Address;
use fvm_shared::bigint::BigInt;
use wabt::wat2wasm;
use std::fs::File;
use std::io::prelude::*;
use std::env;
use std::str::FromStr;

const WASM_COMPILED_PATH: &str =
    "../build/release.wasm";

/*const WASM_COMPILED_PATH: &str =
    "../fil_hello_world_actor.compact.wasm";*/


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

    dbg!(sender[0].1.to_string());

    let wasm_path = env::current_dir()
    .unwrap()
    .join(WASM_COMPILED_PATH)
    .canonicalize()
    .unwrap();
    let wasm_bin = std::fs::read(wasm_path).expect("Unable to read file");

    /*let wasm_bin = wat2wasm(WAT).unwrap();

    let mut file = File::create("foo.wasm").unwrap();
    file.write_all(&wasm_bin).unwrap();*/

    let actor_state = State { count: 0 };
    let state_cid = tester.set_state(&actor_state).unwrap();

    // Set actor
    let actor_address = Address::new_id(10000);

    tester
        .set_actor_from_bin(&wasm_bin, state_cid, actor_address, BigInt::default())
        .unwrap();
    
    // Instantiate machine
    tester.instantiate_machine().unwrap();

    dbg!(&tester.code_cids);
    dbg!(&tester.builtin_actors);
    dbg!(&tester.accounts_code_cid);

    let actor_state = tester.state_tree.get_actor(&actor_address).unwrap().unwrap();
    dbg!(&actor_state.state.to_string());

    let state = tester.blockstore().clone().get(&actor_state.state).unwrap();
    
    dbg!(state);

    println!("Calling create actor");
    let message = Message {
        from: sender[0].1,
        to: Address::from_str("t01").unwrap(),
        gas_limit: 1000000000,
        method_num: 2,
        ..Message::default()
    };

    let mut res = tester
    .executor
    .unwrap()
    .execute_message(message, ApplyKind::Explicit, 100)
    .unwrap();

    dbg!(&res);

    assert_eq!(res.msg_receipt.exit_code.value(), 0);

    /*println!("Calling `say_hello()`. This should update state.");
    let message = Message {
        from: sender[0].1,
        to: actor_address,
        gas_limit: 1000000000,
        method_num: 2,
        ..Message::default()
    };

    res = tester
    .executor
    .unwrap()
    .execute_message(message, ApplyKind::Explicit, 100)
    .unwrap();

    dbg!(&res);

    assert_eq!(res.msg_receipt.exit_code.value(), 0);

    let actor_state_bis = tester.state_tree.get_actor(&actor_address).unwrap().unwrap();
    dbg!(&actor_state_bis.state.to_string());

    let state_bis = tester.state_tree.store().get(&actor_state_bis.state).unwrap();
    dbg!(&state_bis);*/
}
