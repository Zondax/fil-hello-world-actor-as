# fil-hello-world-actor-as

### FVM Syscall bindings

https://github.com/filecoin-project/ref-fvm/blob/8799f1d94b2976445e19b1032ab1c8adc26671b4/fvm/src/syscalls/mod.rs#L101-L184

### SDK Syscall definitions

https://github.com/filecoin-project/ref-fvm/tree/7aee08fc0eb6fd1b2b41b7ef99ebfc8be64c96c6/sdk/src/sys

### To test it:

Build and connect to pod:
```
yarn asbuild
kubectl config use-context sandbox
kubectl -n filecoin-node cp build/release.wasm filecoin-node-devnet-experimental-fvm-584784c8f5-hq9xz:/tmp/fil-actor-hello-world-as.wasm
```

To install and execute the actor:
```
kubectl exec -it -n filecoin-node filecoin-node-devnet-experimental-fvm-584784c8f5-hq9xz -- bash
lotus chain install-actor /tmp/fil-actor-hello-world-as.wasm
lotus chain create-actor <actor-id-from-previous-step>
```
