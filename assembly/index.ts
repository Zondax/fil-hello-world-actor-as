import {methodNumber, usrUnhandledMsg, create} from "@zondax/fvm-as-sdk/assembly/wrappers";
import {NO_DATA_BLOCK_ID, DAG_CBOR} from "@zondax/fvm-as-sdk/assembly/env";
import {isConstructorCaller} from "@zondax/fvm-as-sdk/assembly/helpers";
import {State} from "./state";

export function invoke(_: u32): u32 {
  const methodNum = methodNumber()

  switch (u32(methodNum)) {
    case 1:
      constructor()
      break
    case 2:
      const msg = say_hello()
      return create(DAG_CBOR, msg)
    default:
      usrUnhandledMsg()
  }

  return NO_DATA_BLOCK_ID
}

function constructor(): void {
  if( !isConstructorCaller() ) return;

  new State(0).save()

  return;
}

function say_hello(): Uint8Array {
  const state = State.load();
  state.count += 1;
  state.save();

  const message = "Hello world " + state.count.toString()
  const msgBuff = String.UTF8.encode(message)
  const buff = Uint8Array.wrap(msgBuff)

  return buff
}
