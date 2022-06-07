import {Put} from "fvm-as-sdk/assembly";
import {Cid, DAG_CBOR} from "fvm-as-sdk/assembly";
import {setRoot} from "fvm-as-sdk/assembly";

export class State {
    count:u32

    constructor(count: u32) {
        this.count = count;
    }

    save(): Cid{
        const cborBytes: Uint8Array = new Uint8Array(2); // [129, 0]
        cborBytes[0] = 129;
        cborBytes[1] = 0;
        const stCid = Put(0xb220, 32, DAG_CBOR, cborBytes)

        setRoot(stCid)

        return stCid
    }

    static load(): State{
        return new State(u32(0))
    }
}
