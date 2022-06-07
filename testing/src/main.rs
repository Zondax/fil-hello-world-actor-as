use fvm_integration_tests::tester::{Account, Tester};
use fvm_shared::message::Message;
use fvm_shared::state::StateTreeVersion;
use fvm_shared::version::NetworkVersion;
use fvm::executor::{ApplyKind, Executor};
use fvm_ipld_blockstore::MemoryBlockstore;
use fvm::{init_actor};
use fvm_ipld_blockstore::Blockstore;
use fvm_ipld_encoding::tuple::*;
use fvm_ipld_encoding::RawBytes;
use fvm_shared::address::Address;
use fvm_shared::bigint::BigInt;
use std::env;

const WASM_COMPILED_PATH: &str =
    "../release-final.wasm";

/// The state object.
#[derive(Serialize_tuple, Deserialize_tuple, Clone, Debug, Default)]
pub struct State {
    pub count: u64,
}

fn main() {
    println!("Testing Hello World contract in assembly script");

    let mut tester = Tester::new(
        NetworkVersion::V16,
        StateTreeVersion::V4,
        MemoryBlockstore::default(),
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

    let actor_state = State { count: 0 };
    let state_cid = tester.set_state(&actor_state).unwrap();

    // Set actor
    let actor_address = Address::new_id(10000);

    tester
        .set_actor_from_bin(&wasm_bin, state_cid, actor_address, BigInt::default())
        .unwrap();

    let actor = tester.state_tree.as_ref().unwrap().get_actor(&actor_address).unwrap().unwrap();
    dbg!(&actor.state.to_string());
    /*let state = tester.blockstore().clone().get(&actor_state.state).unwrap();
    dbg!(state);*/

    // Instantiate machine
    tester.instantiate_machine().unwrap();

    /*let params = fil_actor_init::ExecParams {
        code_cid: actor.code,
        constructor_params: RawBytes::new(vec![])
    };

    dbg!(hex::encode(&*RawBytes::serialize(params).unwrap()));*/

    println!("Calling construct");
    let message = Message {
        from: sender[0].1,
        to: init_actor::INIT_ACTOR_ADDR,
        gas_limit: 1000000000,
        method_num: 2,
        params: RawBytes::new(hex::decode("82d82a5827000155a0e4022002646fb340f5c4ef9e5846a589a04bef4e1abfb79601a7074352f3ba3bae22ed40").unwrap()),
        // 82d82a5827000155a0e40220d06c3cd58386c52ad72b4d154e8c82b7c77580a0817d64099a1c44ca58b363aa40
        //params: RawBytes::new(hex::decode("82d82a5827000155a0e40220d06c3cd58386c52ad72b4d154e8c82b7c77580a0817d64099a1c44ca58b363aa40").unwrap()),
        ..Message::default()
    };


    let res = tester
    .executor
    .unwrap()
    .execute_message(message, ApplyKind::Explicit, 100)
    .unwrap();

    dbg!(&res);

    assert_eq!(res.msg_receipt.exit_code.value(), 0);

    /*let actor_state_bis = tester.state_tree.get_actor(&actor_address).unwrap().unwrap();
    dbg!(&actor_state_bis.state.to_string());

    let state_bis = tester.state_tree.store().get(&actor_state_bis.state).unwrap();
    dbg!(&state_bis);*/
}
