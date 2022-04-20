import {IpldOpen, IpldStat, ResolveAddress, Send, TokenAmount, VerifyConsensusFault} from "./types"

export namespace sys {
    // #######
    // # Gas #
    // #######

    /// Charge gas.
    ///
    /// # Arguments
    ///
    /// - `name_off` and `name_len` specify the location and length of the "name" of the gas charge,
    ///   for debugging.
    /// - `amount` is the amount of gas to charge.
    ///
    /// # Errors
    ///
    /// | Error               | Reason               |
    /// |---------------------|----------------------|
    /// | [`IllegalArgument`] | invalid name buffer. |
    @external("gas", "charge")
    export declare function charge(name_off: u8, name_len: u32, amount: u64): void;

    // #############################################
    // #############################################

    // ###########
    // # Message #
    // ###########

    /// Returns the caller's actor ID.
    ///
    /// # Errors
    ///
    /// None
    @external("message", "caller")
    export declare function caller(): u64;

    /// Returns the receiver's actor ID (i.e. ourselves).
    ///
    /// # Errors
    ///
    /// None
    @external("message", "receiver")
    export declare function receiver(): u64;

    /// Returns the method number from the message.
    ///
    /// # Errors
    ///
    /// None
    @external("message", "method_number")
    export declare function method_number(): u64;

    /// Returns the value that was received.
    ///
    /// # Errors
    ///
    /// None
    @external("message", "value_received")
    export declare function value_received(): TokenAmount;

    // #############################################
    // #############################################

    // #########
    // # Actor #
    // #########

    /// Resolves the ID address of an actor.
    ///
    /// # Arguments
    ///
    /// `addr_off` and `addr_len` specify the location and length of an address to be resolved.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                                    |
    /// |---------------------|-----------------------------------------------------------|
    /// | [`IllegalArgument`] | if the passed address buffer isn't valid, in memory, etc. |
    @external("actors", "resolve_address")
    export declare function resolve_address(addr_off: u8, addr_len: u32): ResolveAddress;

    /// Gets the CodeCID of an actor by address.
    ///
    /// # Arguments
    ///
    /// - `addr_off` and `addr_len` specify the location and length of an address of the target
    ///   actor.
    /// - `obuf_off` and `obuf_len` specify the location and length of a byte buffer into which the
    ///   FVM will write the actor's code CID, if the actor is found. If the
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                                    |
    /// |---------------------|-----------------------------------------------------------|
    /// | [`IllegalArgument`] | if the passed address buffer isn't valid, in memory, etc. |
    @external("actors", "get_actor_code_cid")
    export declare function get_actor_code_cid(addr_off: u8, addr_len: u32, obuf_off: u8, obuf_len: u32): i32;

    /// Determines whether the specified CodeCID belongs to that of a builtin
    /// actor and which. Returns 0 if unrecognized. Can only fail due to
    /// internal errors.
    @external("actors", "resolve_builtin_actor_type")
    export declare function resolve_builtin_actor_type(cid_off: u8): i32;

    /// Returns the CodeCID for the given built-in actor type. Aborts with exit
    /// code IllegalArgument if the supplied type is invalid. Returns the
    /// length of the written CID written to the output buffer. Can only
    /// return a failure due to internal errors.
    @external("actors", "get_code_cid_for_type")
    export declare function get_code_cid_for_type(typ: i32, obuf_off: u8, obuf_len: u32): i32;

    /// Generates a new actor address for an actor deployed
    /// by the calling actor.
    ///
    /// **Privledged:** May only be called by the init actor.
    @external("actors", "new_actor_address")
    export declare function new_actor_address(obuf_off: u8, obuf_len: u32): u32;

    /// Creates a new actor of the specified type in the state tree, under
    /// the provided address.
    ///
    /// **Privledged:** May only be called by the init actor.
    @external("actors", "create_actor")
    export declare function create_actor(actor_id: u64, typ_off: u8): void;

    // #############################################
    // #############################################

    // ###########
    // # Network #
    // ###########

    /// Gets the current epoch.
    ///
    /// # Errors
    ///
    /// None
    @external("network", "curr_epoch")
    export declare function curr_epoch():i64;

    /// Gets the network version.
    ///
    /// # Errors
    ///
    /// None
    @external("network", "version")
    export declare function version(): u32;

    /// Gets the base fee for the current epoch.
    ///
    /// # Errors
    ///
    /// None
    @external("network", "base_fee")
    export declare function base_fee() :TokenAmount;

