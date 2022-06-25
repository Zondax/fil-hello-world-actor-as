// @ts-ignore
import { FilecoinRPC, transactionSign } from "@zondax/filecoin-signing-tools/js"
import * as cbor from "@ipld/dag-cbor";

const URL = process.env["NODE_URL"]
const TOKEN = process.env["NODE_TOKEN"]

const INIT_ACTOR_ADDRESS = "f01"
const INIT_ACTOR_INSTALL_METHOD = 3
const INIT_ACTOR_CREATE_METHOD = 2

const logger = {
    trace: (msg:string) =>{
        console.log(msg)
    },debug: (msg:string) =>{
        console.log(msg)
    },info: (msg:string) =>{
        console.log(msg)
    },error: (msg:string) =>{
        console.log(msg)
    }
}

export const install = async (address: string, priv_key: string, params: Uint8Array) => {
    console.log(URL)
    console.log(TOKEN)
    const filRPC = new FilecoinRPC({ url: URL, token: TOKEN })
    const nonce = (await filRPC.getNonce(address)).result
    logger.trace( `Nonce: ${nonce}`)

    let tx = {
        From:  address,
        To: INIT_ACTOR_ADDRESS,
        Value:  "0",
        Method: INIT_ACTOR_INSTALL_METHOD,
        Params: Buffer.from(params).toString('base64'),
        Nonce: nonce,
        GasFeeCap: "0",
        GasPremium: "0",
        GasLimit: 0
    }

    const fees = (await filRPC.getGasEstimation({...tx}))
    logger.trace(`Fees: ${JSON.stringify(fees)}`)

    if( fees && fees.error ) throw new Error( `error code ${fees.error.code } - ${fees.error.message}` )

    const { GasFeeCap, GasPremium, GasLimit } = fees.result
    tx = {
        ...tx,
        GasFeeCap,
        GasPremium,
        GasLimit
    }

    const signedTx = transactionSign(tx, priv_key )

    const sentTx = await filRPC.sendSignedMessage({Message: tx, Signature: signedTx.Signature} )
    logger.trace( `Sent tx response: ${JSON.stringify(sentTx)}`)

    return sentTx
}

export const create = async (address: string, priv_key: string, params: Uint8Array ) => {
    const filRPC = new FilecoinRPC({ url: URL, token: TOKEN })
    const nonce = (await filRPC.getNonce(address)).result
    logger.trace( `Nonce: ${nonce}`)

    let tx = {
        From:   address,
        To: INIT_ACTOR_ADDRESS,
        Value:  "0",
        Method: INIT_ACTOR_CREATE_METHOD,
        Params: Buffer.from(params).toString('base64'),
        Nonce: nonce,
        GasFeeCap: "0",
        GasPremium: "0",
        GasLimit: 0
    }

    try {
        const fees = (await filRPC.getGasEstimation({...tx}))
        logger.trace(`Fees: ${JSON.stringify(fees)}`)

        const { GasFeeCap, GasPremium, GasLimit } = fees.result
        tx = {
            ...tx,
            GasFeeCap,
            GasPremium,
            GasLimit
        }
    }catch(err){
        logger.error(`Error fetching fees: ${JSON.stringify(err.response.data)}`)
        return
    }

    const signedTx = transactionSign(tx, priv_key )

    const sentTx = await filRPC.sendSignedMessage({Message: tx, Signature: signedTx.Signature} )
    logger.trace( `Sent tx response: ${JSON.stringify(sentTx)}`)

    return sentTx
}

export const say_hello = async (to: string, from: string, priv_key: string, params: Uint8Array ) => {
    const filRPC = new FilecoinRPC({ url: URL, token: TOKEN })
    const nonce = (await filRPC.getNonce(from)).result
    logger.trace( `Nonce: ${nonce}`)

    let tx = {
        From:   from,
        To: to,
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

        const { GasFeeCap, GasPremium, GasLimit } = fees.result
        tx = {
            ...tx,
            GasFeeCap,
            GasPremium,
            GasLimit
        }
    }catch(err){
        logger.error(`Error fetching fees: ${JSON.stringify(err.response.data)}`)
        return
    }

    const signedTx = transactionSign(tx, priv_key )

    const sentTx = await filRPC.sendSignedMessage({Message: tx, Signature: signedTx.Signature} )
    logger.trace( `Sent tx response: ${JSON.stringify(sentTx)}`)

    return sentTx
}
