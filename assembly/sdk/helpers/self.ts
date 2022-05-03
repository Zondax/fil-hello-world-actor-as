import {Cid, MAX_CID_LEN} from "../env";
import {root} from "../wrappers/self";
import {cast} from "../utils/cid/multihash";

export function root(): Cid{
    const cidBuf = new Uint8Array(MAX_CID_LEN)
    const cidBufLen = root(cidBuf)

    return cast(cidBuf)
}
