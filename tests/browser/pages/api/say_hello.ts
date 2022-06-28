// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nc from "next-connect";
import cors from "cors";

import * as cbor from "@ipld/dag-cbor";

// @ts-ignore
import { create, install, say_hello } from "../../lib/index";
import { CID } from "multiformats";

export interface Body {
  id: string;
  address: string;
  key: string;
}

const handler = nc()
  // use connect based middleware
  .use(cors())
  .post<{ body: Body }>(async (req, res) => {
    try {
      const { id, address, key } = req.body;

      const params = cbor.encode([]);
      const sentTx = await say_hello(id, address, key, params);

      if (sentTx.result.Receipt.ExitCode == 0) {
        const respBuffer = Buffer.from(sentTx.result.Receipt.Return, "base64");

        res.statusCode = 200;
        res.end(JSON.stringify({ message: respBuffer.toString() }));
      }
    } catch (err) {
      console.log(err);
    }
  });

export default handler;
