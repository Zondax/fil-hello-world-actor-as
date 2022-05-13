import {caller, methodNumber} from "./sdk";
import {usrForbidden, usrUnhandledMsg} from "./sdk";
import {ActorID, NO_DATA_BLOCK_ID} from "./sdk";
import {State} from "./sdk/utils/state/json";


export function invoke(_: u32): u32 {

  //const methodNum = methodNumber()

  const msgPrt = memory.data(4)

  /*switch (u32(methodNum)) {
    case 1:
      constructor()
      break
    case 2:
      let ret: Uint8Array
      ret = say_hello()
      break
    default:
      usrUnhandledMsg()
  }*/

  return NO_DATA_BLOCK_ID
}

export function constructor(): void {
  // This constant should be part of the SDK.
  const INIT_ACTOR_ADDR: ActorID = 1;

  //if ( caller() != INIT_ACTOR_ADDR ) usrForbidden()

  //const state = new State(0)
  //state.save()

  return;
}

/*function say_hello(): Uint8Array {
  const state = State.load();
  state.count += 1;
  state.save();

  const ret = new Uint8Array(2); // "A"
  ret[0] = 97;
  ret[1] = 65;

  return ret;
}*/