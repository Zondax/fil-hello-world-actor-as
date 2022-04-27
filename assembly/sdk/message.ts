import {env} from "./env";

export function methodNumber(): u64{
    const msgPrt = memory.data(sizeof<u64>())
    env.method_number(msgPrt)
    return load<u64>(msgPrt)
}

export function caller(): u64{
    const msgPrt = memory.data(sizeof<u64>())
    env.caller(msgPrt)
    return load<u64>(msgPrt)
}
