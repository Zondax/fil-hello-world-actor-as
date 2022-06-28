// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nc from "next-connect";
import cors from "cors";

import * as cbor from "@ipld/dag-cbor";

// @ts-ignore
import { install } from "../../lib/index";

export interface Body {
  code: string;
  address: string;
  key: string;
}

const handler = nc()
  // use connect based middleware
  .use(cors())
  .post<{ body: Body }>(async (req, res) => {
    try {
      const { code, address, key } = req.body;

      const params = cbor.encode([
        new Uint8Array(Buffer.from(code, "base64").buffer),
      ]);
      const sentTx = await install(address, key, params);

      if (sentTx.result.Receipt.ExitCode == 0) {
        const respBuffer = Buffer.from(sentTx.result.Receipt.Return, "base64");

        let arrayBuffer = new ArrayBuffer(respBuffer.length);
        let typedArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < respBuffer.length; ++i) {
          typedArray[i] = respBuffer[i];
        }

        const [cid, isInstalled] = cbor.decode(typedArray);

        res.statusCode = 200;
        res.end(
          JSON.stringify({ cid: cid.toString(), installed: isInstalled })
        );
      }
    } catch (err: any) {
      res.statusCode = 400;
      res.end(JSON.stringify({ errorMessage: err.toString() }));
    }
  });

export default handler;
