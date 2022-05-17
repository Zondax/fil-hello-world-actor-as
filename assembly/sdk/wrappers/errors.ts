import {USR_FORBIDDEN, USR_ILLEGAL_STATE, USR_UNHANDLED_MESSAGE} from "../env/errors";
import {vm} from "../env/sys/vm"

export function usrUnhandledMsg(): isize{
    return genericAbort(USR_UNHANDLED_MESSAGE)
}

export function usrForbidden(): isize{
    return genericAbort(USR_FORBIDDEN)
}

export function usrIllegalState(): isize{
    return genericAbort(USR_ILLEGAL_STATE)
}

/*export function genericAbort(code: u32, msg: string):isize{
    const dataPtr = changetype<usize>(msg)
    const dataLen = msg.length

    return vm.abort(code, dataPtr, dataLen)
}*/


export function genericAbort(code: u32):isize{
    //const dataPtr = changetype<usize>(msg)
    //const dataLen = msg.length

    return vm.abort(code, 0, 0)
}
