import {caller, methodNumber, usrUnhandledMsg, usrForbidden, create} from "@zondax/fvm-as-sdk/assembly/wrappers";
import {NO_DATA_BLOCK_ID, ActorID, DAG_CBOR} from "@zondax/fvm-as-sdk/assembly/env";
import {State} from "./state";

export function invoke(_: u32): u32 {
  const methodNum = methodNumber()

  switch (u32(methodNum)) {
    case 1:
      constructor()
      break
    case 2:
      const msg = say_hello()
      const msgBuff = String.UTF8.encode(msg)
      const buff = Uint8Array.wrap(msgBuff)
      return create(DAG_CBOR, buff)
    default:
      usrUnhandledMsg()
  }

  return NO_DATA_BLOCK_ID
}

function constructor(): void {
  // This constant should be part of the SDK.
  const INIT_ACTOR_ADDR: ActorID = 1;

  if ( caller() != INIT_ACTOR_ADDR ) usrForbidden()

  const state = new State(0)
  state.save()

  return;
}

function say_hello(): string {
  const state = State.load();
  state.count += 1;
  state.save();

  const message = "Hello world " + state.count.toString()
  return message
}
