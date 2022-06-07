import {caller, methodNumber, usrUnhandledMsg, usrForbidden} from "@zondax/fvm-as-sdk/assembly/wrappers";
import {NO_DATA_BLOCK_ID, ActorID} from "@zondax/fvm-as-sdk/assembly/env";
import {State} from "./state";

export function invoke(_: u32): u32 {
  const methodNum = methodNumber()

  switch (u32(methodNum)) {
    case 1:
      constructor()
      break
    case 2:
      say_hello()
      break
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

// Not working
function say_hello(): void {
  //const state = State.load();
  /*state.count += 1;
  state.save();

  const ret = new Uint8Array(2); // "A"
  ret[0] = 97;
  ret[1] = 65;

  return ret;*/
}
