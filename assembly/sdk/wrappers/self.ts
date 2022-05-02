import {Cid} from "../env";
import {self} from "../env/sys/self";
import set_root = self.set_root;

export function setRoot(id: Cid): void {
    const dataPtr = changetype<usize>(id.raw)

    // TODO Check if ipld.create func ran successfully
    set_root(dataPtr)
}