    /// Gets the circulating supply.
    ///
    /// # Errors
    ///
    /// None
    @external("network", "total_fil_circ_supply")
    export declare function total_fil_circ_supply():TokenAmount;

    // #############################################
    // #############################################

    // ###########
    // # Crypto #
    // ###########


    /// Verifies that a signature is valid for an address and plaintext.
    ///
    /// Returns 0 on success, or -1 if the signature fails to validate.
    ///
    /// # Arguments
    ///
    /// - `sig_off` and `sig_len` specify location and length of the signature.
    /// - `addr_off` and `addr_len` specify location and length of expected signer's address.
    /// - `plaintext_off` and `plaintext_len` specify location and length of the signed data.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                               |
    /// |---------------------|------------------------------------------------------|
    /// | [`IllegalArgument`] | signature, address, or plaintext buffers are invalid |
    export declare function verify_signature(
        sig_off: u8,
        sig_len: u32,
        addr_off: u8,
        addr_len: u32,
        plaintext_off: u8,
        plaintext_len: u32,
        ) :i32;

    /// Hashes input data using blake2b with 256 bit output.
    ///
    /// Returns a 32-byte hash digest.
    ///
    /// # Arguments
    ///
    /// - `data_off` and `data_len` specify location and length of the data to be hashed.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                          |
    /// |---------------------|-------------------------------------------------|
    /// | [`IllegalArgument`] | the input buffer does not point to valid memory |
    export declare function hash_blake2b(
        data_off: u8,
        data_len: u32,
        ) :Uint8Array;

    /// Computes an unsealed sector CID (CommD) from its constituent piece CIDs
    /// (CommPs) and sizes.
    ///
    /// Writes the CID in the provided output buffer, and returns the length of
    /// the written CID.
    ///
    /// # Arguments
    ///
    /// - `proof_type` is the type of seal proof.
    /// - `pieces_off` and `pieces_len` specify the location and length of a cbor-encoded list of
    ///   [`PieceInfo`][fvm_shared::piece::PieceInfo] in tuple representation.
    /// - `cid_off` is the offset at which the computed CID will be written.
    /// - `cid_len` is the size of the buffer at `cid_off`. 100 bytes is guaranteed to be enough.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                   |
    /// |---------------------|--------------------------|
    /// | [`IllegalArgument`] | an argument is malformed |
    export declare function compute_unsealed_sector_cid(
        proof_type: i64,
        pieces_off: u8,
        pieces_len: u32,
        cid_off: u8,
        cid_len: u32,
    ) :u32;

    /// Verifies a sector seal proof.
    ///
    /// Returns 0 to indicate that the proof was valid, -1 otherwise.
    ///
    /// # Arguments
    ///
    /// `info_off` and `info_len` specify the location and length of a cbor-encoded
    /// [`SealVerifyInfo`][fvm_shared::sector::SealVerifyInfo] in tuple representation.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                   |
    /// |---------------------|--------------------------|
    /// | [`IllegalArgument`] | an argument is malformed |
    export declare function verify_seal(info_off: u8, info_len: u32) :i32;

    /// Verifies a window proof of spacetime.
    ///
    /// Returns 0 to indicate that the proof was valid, -1 otherwise.
    ///
    /// # Arguments
    ///
    /// `info_off` and `info_len` specify the location and length of a cbor-encoded
    /// [`WindowPoStVerifyInfo`][fvm_shared::sector::WindowPoStVerifyInfo] in tuple representation.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                   |
    /// |---------------------|--------------------------|
    /// | [`IllegalArgument`] | an argument is malformed |
    export declare function verify_post(info_off: u8, info_len: u32) :i32;

    /// Verifies that two block headers provide proof of a consensus fault.
    ///
    /// Returns a 0 status if a consensus fault was recognized, along with the
    /// BlockId containing the fault details. Otherwise, a -1 status is returned,
    /// and the second result parameter must be ignored.
    ///
    /// # Arguments
    ///
    /// - `h1_off`/`h1_len` and `h2_off`/`h2_len` specify the location and length of the block
    ///   headers that allegedly represent a consensus fault.
    /// - `extra_off` and `extra_len` specifies the "extra data" passed in the
    ///   `ReportConsensusFault` message.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                |
    /// |---------------------|---------------------------------------|
    /// | [`LimitExceeded`]   | exceeded lookback limit finding block |
    /// | [`IllegalArgument`] | an argument is malformed              |
    export declare function verify_consensus_fault(
        h1_off: u8,
        h1_len: u32,
        h2_off: u8,
        h2_len: u32,
        extra_off: u8,
        extra_len: u32,
        ) : VerifyConsensusFault;

