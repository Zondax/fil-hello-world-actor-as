import {env, USR_FORBIDDEN, USR_UNHANDLED_MESSAGE} from "./env"

export function usrUnhandledError(): isize{
    const prt = memory.data(19)
    store<string>(prt, "unrecognized method")

    return env.abort(USR_UNHANDLED_MESSAGE, prt, 19)
}


export function usrForbidden(): isize{
    const prt = memory.data(39)
    store<string>(prt, "constructor invoked by non-init actor")

    return env.abort(USR_FORBIDDEN, prt, 39)
}


function abort(code: u32, msg: string): isize{
    const len = msg.length
    const prt = memory.data(len)
    store<string>(prt, msg)

    return env.abort(code, prt, len)
}
