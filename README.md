# Filecoin Hello World Actor on AssemblyScript
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GithubActions](https://github.com/Zondax/fil-hello-world-actor-as/actions/workflows/main.yaml/badge.svg)](https://github.com/Zondax/fil-hello-world-actor-as/blob/master/.github/workflows/main.yaml)


This smart contract was built using the FVM SDK for AssemblyScript. Please, go to the [project](https://github.com/Zondax/fvm-as-sdk) in order to know more about it.

# Tests 

### On Lotus node
In order to run it on a lotus node, first you will need to deploy one. 

The following instructions can be used to build this project locally, copy the binary to a pod running on k8s, and run it.

#### Build and connect to pod
```
make deps
make build
kubectl config use-context sandbox
kubectl -n filecoin-node cp build/final-release.wasm <pod-name>:/tmp/fil-actor-hello-world-as.wasm
```

#### To install and execute the actor
```
kubectl exec -it -n <namespace> <pod-name> -- bash
lotus chain install-actor /tmp/fil-actor-hello-world-as.wasm
lotus chain create-actor <actor-id-from-previous-step>
lotus chain invoke <address-id-from-previous-step> 2
```

### On Rust VM

Be sure to have `Cargo` installed.
```
cd testing
cargo r
```

## Docs

### IPFS
- https://medium.com/coinmonks/ipld-hands-on-tutorial-in-golang-15fff6bfe39d
- https://medium.com/hackernoon/understanding-ipfs-in-depth-1-5-a-beginner-to-advanced-guide-e937675a8c8a
- https://medium.com/hackernoon/understanding-ipfs-in-depth-4-6-what-is-multiformats-cf25eef83966

### Related
- https://proto.school/content-addressing
- https://proto.school/merkle-dags
- https://multiformats.io/multihash/
- https://github.com/multiformats/multicodec/blob/master/table.csv

## Other examples

### Rust: Hello world

- https://github.com/raulk/fil-hello-world-actor

### GoLang: Hello world

- https://github.com/ipfs-force-community/go-fvm-sdk

