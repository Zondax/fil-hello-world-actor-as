import { FilecoinRPC, transactionSign, generateMnemonic, keyDerive } from "@zondax/filecoin-signing-tools/js"
import fs from "fs"
import log4js from "log4js"
import path from "path"
import * as cbor from '@ipld/dag-cbor'

jest.setTimeout(60000)

const URL = process.env["NODE_URL"]
const TOKEN = process.env["NODE_TOKEN"]
const SEED = process.env["SEED"]

const WASM_ACTOR = "../../build/release-final.wasm"
const INIT_ACTOR_ADDRESS = "f01"

const logger = log4js.getLogger()
logger.level = process.env["LOG_LEVEL"] || "TRACE"

let actorCid;
let instanceAddress;

test("Install actor", async () => {
    logger.info(`Installing actor [${path.join(__dirname,WASM_ACTOR)}]`)

    const code = fs.readFileSync(path.join(__dirname,WASM_ACTOR))
    logger.trace( "Code loaded")

    const params = cbor.encode([ new Uint8Array(code.buffer) ])
    logger.trace( "Params encoded")

    const seed = SEED || generateMnemonic()
    logger.trace( `Seed: [${seed}]`)

    const keys = keyDerive(seed, "m/44'/461'/0/0/1", "")
    logger.trace( `Address: ${keys.address}`)

    const filRPC = new FilecoinRPC({ url: URL, token: TOKEN })
    const nonce = (await filRPC.getNonce(keys.address)).result
    logger.trace( `Nonce: ${nonce}`)

    let tx = {
        From:   keys.address,
        To: INIT_ACTOR_ADDRESS,
        Value:  "0",
        Method: 3,
        Params: Buffer.from(params).toString('base64'),
        Nonce: nonce,
        GasFeeCap: "0",
        GasPremium: "0",
        GasLimit: 0
    }

    try {
        const fees = (await filRPC.getGasEstimation({...tx}))
        logger.trace(`Fees: ${JSON.stringify(fees)}`)

        expect(fees.result).toBeDefined()
        expect(fees.result.GasFeeCap).toBeDefined()
        expect(fees.result.GasPremium).toBeDefined()
        expect(fees.result.GasLimit).toBeDefined()

        const { GasFeeCap, GasPremium, GasLimit } = fees.result
        tx = {
            ...tx,
            GasFeeCap,
            GasPremium,
            GasLimit
        }
    }catch(err){
        logger.error(`Error fetching fees: ${JSON.stringify(err.response.data)}`)
        expect(err).not.toBeDefined()
        return
    }

    const signedTx = transactionSign(tx, keys.private_base64 )

    const sentTx = await filRPC.sendSignedMessage({Message: tx, Signature: signedTx.Signature} )
    logger.trace( `Sent tx response: ${JSON.stringify(sentTx)}`)

    expect(sentTx.result).toBeDefined()
    expect(sentTx.result.Receipt).toBeDefined()
    expect(sentTx.result.Receipt.ExitCode).toBe(0)

    if(sentTx.result.Receipt.ExitCode == 0){
        const respBuffer = Buffer.from(sentTx.result.Receipt.Return, "base64")

        let arrayBuffer = new ArrayBuffer(respBuffer.length);
        let typedArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < respBuffer.length; ++i) {
            typedArray[i] = respBuffer[i];
        }

        const [cid, isInstalled] = cbor.decode(typedArray)

        expect(cid).toBeDefined()
        expect(isInstalled).toBeDefined()

        logger.info(`CID: ${cid.toString()}`)
        logger.info(`Is installed: ${isInstalled}`)
        actorCid = cid
    }
})

