import {setRoot} from "@zondax/fvm-as-sdk/assembly/wrappers";
import {Put, root} from "@zondax/fvm-as-sdk/assembly/helpers";
import {Cid, DAG_CBOR, MAX_CID_LEN} from "@zondax/fvm-as-sdk/assembly/env";
import {root as selfRoot} from "@zondax/fvm-as-sdk/assembly/wrappers/self";

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
        const cidBuf = new Uint8Array(MAX_CID_LEN)
        //const cidBufLen = selfRoot(cidBuf)
        //const readCid = root()

        return new State(u32(0))
    }
}
