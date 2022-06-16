// @filecoinfile
import {create} from "@zondax/fvm-as-sdk/assembly/wrappers";
import {DAG_CBOR} from "@zondax/fvm-as-sdk/assembly/env";
import {State} from "./state";

// Function executed on create actor
function init(): void {
  // If we want to attach some storage to the instance,
  // a state needs to be saved at this step.
  // So we create a store, and call save method
  new State(0).save()
}

function mappingMethods(methodNum:u32):i32{
  switch (methodNum){
    case 2:
      // Execute whatever the smart contract wants.
      const msg = say_hello()

      // If we want to return something as execution result,
      // we need to create a block with those values, and return
      // the output of that function
      return create(DAG_CBOR, msg)
    default:
      return -1
  }
}

// User function. Smart-contract-related function.
function say_hello(): Uint8Array {
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
  const msgBuff = String.UTF8.encode(message)
  const buff = Uint8Array.wrap(msgBuff)

  // Now re can return whatever we want
  return buff
}
