import {Cid} from "../../env";

export function cast(buf: Uint8Array, len: u32): Cid{
    if(buf.length < 2){
        return new Cid("", new Uint8Array(0), 0)
    }

    const value = buf.toString()

    return new Cid(value, buf, len)
}