    /// Verifies an aggregated batch of sector seal proofs.
    ///
    /// Returns 0 to indicate that the proof was valid, -1 otherwise.
    ///
    /// # Arguments
    ///
    /// `agg_off` and `agg_len` specify the location and length of a cbor-encoded
    /// [`AggregateSealVerifyProofAndInfos`][fvm_shared::sector::AggregateSealVerifyProofAndInfos]
    /// in tuple representation.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                         |
    /// |---------------------|--------------------------------|
    /// | [`LimitExceeded`]   | exceeds seal aggregation limit |
    /// | [`IllegalArgument`] | an argument is malformed       |
    export declare function verify_aggregate_seals(agg_off: u8, agg_len: u32) :i32;

    /// Verifies a replica update proof.
    ///
    /// Returns 0 to indicate that the proof was valid, -1 otherwise.
    ///
    /// # Arguments
    ///
    /// `rep_off` and `rep_len` specify the location and length of a cbor-encoded
    /// [`ReplicaUpdateInfo`][fvm_shared::sector::ReplicaUpdateInfo] in tuple representation.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                        |
    /// |---------------------|-------------------------------|
    /// | [`LimitExceeded`]   | exceeds replica update limit  |
    /// | [`IllegalArgument`] | an argument is malformed      |
    export declare function verify_replica_update(rep_off: u8, rep_len: u32) :i32;

    /// Verifies a batch of sector seal proofs.
    ///
    /// # Arguments
    ///
    /// - `batch_off` and `batch_len` specify the location and length of a cbor-encoded list of
    ///   [`SealVerifyInfo`][fvm_shared::sector::SealVerifyInfo] in tuple representation.
    /// - `results_off` specifies the location of a length `L` byte buffer where the results of the
    ///   verification will be written, where `L` is the number of proofs in the batch. For each
    ///   proof in the input list (in input order), a 1 or 0 byte will be written on success or
    ///   failure, respectively.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                   |
    /// |---------------------|--------------------------|
    /// | [`IllegalArgument`] | an argument is malformed |
    export declare function batch_verify_seals(batch_off: u8, batch_len: u32, result_off: u8): void;

    // #############################################
    // #############################################

    // ###########
    // # Debug #
    // ###########

    /// Returns if we're in debug mode. A zero or positive return value means
    /// yes, a negative return value means no.
    export declare function enabled():i32;

    /// Logs a message on the node.
    export declare function log(message: u8, message_len: u32):void;

    // #############################################
    // #############################################

    // ###########
    // # Ipld #
    // ###########

    /// Opens a block from the "reachable" set, returning an ID for the block, its codec, and its
    /// size in bytes.
    ///
    /// - The reachable set is initialized to the root.
    /// - The reachable set is extended to include the direct children of loaded blocks until the
    ///   end of the invocation.
    ///
    /// # Arguments
    ///
    /// - `cid` the location of the input CID (in wasm memory).
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                      |
    /// |---------------------|---------------------------------------------|
    /// | [`NotFound`]        | the target block isn't in the reachable set |
    /// | [`IllegalArgument`] | there's something wrong with the CID        |
    export declare function open(cid: u8) :IpldOpen;

    /// Creates a new block, returning the block's ID. The block's children must be in the reachable
    /// set. The new block isn't added to the reachable set until the CID is computed.
    ///
    /// # Arguments
    ///
    /// - `codec` is the codec of the block.
    /// - `data` and `len` specify the location and length of the block data.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                                  |
    /// |---------------------|---------------------------------------------------------|
    /// | [`LimitExceeded`]   | the block is too big                                    |
    /// | [`NotFound`]        | one of the blocks's children isn't in the reachable set |
    /// | [`IllegalCodec`]    | the passed codec isn't supported                        |
    /// | [`Serialization`]   | the passed block doesn't match the passed codec         |
    /// | [`IllegalArgument`] | the block isn't in memory, etc.                         |
    export declare function create(codec: u64, data: u8, len: u32) :u32;

