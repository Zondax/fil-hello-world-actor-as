// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nc from "next-connect";
import cors from "cors";

import * as cbor from "@ipld/dag-cbor";

// @ts-ignore
import { create, install } from "../../lib/index";
import { CID } from "multiformats";

export interface Body {
  cid: string;
  address: string;
  key: string;
}

const handler = nc()
  // use connect based middleware
  .use(cors())
  .post<{ body: Body }>(async (req, res) => {
    try {
      const { cid, address, key } = req.body;

      const params = cbor.encode([CID.parse(cid), new Uint8Array(0)]);
      const sentTx = await create(address, key, params);

      let idAddr: any, robustAddr: any;
      if (sentTx.result.ReturnDec) {
        idAddr = sentTx.result.ReturnDec.IDAddress;
        robustAddr = sentTx.result.ReturnDec.RobustAddress;
      } else {
        const respBuffer = Buffer.from(sentTx.result.Receipt.Return, "base64");

        let arrayBuffer = new ArrayBuffer(respBuffer.length);
        let typedArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < respBuffer.length; ++i) {
          typedArray[i] = respBuffer[i];
        }

        [idAddr, robustAddr] = cbor.decode(typedArray);
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ idAddr, robustAddr }));
    } catch (err) {
      console.log(err);
    }
  });

export default handler;
