// @chainfile-state
import { BaseState } from "@zondax/fvm-as-sdk/assembly/utils/state";

// @ts-ignore
@state

// This class represents the actor state.
// The BaseState is an abstract class. It has IPLD logic to read and write data to storage
// Any state class only needs to extend it, and implement encode, parse and load functions
// @ts-ignore
export class State extends BaseState {
  // In this case, we only keep a counter
  count: u64;
}
