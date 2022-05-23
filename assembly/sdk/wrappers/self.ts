import {Cid} from "../env"
import {self} from "../env/sys/self"
import {USR_UNSPECIFIED} from "../env/errors"
import {genericAbort} from "./errors"

export function setRoot(id: Cid): void {
    const dataPtr = changetype<usize>(id.raw.dataStart)

    const code = self.set_root(dataPtr)
    if (code != 0) {
        genericAbort(changetype<u32>(code))
    }
}


export function root(cidBuf: Uint8Array): u32 {
    const msgPrt = memory.data(sizeof<usize>())
    const dataPtr = changetype<usize>(cidBuf.dataStart)
    const dataLen = cidBuf.length

    // TODO Check if self.root func ran successfully
    const code = self.root(msgPrt, dataPtr, dataLen)
    if (code != 0) {
        genericAbort(changetype<u32>(code))
    }

    return load<u32>(msgPrt)
}
