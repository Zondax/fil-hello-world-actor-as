// @ts-ignore
import { generateMnemonic, keyDerive } from "@zondax/filecoin-signing-tools/js";
import React, { Component } from "react";
import { Container, Divider, Segment, Header, Grid } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import { Actor, Instance } from "../lib/types";
import { Install } from "../components/Install";
import { ChooseFile } from "../components/ChooseFile";
import { Create } from "../components/Create";
import { Hello } from "../components/Hello";
import { Account } from "../components/Account";

const SEED = process.env["NEXT_PUBLIC_SEED"];
const PATH = "m/44'/461'/0/0/1";

interface State {
  file: File | null;
  actor: Actor | null;
  instance: Instance | null;
  account: any;
  seed: any;
}

export default class Home extends Component {
  fileInputRef = React.createRef<HTMLInputElement>();
  state: State = {
    file: null,
    actor: null,
    instance: null,
    seed: null,
    account: null,
  };

  componentDidMount() {
    const seed = SEED || generateMnemonic();
    this.setState({
      seed,
      account: keyDerive(seed, "m/44'/461'/0/0/1", ""),
    });
  }

  render() {
    return (
      <Container style={{ overflowWrap: "break-word" }}>
        <h1>Filecoin Hello World Web</h1>
        <h3>
          You can install the actor, create a new instance and call its methods
        </h3>

        <Segment compact>
          <Header as="h3">User Data</Header>
          <Account
            account={this.state.account}
            seed={this.state.seed}
            derivationPath={PATH}
          />

          <Divider section />

          <Header as="h3">Install</Header>

          <Grid columns={1} relaxed="very">
            <Grid.Row>
              <Grid.Column>
                <ChooseFile
                  fileInputRef={this.fileInputRef}
                  file={this.state.file}
                  setFile={(file: File) => {
                    this.setState({ file });
                  }}
                ></ChooseFile>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Install
                  file={this.state.file}
                  account={this.state.account}
                  actor={this.state.actor}
                  setActor={(actor: Actor) => {
                    this.setState({ actor });
                  }}
                ></Install>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Divider section />

          <Header as="h3">Create</Header>
          <Create
            actor={this.state.actor}
            account={this.state.account}
            instance={this.state.instance}
            setInstance={(instance: Instance) => this.setState({ instance })}
          />
          <Divider section />

          <Header as="h3">Say Hello</Header>
          <Hello account={this.state.account} instance={this.state.instance} />
        </Segment>
      </Container>
    );
  }
}
