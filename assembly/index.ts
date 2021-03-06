import {State} from "./state";

// @ts-ignore
@constructor
function init(): void {
  // If we want to attach some storage to the instance,
  // a state needs to be saved at this step.
  // So we create a store, and call save method
  // @ts-ignore
  State.defaultState().save()
}

// @ts-ignore
@export_method(2)
// User function. Smart-contract-related function.
function say_hello(): string {
  // If we want to restore the storage related to this instance,
  // we should call static load function. It will return a preloaded
  // state

  // @ts-ignore
  const state = State.load() as State;

  // Do some stuff with the state
  state.count += 1;

  // Save the state with updated values
  state.save();

  // Create a string with some value from state
  return "Hello world " + state.count.toString()
}
