import {setRoot} from "@zondax/fvm-as-sdk/assembly/wrappers";
import {Put, Get, root} from "@zondax/fvm-as-sdk/assembly/helpers";
import {Cid, DAG_CBOR} from "@zondax/fvm-as-sdk/assembly/env";
import {CBOREncoder, CBORDecoder} from "@zondax/assemblyscript-cbor/assembly";
import {Obj, Integer} from "@zondax/assemblyscript-cbor/assembly/types";

// This class represents the actor state.
// On save and load functions, persistence can be implemented.
// Any value we can keep between calls should be written to the storage (IPLD)
export class State {
    // In this case, we only keep a counter
    count:u64

    // Set initial value when instantiating a new state
    constructor(count: u64) {
        this.count = count;
    }

    // Function responsible to serialize state and save it to IPLD
    save(): Cid{
        // Use CBOREncoder to serialize data into CBOR
        const encoder = new CBOREncoder();
        encoder.addObject(1)
        encoder.addKey("counter")
        encoder.addUint64(this.count)

        // Create a new block on IPLD with serialized data
        // It returns the id of that new block
        const encodedData = Uint8Array.wrap(encoder.serialize())
        const stCid = Put(0xb220, 32, DAG_CBOR, encodedData)

        // setRoot allows to attach that new block to the actor instance that is running
        // If this is not done, the block won't be related to this actor, and it won't be able
        // to access it
        setRoot(stCid)

        return stCid
    }

    // Static function used to load the state attached or related to this actor instance
    static load(): State{
        // Get the block id related to this instance
        const readCid = root()

        // Using that id, get the block and read the serialized data
        const ipldData = Get(readCid)

        // Use CBORDecoder to CBOR data into an object
        const decoder = new CBORDecoder(ipldData.buffer)
        const rawState = decoder.parse()

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
}
