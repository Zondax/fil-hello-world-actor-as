import {setRoot} from "@zondax/fvm-as-sdk/assembly/wrappers";
import {Put, Get, root} from "@zondax/fvm-as-sdk/assembly/helpers";
import {Cid, DAG_CBOR} from "@zondax/fvm-as-sdk/assembly/env";
import {CBOREncoder} from "@zondax/assemblyscript-cbor/assembly";

// This class represents the actor state.
// On save and load functions, persistence can be implemented.
// Any value we can keep between calls should be written to the storage (IPLD)
export class State {
    // In this case, we only keep a counter
    count:u8

    // Set initial value when instantiating a new state
    constructor(count: u8) {
        this.count = count;
    }

    // Function responsible to serialize state and save it to IPLD
    save(): Cid{
        // Create some data array
        const data = new Array<u8>()
        data.push(this.count)

        // Use CBOREncoder to serialize data into CBOR
        const encoder = new CBOREncoder();
        encoder.addArrayU8(data)

        // Create a new block on IPLD with serialized data
        // It returns the id of that new block
        const stCid = Put(0xb220, 32, DAG_CBOR, Uint8Array.wrap(encoder.serialize()))

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
        const buff = Get(readCid)

        // Basic deserialization. This will be replaced by some CBOR lib for AssemblyScript
        return new State(u8(buff[1]))
    }
}
