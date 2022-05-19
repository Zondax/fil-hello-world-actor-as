import {Cid} from "../env"
import {self} from "../env/sys/self"
import {USR_UNSPECIFIED} from "../env/errors"
import {genericAbort} from "./errors"

export function setRoot(id: Cid): void {
    const dataPtr = changetype<usize>(id.raw)

    // TODO Check if ipld.create func ran successfully
    const code = self.set_root(dataPtr)

    if (code != 0) {
        genericAbort(USR_UNSPECIFIED)
    }
}


export function root(cidBuf: Uint8Array): u32 {
    const msgPrt = memory.data(sizeof<usize>())
    const dataPtr = changetype<usize>(cidBuf)
    const dataLen = cidBuf.length

    // TODO Check if self.root func ran successfully
    self.root(msgPrt, dataPtr, dataLen)

    return load<u32>(msgPrt)
}
