import {caller, methodNumber} from "fvm-as-sdk/assembly";
import {usrForbidden, usrUnhandledMsg} from "fvm-as-sdk/assembly";
import {ActorID, NO_DATA_BLOCK_ID} from "fvm-as-sdk/assembly";
import {saveState} from "./state";


export function invoke(_: u32): u32 {
  const methodNum = methodNumber()

  switch (u32(methodNum)) {
    case 1:
      constructor()
      break
    /*case 2:
      say_hello()
      break*/
    default:
      usrUnhandledMsg()
  }

  return NO_DATA_BLOCK_ID
}

function constructor(): void {
  // This constant should be part of the SDK.
  const INIT_ACTOR_ADDR: ActorID = 10000;

  //if ( caller() != INIT_ACTOR_ADDR ) usrForbidden()

  /*const state = new State(0)
  state.save()*/
  saveState(0)

  return;
}

// Not working
function say_hello(): Uint8Array {
  /*const state = State.load();
  state.count += 1;
  state.save();*/

  const ret = new Uint8Array(2); // "A"
  ret[0] = 97;
  ret[1] = 65;

  return ret;
}