    /// Reads the block identified by `id` into `obuf`, starting at `offset`, reading _at most_
    /// `max_len` bytes.
    ///
    /// Returns the number of bytes read.
    ///
    /// # Arguments
    ///
    /// - `id` is ID of the block to read.
    /// - `offset` is the offset in the block to start reading.
    /// - `obuf` is the output buffer (in wasm memory) where the FVM will write the block data.
    /// - `max_len` is the maximum amount of block data to read.
    ///
    /// Passing a length/offset that exceed the length of the block will not result in an error, but
    /// will result in no data being read.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                            |
    /// |---------------------|---------------------------------------------------|
    /// | [`InvalidHandle`]   | if the handle isn't known.                        |
    /// | [`IllegalArgument`] | if the passed buffer isn't valid, in memory, etc. |
    export declare function read(id: u32, offset: u32, obuf: u8, max_len: u32) :u32;

    /// Returns the codec and size of the specified block.
    ///
    /// # Errors
    ///
    /// | Error             | Reason                     |
    /// |-------------------|----------------------------|
    /// | [`InvalidHandle`] | if the handle isn't known. |
    export declare function stat(id: u32):IpldStat;

    // TODO: CID versions?

    /// Computes the given block's CID, writing the resulting CID into `cid`, returning the actual
    /// size of the CID.
    ///
    /// If the CID is longer than `cid_max_len`, no data is written and the actual size is returned.
    ///
    /// The returned CID is added to the reachable set.
    ///
    /// # Arguments
    ///
    /// - `id` is ID of the block to linked.
    /// - `hash_fun` is the multicodec of the hash function to use.
    /// - `hash_len` is the desired length of the hash digest.
    /// - `cid` is the output buffer (in wasm memory) where the FVM will write the resulting cid.
    /// - `cid_max_length` is the length of the output CID buffer.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                            |
    /// |---------------------|---------------------------------------------------|
    /// | [`InvalidHandle`]   | if the handle isn't known.                        |
    /// | [`IllegalCid`]      | hash code and/or hash length aren't supported.    |
    /// | [`IllegalArgument`] | if the passed buffer isn't valid, in memory, etc. |
    export declare function cid(
        id: u32,
        hash_fun: u64,
        hash_len: u32,
        cid: u8,
        cid_max_len: u32,
    ) :u32;

    // #############################################
    // #############################################

    // ###########
    // # Rand #
    // ###########

    /// Gets 32 bytes of randomness from the ticket chain.
    ///
    /// # Arguments
    ///
    /// - `tag` is the "domain separation tag" for distinguishing between different categories of
    ///    randomness. Think of it like extra, structured entropy.
    /// - `epoch` is the epoch to pull the randomness from.
    /// - `entropy_off` and `entropy_len` specify the location and length of the entropy buffer that
    ///    will be mixed into the system randomness.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                  |
    /// |---------------------|-------------------------|
    /// | [`LimitExceeded`]   | lookback exceeds limit. |
    /// | [`IllegalArgument`] | invalid buffer, etc.    |
    export declare function get_chain_randomness(
        tag: i64,
        epoch: i64,
        entropy_off: u8,
        entropy_len: u32,
        ): Uint8Array;

    /// Gets 32 bytes of randomness from the beacon system (currently Drand).
    ///
    /// # Arguments
    ///
    /// - `tag` is the "domain separation tag" for distinguishing between different categories of
    ///    randomness. Think of it like extra, structured entropy.
    /// - `epoch` is the epoch to pull the randomness from.
    /// - `entropy_off` and `entropy_len` specify the location and length of the entropy buffer that
    ///    will be mixed into the system randomness.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                  |
    /// |---------------------|-------------------------|
    /// | [`LimitExceeded`]   | lookback exceeds limit. |
    /// | [`IllegalArgument`] | invalid buffer, etc.    |
    export declare function get_beacon_randomness(
        tag: i64,
        epoch: i64,
        entropy_off: u8,
        entropy_len: u32,
        ) :Uint8Array;

    // #############################################
    // #############################################

    // ###########
    // # Send #
    // ###########

