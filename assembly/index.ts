import {env, ActorID, USR_FORBIDDEN, USR_UNHANDLED_MESSAGE, NO_DATA_BLOCK_ID} from "./env"


export function invoke(_: u32): u32 {
  const method_num = env.method_number()
  return NO_DATA_BLOCK_ID;
}

export function constructor(): void {
  return;
}
