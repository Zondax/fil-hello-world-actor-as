import {ipld} from "./env/sys/ipld"

export function create(codec: u64, data: ArrayBuffer ): u32 {
    const respPtr = memory.data(sizeof<u32>())
    const dataPtr = changetype<usize>(data)
    const dataLen = data.byteLength

    // TODO Check if ipld.create func ran successfully
    ipld.create(respPtr, codec, dataPtr, dataLen)

    return load<u32>(respPtr)
}