test("Create actor", async () => {
    if(!actorCid) return

    logger.info(`Instantiating actor [${actorCid.toString()}]`)

    const params = cbor.encode([ actorCid, new Uint8Array(0) ])
    logger.trace( "Params encoded")

    const seed = SEED || generateMnemonic()
    logger.trace( `Seed: [${seed}]`)

    const keys = keyDerive(seed, "m/44'/461'/0/0/1", "")
    logger.trace( `Address: ${keys.address}`)

    const filRPC = new FilecoinRPC({ url: URL, token: TOKEN })
    const nonce = (await filRPC.getNonce(keys.address)).result
    logger.trace( `Nonce: ${nonce}`)

    let tx = {
        From:   keys.address,
        To: INIT_ACTOR_ADDRESS,
        Value:  "0",
        Method: 2,
        Params: Buffer.from(params).toString('base64'),
        Nonce: nonce,
        GasFeeCap: "0",
        GasPremium: "0",
        GasLimit: 0
    }

    try {
        const fees = (await filRPC.getGasEstimation({...tx}))
        logger.trace(`Fees: ${JSON.stringify(fees)}`)

        expect(fees.result).toBeDefined()
        expect(fees.result.GasFeeCap).toBeDefined()
        expect(fees.result.GasPremium).toBeDefined()
        expect(fees.result.GasLimit).toBeDefined()

        const { GasFeeCap, GasPremium, GasLimit } = fees.result
        tx = {
            ...tx,
            GasFeeCap,
            GasPremium,
            GasLimit
        }
    }catch(err){
        logger.error(`Error fetching fees: ${JSON.stringify(err.response.data)}`)
        expect(err).not.toBeDefined()
        return
    }

    const signedTx = transactionSign(tx, keys.private_base64 )

    const sentTx = await filRPC.sendSignedMessage({Message: tx, Signature: signedTx.Signature} )
    logger.trace( `Sent tx response: ${JSON.stringify(sentTx)}`)

    expect(sentTx.result).toBeDefined()
    expect(sentTx.result.Receipt).toBeDefined()
    expect(sentTx.result.Receipt.ExitCode).toBe(0)

    if(sentTx.result.Receipt.ExitCode == 0){

        let idAddr, robustAddr;
        if( sentTx.result.ReturnDec){
            idAddr = sentTx.result.ReturnDec.IDAddress
            robustAddr = sentTx.result.ReturnDec.RobustAddress
        } else {
            const respBuffer = Buffer.from(sentTx.result.Receipt.Return, "base64")

            let arrayBuffer = new ArrayBuffer(respBuffer.length);
            let typedArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < respBuffer.length; ++i) {
                typedArray[i] = respBuffer[i];
            }

            ([idAddr, robustAddr] = cbor.decode(typedArray))
        }

        expect(idAddr).toBeDefined()
        expect(robustAddr).toBeDefined()

        logger.info(`ID Address: ${idAddr.toString()}`)
        logger.info(`Robust address: ${robustAddr.toString()}`)

        instanceAddress = idAddr.toString()
    }
})

test("Invoke method 2", async () => {
    if(!instanceAddress) return

    logger.info(`Invoking method 2 from instance [${instanceAddress.toString()}]`)

    const params = cbor.encode([ ])
    logger.trace( "Params encoded")

    const seed = SEED || generateMnemonic()
    logger.trace( `Seed: [${seed}]`)

    const keys = keyDerive(seed, "m/44'/461'/0/0/1", "")
    logger.trace( `Address: ${keys.address}`)

    const filRPC = new FilecoinRPC({ url: URL, token: TOKEN })
    const nonce = (await filRPC.getNonce(keys.address)).result
    logger.trace( `Nonce: ${nonce}`)
    /*
    let tx = {
        From:   keys.address,
        To: INIT_ACTOR_ADDRESS,
        Value:  "0",
        Method: 2,
        Params: Buffer.from(params).toString('base64'),
        Nonce: nonce,
        GasFeeCap: "0",
        GasPremium: "0",
        GasLimit: 0
    }

    try {
        const fees = (await filRPC.getGasEstimation({...tx}))
        logger.trace(`Fees: ${JSON.stringify(fees)}`)

        expect(fees.result).toBeDefined()
        expect(fees.result.GasFeeCap).toBeDefined()
        expect(fees.result.GasPremium).toBeDefined()
        expect(fees.result.GasLimit).toBeDefined()

        const { GasFeeCap, GasPremium, GasLimit } = fees.result
        tx = {
            ...tx,
            GasFeeCap,
            GasPremium,
            GasLimit
        }
    }catch(err){
        logger.error(`Error fetching fees: ${JSON.stringify(err.response.data)}`)
        expect(err).not.toBeDefined()
        return
    }

    const signedTx = transactionSign(tx, keys.private_base64 )

    const sentTx = await filRPC.sendSignedMessage({Message: tx, Signature: signedTx.Signature} )
    logger.trace( `Sent tx response: ${JSON.stringify(sentTx)}`)

    expect(sentTx.result).toBeDefined()
    expect(sentTx.result.Receipt).toBeDefined()
    expect(sentTx.result.Receipt.ExitCode).toBe(0)

    if(sentTx.result.Receipt.ExitCode == 0){

        let idAddr, robustAddr;
        if( sentTx.result.ReturnDec){
            idAddr = sentTx.result.ReturnDec.IDAddress
            robustAddr = sentTx.result.ReturnDec.RobustAddress
        } else {
            const respBuffer = Buffer.from(sentTx.result.Receipt.Return, "base64")

            let arrayBuffer = new ArrayBuffer(respBuffer.length);
            let typedArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < respBuffer.length; ++i) {
                typedArray[i] = respBuffer[i];
            }

            ([idAddr, robustAddr] = cbor.decode(typedArray))
        }

        expect(idAddr).toBeDefined()
        expect(robustAddr).toBeDefined()

        logger.info(`ID Address: ${idAddr.toString()}`)
        logger.info(`Robust address: ${robustAddr.toString()}`)

        instanceAddres = idAddr.toString()
    }
    */
})
