/// Identifier for Actors, includes builtin and initialized actors
export type ActorID = u64;

/// BlockID representing nil parameters or return data.
export const NO_DATA_BLOCK_ID: u32 = 0;

export class TokenAmount {
    lo: u64
    hi: u64
}

export class ResolveAddress {
    value: u64
    resolved: i32
}

export class VerifyConsensusFault {
    epoch: i64
    target: u64
    fault: u32
}

export class IpldOpen{
    codec: u64
    id: u32
    size: u32
}

export class IpldStat {
    codec: u64
    size: u32
}

export class Send {
    exit_code: u32
    return_id: u32
}
