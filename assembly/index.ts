// @filecoinfile
import {create} from "@zondax/fvm-as-sdk/assembly/wrappers";
import {DAG_CBOR} from "@zondax/fvm-as-sdk/assembly/env";
import {State} from "./state";

// @ts-ignore
@constructor
function init(paramsID:u32): void {
  // If we want to attach some storage to the instance,
  // a state needs to be saved at this step.
  // So we create a store, and call save method
  new State(0).save()
}

// @ts-ignore
@filecoinmethod
// User function. Smart-contract-related function.
function say_hello(paramsID:u32): u32 {
  // If we want to restore the storage related to this instance,
  // we should call static load function. It will return a preloaded
  // state
  const state = State.load();

  // Do some stuff with the state
  state.count += 1;

  // Save the state with updated values
  state.save();

  // Create a string with some value from state
  const message = "Hello world " + state.count.toString()

  // On AssemblyScript, UTF16 is used. As filecoin uses UTF8, some encoding is required
  // Now we can return whatever we want
  const msg = Uint8Array.wrap(String.UTF8.encode(message))

  return create(DAG_CBOR, msg)
}
