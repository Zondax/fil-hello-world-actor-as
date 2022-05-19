import {root} from "../../helpers/self";
import {Get, Put} from "../../helpers/ipld";
import {Cid, DAG_CBOR} from "../../env";
import {setRoot} from "../../wrappers/self";

export class State {
    count:u32

    constructor(count: u32) {
        this.count = count;
    }

    save(): Cid{
        const cborBytes: Uint8Array = new Uint8Array(2); // [129, 0]
        cborBytes[0] = 129;
        cborBytes[1] = 1; 
        const stCid = Put(0xb220, 32, DAG_CBOR, cborBytes)

        setRoot(stCid)

        return stCid
    }

    static load(): State{
        return new State(u32(0))
    }
}

export function saveState(count: u32): void {
    const cborBytes: Uint8Array = new Uint8Array(2); // [129, 0]
    cborBytes[0] = 129;
    cborBytes[1] = 1; 
    const stCid = Put(0xb220, 32, DAG_CBOR, cborBytes)

    setRoot(stCid)

    return
}

/*export function readState(): State{
    const rootCid = root()
    const data = Get(rootCid)

    let countOrNull: u64 = 1;

    if( countOrNull !== null ){
        return new State(u32(countOrNull))
    } else {
        return new State(u32(0))
    }
}*/
