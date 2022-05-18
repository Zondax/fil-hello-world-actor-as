import {Cid} from "../../env";

export function cast(buf: Uint8Array): Uint8Array{
    if(buf.length < 2){
        return new Uint8Array(0)
    }

    const len = buf[1];
    const raw = buf.slice(2, len)
    const value = raw.toString()

    return raw
}
