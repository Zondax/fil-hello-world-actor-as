import {caller, methodNumber} from "./sdk";
import {usrForbidden, usrUnhandledMsg} from "./sdk";
import {ActorID, NO_DATA_BLOCK_ID} from "./sdk";
import {saveState} from "./sdk/utils/state/json";


export function invoke(_: u32): u32 {
  const methodNum = methodNumber()

  switch (u32(methodNum)) {
    case 1:
      constructor()
      break
    case 2:
      //say_hello()
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

  //saveState(0)
  const cborBytes = new Uint8Array(2);

  return;
}

// Not working
/*function say_hello(): Uint8Array {
  const state = State.load();
  state.count += 1;
  state.save();

  const ret = new Uint8Array(2); // "A"
  ret[0] = 97;
  ret[1] = 65;

  return ret;
}*/
