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
use fvm::executor::ApplyRet;
use std::fs;

#[macro_use] extern crate prettytable;
use prettytable::Table;

const RUST_WASM_COMPILED_PATH: &str =
    "./rust-hello-world-actor.wasm";

const AS_INCREMENTAL_WASM_COMPILED_PATH: &str =
    "./as-incremental-hello-world-actor.wasm";

const AS_MINIMAL_WASM_COMPILED_PATH: &str =
    "./as-minimal-hello-world-actor.wasm";

const AS_STUB_WASM_COMPILED_PATH: &str =
    "./as-stub-hello-world-actor.wasm";


/// The state object.
#[derive(Serialize_tuple, Deserialize_tuple, Clone, Debug, Default)]
pub struct State {
    pub count: u64,
}

fn run_fvm(path: &str) -> ApplyRet {
    let mut tester = Tester::new(
        NetworkVersion::V16,
        StateTreeVersion::V4,
        MemoryBlockstore::default(),
    )
    .unwrap();

    let sender: [Account; 1] = tester.create_accounts().unwrap();

    let wasm_path = env::current_dir()
    .unwrap()
    .join(path)
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

    return res
}

fn main() {
    println!("Running benchmark");


    let res_rust = run_fvm(RUST_WASM_COMPILED_PATH);
    let rust_size = fs::metadata(RUST_WASM_COMPILED_PATH).unwrap();


    let res_as_incremental = run_fvm(AS_INCREMENTAL_WASM_COMPILED_PATH);
    let as_incremental_size = fs::metadata(AS_INCREMENTAL_WASM_COMPILED_PATH).unwrap();


    let res_as_minimal = run_fvm(AS_MINIMAL_WASM_COMPILED_PATH);
    let as_minimal_size = fs::metadata(AS_MINIMAL_WASM_COMPILED_PATH).unwrap();


    let res_as_stub = run_fvm(AS_STUB_WASM_COMPILED_PATH);
    let as_stub_size = fs::metadata(AS_STUB_WASM_COMPILED_PATH).unwrap();

    let mut table = Table::new();
    table.add_row(row!["ACTOR FILE", "GAS USED (say_hello())", "FILE SIZE"]);
    table.add_row(row!["Rust actor", res_rust.msg_receipt.gas_used, rust_size.len()]);
    table.add_row(row!["Assemblyscript (incremental)", res_as_incremental.msg_receipt.gas_used, as_incremental_size.len()]);
    table.add_row(row!["Assemblyscript (minimal)", res_as_minimal.msg_receipt.gas_used, as_minimal_size.len()]);
    table.add_row(row!["Assemblyscript (stub)", res_as_stub.msg_receipt.gas_used, as_stub_size.len()]);

    table.printstd();
}
