import {ipld} from "../env/sys/ipld"
import {Codec, IpldStat, IpldOpen} from "../env"
import {genericAbort} from "./errors"

export function create(codec: u64, data: Uint8Array ): u32 {
    const respPtr = memory.data(sizeof<u32>())
    const dataPtr = changetype<usize>(data.dataStart)
    const dataLen = data.length

    const code = ipld.create(respPtr, codec, dataPtr, dataLen)
    if (code != 0) {
        genericAbort(changetype<u32>(code))
    }

    return load<u32>(respPtr)
}

export function cid(id: u32, hash_fun: u64, hash_len: u32, cidBuf: Uint8Array): u32 {
    const respPtr = memory.data(sizeof<u32>())
    const cidBufPtr = changetype<usize>(cidBuf.dataStart)
    const cidBufLen = cidBuf.length

    const code = ipld.cid(respPtr, id, hash_fun, hash_len, cidBufPtr, cidBufLen)
    if (code != 0) {
        genericAbort(changetype<u32>(code))
    }

    return load<u32>(respPtr)
}


export function read(id: u32, offset: u32, buf:Uint8Array): u32 {
    const respPtr = memory.data(sizeof<u32>())
    const dataPtr = changetype<usize>(buf.dataStart)
    const dataLen = buf.length

    const code = ipld.read(respPtr, id, offset, dataPtr, dataLen)
    if (code != 0) {
        genericAbort(changetype<u32>(code))
    }

    return load<u32>(respPtr)
}

export function stat(id: u32): IpldStat {
    const respPtr = memory.data(sizeof<Codec>() + sizeof<u32>()) // Codec + Size

    const code = ipld.stat(respPtr, id)
    if (code != 0) {
        genericAbort(changetype<u32>(code))
    }

    const resp: IpldStat = {
        Codec: load<u64>(respPtr),
        Size: load<u32>(respPtr + sizeof<u64>())
    }

    return resp
}

export function open(id: Uint8Array): IpldOpen {
    const respPtr = memory.data(sizeof<u32>() + sizeof<Codec>() + sizeof<u32>()) // Id + Codec + Size
    const dataPtr = changetype<usize>(id.dataStart)

    const code = ipld.open(respPtr, dataPtr)
    if (code != 0) {
        genericAbort(changetype<u32>(code))
    }

    return {
        Id: load<u32>(respPtr),
        Codec: load<u64>(respPtr + sizeof<u32>()),
        Size: load<u32>(respPtr + sizeof<u32>() + sizeof<u64>())
    }
}
