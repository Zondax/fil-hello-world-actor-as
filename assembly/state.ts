import {BaseState} from "@zondax/fvm-as-sdk/assembly/utils/state";
import {Value, Obj, Integer} from "@zondax/assemblyscript-cbor/assembly/types";
import {CBOREncoder} from "@zondax/assemblyscript-cbor/assembly";

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

    // This function should only indicate how to serialize the store into CBOR
    protected encode(): ArrayBuffer {
        // Use CBOREncoder to serialize data into CBOR
        const encoder = new CBOREncoder();
        encoder.addObject(1)
        encoder.addKey("counter")
        encoder.addUint64(this.count)

        return encoder.serialize()
    }

    // This function should only indicate how to convert from a generic object model to this state class
    protected parse(rawState: Value): State {
        let counter:i64 = 0
        if(rawState.isObj){
            // Here we cast as object as we know that is what we saved before
            const state = rawState as Obj

            // Get counter
            if(state.has("counter"))
                counter = (state.get("counter") as Integer).valueOf()
        }

        return new State(counter)
    }

    static load():State{
        return new State(0).load() as State
    }
}
