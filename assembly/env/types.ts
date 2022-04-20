export type TokenAmount = {
    lo: u64,
    hi: u64,
}

export type ResolveAddress = {
    value: u64,
    resolved: i32,
}

export type VerifyConsensusFault = {
    epoch: i64,
    target: u64,
    fault: u32,
}

export type IpldOpen = {
    codec: u64,
    id: u32,
    size: u32,
}

export type IpldStat = {
    codec: u64,
    size: u32,
}

export type Send = {
    exit_code: u32,
    return_id: u32,
}
