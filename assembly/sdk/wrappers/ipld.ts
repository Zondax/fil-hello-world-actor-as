import {ipld} from "../env/sys/ipld"
import {Codec, IpldStat, IpldOpen} from "../env";

export function create(codec: u64, data: Array<u8> ): u32 {
    const respPtr = memory.data(sizeof<u32>())
    const dataPtr = changetype<usize>(data)
    const dataLen = data.length

    // TODO Check if ipld.create func ran successfully
    ipld.create(respPtr, codec, dataPtr, dataLen)

    return load<u32>(respPtr)
}

export function cid(id: u32, hash_fun: u64, hash_len: u32, cidBuf: Array<u8>): u32 {
    const respPtr = memory.data(sizeof<u32>())
    const cidBufPtr = changetype<usize>(cidBuf)
    const cidBufLen = cidBuf.length

    // TODO Check if ipld.create func ran successfully
    ipld.cid(respPtr, id, hash_fun, hash_len, cidBufPtr, cidBufLen)

    return load<u32>(respPtr)
}


export function read(id: u32, offset: u32, buf:Array<u8>): u32 {
    const respPtr = memory.data(sizeof<u32>())
    const dataPtr = changetype<usize>(buf)
    const dataLen = buf.length

    // TODO Check if ipld.create func ran successfully
    ipld.read(respPtr, id, offset, dataPtr, dataLen)

    return load<u32>(respPtr)
}

export function stat(id: u32): IpldStat {
    const respPtr = memory.data(sizeof<Codec>() + sizeof<u32>()) // Codec + Size

    // TODO Check if ipld.create func ran successfully
    ipld.stat(respPtr, id)

    const resp: IpldStat = {
        Codec: load<u64>(respPtr),
        Size: load<u32>(respPtr + sizeof<u64>())
    }

    return resp
}

export function open(id: Array<u8>): IpldOpen {
    const respPtr = memory.data(sizeof<u32>() + sizeof<Codec>() + sizeof<u32>()) // Id + Codec + Size
    const dataPtr = changetype<usize>(id)

    // TODO Check if ipld.create func ran successfully
    ipld.open(respPtr, dataPtr)

    return {
        Id: load<u32>(respPtr),
        Codec: load<u64>(respPtr + sizeof<u32>()),
        Size: load<u32>(respPtr + sizeof<u32>() + sizeof<u64>())
    }
}
