
/// Store a block. The block will only be persisted in the state-tree if the CID is "linked in" to
/// the actor's state-tree before the end of the current invocation.
import {cid, create} from "../wrappers";
import {Cid, MAX_CID_LEN} from "../env";
import {cast} from "../utils/cid/multihash";

export function Put(mh_code: u64, mh_size: u32, codec: u64, data: Array<u8>): Cid {
    const id = create(codec, data)

    // I really hate this CID interface. Why can't I just have bytes?
    const buf = new Array<u8>(MAX_CID_LEN)
    const cidLen = cid(id, mh_code, mh_size, buf)

    return cast(buf)
}
