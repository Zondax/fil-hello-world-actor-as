import {caller, methodNumber} from "./sdk";
import {usrForbidden, usrUnhandledMsg} from "./sdk";
import {ActorID, NO_DATA_BLOCK_ID} from "./sdk";


export function invoke(_: u32): u32 {
  const methodNum = methodNumber()
  if (methodNum == u64(1)) constructor()
  else usrUnhandledMsg()

  return NO_DATA_BLOCK_ID;
}

export function constructor(): void {
  // This constant should be part of the SDK.
  const INIT_ACTOR_ADDR: ActorID = 1;

  if ( caller() != INIT_ACTOR_ADDR ) usrForbidden()

  return;
}
