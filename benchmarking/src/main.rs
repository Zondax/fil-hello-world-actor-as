use fvm_integration_tests::tester::{Account, Tester};
use fvm_shared::message::Message;
use fvm_shared::state::StateTreeVersion;
use fvm_shared::version::NetworkVersion;
use fvm::executor::{ApplyKind, Executor};
use fvm_ipld_blockstore::MemoryBlockstore;
use fvm_ipld_blockstore::Blockstore;
use fvm_ipld_encoding::tuple::*;
use fvm_shared::address::Address;
use fvm_shared::bigint::BigInt;
use std::env;

const RUST_WASM_COMPILED_PATH: &str =
    "./rust-hello-world-actor.wasm";

/// The state object.
#[derive(Serialize_tuple, Deserialize_tuple, Clone, Debug, Default)]
pub struct State {
    pub count: u64,
}

fn main() {
    println!("Running benchmark");

    let mut tester = Tester::new(
        NetworkVersion::V16,
        StateTreeVersion::V4,
        MemoryBlockstore::default(),
    )
    .unwrap();

    let sender: [Account; 1] = tester.create_accounts().unwrap();

    let wasm_path = env::current_dir()
    .unwrap()
    .join(RUST_WASM_COMPILED_PATH)
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

    // Instantiate machine
    tester.instantiate_machine().unwrap();

    println!("Calling `say_hello`");
    let message = Message {
        from: sender[0].1,
        to: actor_address,
        gas_limit: 1000000000,
        method_num: 2,
        ..Message::default()
    };

    let res = tester
    .executor
    .unwrap()
    .execute_message(message, ApplyKind::Explicit, 100)
    .unwrap();

    dbg!(&res);
}
