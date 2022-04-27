import {caller, methodNumber} from "./sdk/message";
import {usrUnhandledError, usrForbidden} from "./sdk/vm";
import {NO_DATA_BLOCK_ID} from "./sdk/env/constants";
import {ActorID} from "./sdk/env/types";


export function invoke(_: u32): u32 {
  const methodNum = methodNumber()
  if (methodNum == u64(1)) constructor()
  else usrUnhandledError()

  return NO_DATA_BLOCK_ID;
}

export function constructor(): void {
  // This constant should be part of the SDK.
  const INIT_ACTOR_ADDR: ActorID = 1;

  if ( caller() != INIT_ACTOR_ADDR ) usrForbidden()

  return;
}