    /// Sends a message to another actor, and returns the exit code and block ID of the return
    /// result.
    ///
    /// # Arguments
    ///
    /// - `recipient_off` and `recipient_len` specify the location and length of the recipient's
    ///   address (in wasm memory).
    /// - `method` is the method number to invoke.
    /// - `params` is the IPLD block handle of the method parameters.
    /// - `value_hi` are the "high" bits of the token value to send (little-endian) in attoFIL.
    /// - `value_lo` are the "high" bits of the token value to send (little-endian) in attoFIL.
    ///
    /// **NOTE**: This syscall will transfer `(value_hi << 64) | (value_lo)` attoFIL to the
    /// recipient.
    ///
    /// # Errors
    ///
    /// A syscall error in [`send`] means the _caller_ did something wrong. If the _callee_ panics,
    /// exceeds some limit, aborts, aborts with an invalid code, etc., the syscall will _succeed_
    /// and the failure will be reflected in the exit code contained in the return value.
    ///
    /// | Error                 | Reason                                               |
    /// |-----------------------|------------------------------------------------------|
    /// | [`NotFound`]          | target actor does not exist and cannot be created.   |
    /// | [`InsufficientFunds`] | tried to send more FIL than available.               |
    /// | [`InvalidHandle`]     | parameters block not found.                          |
    /// | [`LimitExceeded`]     | recursion limit reached.                             |
    /// | [`IllegalArgument`]   | invalid recipient address buffer.                    |
    export declare function send(
        recipient_off: u8,
        recipient_len: u32,
        method: u64,
        params: u32,
        value_hi: u64,
        value_lo: u64,
        ) : Send;

    // #############################################
    // #############################################

    // ###########
    // # Self #
    // ###########

    /// Gets the current root for the calling actor.
    ///
    /// If the CID doesn't fit in the specified maximum length (and/or the length is 0), this
    /// function returns the required size and does not update the cid buffer.
    ///
    /// # Arguments
    ///
    /// - `cid` is the location in memory where the state-root will be written.
    /// - `max_cid_len` is length of the output CID buffer.
    ///
    /// # Errors
    ///
    /// | Error                | Reason                                             |
    /// |----------------------|----------------------------------------------------|
    /// | [`IllegalOperation`] | actor hasn't set the root yet, or has been deleted |
    /// | [`IllegalArgument`]  | if the passed buffer isn't valid, in memory, etc.  |
    export declare function root(cid:u8, cid_max_len: u32) :u32;

    /// Sets the root CID for the calling actor. The new root must be in the reachable set.
    ///
    /// # Arguments
    ///
    /// - `cid` is the location in memory of the new state-root CID.
    ///
    /// # Errors
    ///
    /// | Error                | Reason                                         |
    /// |----------------------|------------------------------------------------|
    /// | [`IllegalOperation`] | actor has been deleted                         |
    /// | [`NotFound`]         | specified root CID is not in the reachable set |
    export declare function set_root(cid: u8):void;

    /// Gets the current balance for the calling actor.
    ///
    /// # Errors
    ///
    /// None.
    export declare function current_balance() :TokenAmount;

    /// Destroys the calling actor, sending its current balance
    /// to the supplied address, which cannot be itself.
    ///
    /// # Arguments
    ///
    /// - `addr_off` and `addr_len` specify the location and length of beneficiary's address in wasm
    ///   memory.
    ///
    /// # Errors
    ///
    /// | Error               | Reason                                                         |
    /// |---------------------|----------------------------------------------------------------|
    /// | [`NotFound`]        | beneficiary isn't found                                        |
    /// | [`Forbidden`]       | beneficiary is not allowed (usually means beneficiary is self) |
    /// | [`IllegalArgument`] | if the passed address buffer isn't valid, in memory, etc.      |
    export declare function self_destruct(addr_off: u8, addr_len: u32) : void;

    // #############################################
    // #############################################

    // ###########
    // # Vm #
    // ###########


    /// Abort execution with the given code and message. The code is recorded in the receipt, the
    /// message is for debugging only.
    ///
    /// # Arguments
    ///
    /// - `code` is the [`ExitCode`][fvm_shared::error::ExitCode] to abort with. If this code is
    ///   less than the [minimum "user" exit
    ///   code][fvm_shared::error::ExitCode::FIRST_USER_EXIT_CODE], it will be replaced with
    ///   [`SYS_ILLEGAL_EXIT_CODE`][fvm_shared::error::ExitCode::SYS_ILLEGAL_EXIT_CODE].
    /// - `message_off` and `message_len` specify the offset and length (in wasm memory) of an
    ///   optional debug message associated with this abort. These parameters may be null/0 and will
    ///   be ignored if invalid.
    ///
    /// # Errors
    ///
    /// None. This function doesn't return.
    export declare function abort(code: u32, message_off: u8, message_len: u32):void;
}
