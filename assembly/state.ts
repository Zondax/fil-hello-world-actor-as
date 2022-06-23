// @chainfile-state
import {BaseState} from "@zondax/fvm-as-sdk/assembly/utils/state";
import {Value, Obj, Integer} from "@zondax/assemblyscript-cbor/assembly/types";

// @ts-ignore
@state

// This class represents the actor state.
// The BaseState is an abstract class. It has IPLD logic to read and write data to storage
// Any state class only needs to extend it, and implement encode, parse and load functions
export class State extends BaseState{
    // In this case, we only keep a counter
    count:u64

    // Set initial value when instantiating a new state
    constructor(count: u64) {
        super();
        this.count = count;
    }

    // This function should only indicate how to convert from a generic object model to this state class
    protected parse(rawState: Value): State {
        let count:i64 = 0
        if(rawState.isObj){
            // Here we cast as object as we know that is what we saved before
            const state = rawState as Obj

            // Get counter
            if(state.has("count"))
                count = (state.get("count") as Integer).valueOf()
        }

        return new State(count)
    }

    static load():State{
        return new State(0).load() as State
    }
}
