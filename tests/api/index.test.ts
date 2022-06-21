import { FilecoinRPC, transactionSign, generateMnemonic, keyDerive } from "@zondax/filecoin-signing-tools/js"
import fs from "fs"
import log4js from "log4js"
import path from "path"
import * as cbor from '@ipld/dag-cbor'

jest.setTimeout(60000)

const WASM_ACTOR = "../build/release-final.wasm"
const URL = "http://127.0.0.1:58080/rpc/v0"
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.OqMuzGRLfI97giJdk8HaxvWx0XKJdBP2XTm1addpgWo"
const INIT_ACTOR_ADDRESS = "f01"
const SEED = "when pepper bicycle beef jacket subject document obey lyrics flee tomorrow inspire public broccoli gym small attack trophy cycle wrestle electric approve inflict pull"

const logger = log4js.getLogger()
logger.level = "TRACE"

test("Install actor", async () => {
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
        expect(err).not.toBeDefined()
        logger.error(`Error fetching fees: ${JSON.stringify(err.response.data)}`)
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
    }
})
