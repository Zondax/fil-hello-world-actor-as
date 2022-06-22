// @ts-ignore
import { generateMnemonic, keyDerive } from "@zondax/filecoin-signing-tools/js"
import React, {Component} from 'react'
import { List, Container, Button, Label, Divider, Segment, Header, Loader, Grid } from 'semantic-ui-react'

import * as cbor from '@ipld/dag-cbor'

import 'semantic-ui-css/semantic.min.css'
import {base64ArrayBuffer} from "../lib/base64";

const SEED = process.env["NEXT_PUBLIC_SEED"]
const PATH = "m/44'/461'/0/0/1"

interface State{
    actorFile:  File | null
    actorCid:  string | null
    installing: boolean
    wasInstalled:  boolean | null
    instanceID:  string | null
    instanceRobust:  string | null
    creating: boolean
    seed: any
    key: any
    message: string | null,
    sendingHello: boolean
}

export default class Home extends Component{
    fileInputRef = React.createRef<HTMLInputElement>()
    state: State = {
        actorFile: null,
        actorCid: null,
        installing: false,
        wasInstalled: null,
        instanceID: null,
        instanceRobust: null,
        creating: false,
        seed: null,
        key: null,
        message: null,
        sendingHello: false,
    }

    componentDidMount() {
        const seed = SEED || generateMnemonic()
        this.setState({
            seed,
            key: keyDerive(seed, "m/44'/461'/0/0/1", "")})
    }

    installActor = async () => {
        if(!this.state.actorFile) {
            alert("Choose a file first!")
            return
        }

        let fileArrayBuff:any = await new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = (e) => resolve(fileReader.result);
            fileReader.readAsArrayBuffer(this.state.actorFile as Blob);
        });

        const reqBody = {
            address: this.state.key.address,
            key: this.state.key.private_base64,
            code: base64ArrayBuffer(fileArrayBuff)
        }

        this.setState({installing: true})
        const result = await fetch(`api/install`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(reqBody)
        })

        const parsedBody = await result.json()
        this.setState({actorCid: parsedBody.cid, wasInstalled: parsedBody.installed, installing: false})
    }

    createActor = async () => {
        if (!this.state.actorCid) {
            alert("Install an actor first!")
            return
        }

        const reqBody = {
            address: this.state.key.address,
            key: this.state.key.private_base64,
            cid: this.state.actorCid
        }

        this.setState({creating: true})
        const result = await fetch(`api/create`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(reqBody)
        })

        const parsedBody = await result.json()
        this.setState({instanceID: parsedBody.idAddr, instanceRobust: parsedBody.robustAddr, creating: false})
    }

    runSayHello = async () => {
        if (!this.state.instanceID) {
            alert("Create an actor instance first!")
            return
        }

        const reqBody = {
            address: this.state.key.address,
            key: this.state.key.private_base64,
            id: this.state.instanceID
        }

        this.setState({sendingHello: true})
        const result = await fetch(`api/say_hello`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(reqBody)
        })

        const parsedBody = await result.json()
        this.setState({message: parsedBody.message, sendingHello: false})
    }

    fileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const files = e.target.files
        if( files ) this.setState({actorFile: files[0]})
    }

    render() {
        return (
            <Container>
                <h1>Filecoin Hello World Web</h1>
                <h3>You can install the actor, create a new instance and call its methods</h3>

                <Segment>
                    <Header as='h3'>User Data</Header>
                    <List>
                        <List.Item>
                        <Label>
                            Seed:
                            <Label.Detail>{this.state.seed}</Label.Detail>
                        </Label>
                            </List.Item>
                        <List.Item>
                        <Label>
                            Path:
                            <Label.Detail>{PATH}</Label.Detail>
                        </Label>
                        </List.Item>
                            <List.Item>
                        <Label>
                            Address:
                            <Label.Detail>{this.state.key ? this.state.key.address : ""}</Label.Detail>
                        </Label>
                            </List.Item>
                    </List>

                    <Divider section />

                    <Header as='h3'>Install</Header>

                    <Grid columns={2} relaxed='very'>
                        <Grid.Column>
                            <Container>
                                <input
                                    ref={this.fileInputRef}
                                    type="file"
                                    hidden
                                    onChange={this.fileChange}
                                />
                                <Button
                                    secondary
                                    content="Choose File"
                                    labelPosition="left"
                                    icon="file"
                                    onClick={() => this.fileInputRef.current ? this.fileInputRef.current.click() : undefined}
                                />
                            </Container>
                            <Container>
                                <Label style={{marginTop: "5px"}}>
                                    FileName:
                                    <Label.Detail>{this.state.actorFile ? this.state.actorFile.name : "-"}</Label.Detail>
                                </Label>
                            </Container>
                        </Grid.Column>
                        <Grid.Column>
                            <Button disabled={!this.state.actorFile} primary onClick={this.installActor}>Run</Button>
                            {this.state.installing ? <Loader active inline /> : null}
                                <List style={{marginTop: "5px"}}>
                                    <List.Item>
                                <Label>
                                    Actor CID:
                                    <Label.Detail>{this.state.actorCid || "-"}</Label.Detail>
                                </Label>
                                        </List.Item>
                                    <List.Item>
                                <Label>
                                    Installed:
                                    <Label.Detail>{this.state.wasInstalled !== null ? this.state.wasInstalled.toString() : "-"}</Label.Detail>
                                </Label>
                                        </List.Item>
                                    </List>
                        </Grid.Column>
                    </Grid>

                    <Divider section />

                    <Header as='h3'>Create</Header>
                    <Button disabled={!this.state.actorCid} secondary onClick={this.createActor}>Run</Button>
                    {this.state.creating ? <Loader active inline /> : null}

                    <List style={{marginTop: "5px"}}>
                        <List.Item>
                        <Label>
                            Instance ID:
                            <Label.Detail>{this.state.instanceID || "-"}</Label.Detail>
                        </Label>
                            </List.Item>
                                <List.Item>
                        <Label>
                            Instance Robust ID:
                            <Label.Detail>{this.state.instanceRobust || "-"}</Label.Detail>
                        </Label>
                                    </List.Item>
                    </List>


                    <Divider section />

                    <Header as='h3'>Say Hello</Header>
                    <Button disabled={!this.state.instanceID} secondary onClick={this.runSayHello}>Run</Button>
                    {this.state.sendingHello ? <Loader active inline /> : null}

                    <List style={{marginTop: "5px"}}>
                        <List.Item>
                        <Label>
                            Message:
                            <Label.Detail>{this.state.message || "-"}</Label.Detail>
                        </Label>
                            </List.Item>
                    </List>

                </Segment>
            </Container>
        )
    }
}
