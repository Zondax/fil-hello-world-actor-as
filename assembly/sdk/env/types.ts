export type ActorID = u64
export type Codec = u64

export class IpldOpen {
    constructor(
        Id: u32,
        Codec: Codec,
        Size: u32
    ) {}
}

export class IpldStat {
    constructor(
        Codec: Codec,
        Size: u32
    ) {}
}

export class Cid {
    constructor(public value: string, public raw: Array<u8>, public len: u32) {}
}
