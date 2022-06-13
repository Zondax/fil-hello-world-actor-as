import {BaseState} from "@zondax/fvm-as-sdk/assembly/utils/state/state";
import {Value} from "@zondax/assemblyscript-cbor/assembly/types";
import {CBOREncoder} from "@zondax/assemblyscript-cbor/assembly";
import {Obj, Integer} from "@zondax/assemblyscript-cbor/assembly/types";

// This class represents the actor state.
// On save and load functions, persistence can be implemented.
// Any value we can keep between calls should be written to the storage (IPLD)
export class State extends BaseState{
    // In this case, we only keep a counter
    count:u64

    // Set initial value when instantiating a new state
    constructor(count: u64) {
        super();
        this.count = count;
    }

    protected encode(): ArrayBuffer {
        // Use CBOREncoder to serialize data into CBOR
        const encoder = new CBOREncoder();
        encoder.addObject(1)
        encoder.addKey("counter")
        encoder.addUint64(this.count)

        return encoder.serialize()
    }

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
