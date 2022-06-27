import React, { Component } from "react";
import { Button, Label, List, Message } from "semantic-ui-react";
import { base64ArrayBuffer } from "../lib/base64";
import { Actor } from "../lib/types";

interface State {
  inProgress: boolean;
  errorMessage: string;
}

interface Props {
  file: File | null;
  account: any;
  actor: Actor | null;
  setActor: (actor: Actor) => void;
}

export class Install extends Component<Props> {
  state: State = {
    inProgress: false,
    errorMessage: "",
  };

  installActor = async () => {
    if (!this.props.file) {
      alert("Choose a file first!");
      return;
    }

    let fileArrayBuff: any = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsArrayBuffer(this.props.file as Blob);
    });

    const reqBody = {
      address: this.props.account.address,
      key: this.props.account.private_base64,
      code: base64ArrayBuffer(fileArrayBuff),
    };

    this.setState({ inProgress: true, errorMessage: "" });
    try {
      const result = await fetch(`api/install`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(reqBody),
      });

      const parsedBody = await result.json();

      if (parsedBody.errorMessage)
        this.setState({ errorMessage: parsedBody.errorMessage });
      else {
        const actor = {
          cid: parsedBody.cid,
          wasInstalled: parsedBody.installed,
        };

        this.setState(actor);
        this.props.setActor(actor);
      }
    } catch (err: any) {
      this.setState({ errorMessage: err });
    }

    this.setState({ inProgress: false });
  };

  render() {
    return (
      <>
        <Button
          disabled={!this.props.file}
          loading={this.state.inProgress}
          onClick={this.installActor}
          secondary
        >
          Run
        </Button>

        <List style={{ marginTop: "5px" }}>
          <List.Item>
            <Label>
              Actor CID:
              <Label.Detail>
                {this.props.actor ? this.props.actor.cid : "-"}
              </Label.Detail>
            </Label>
          </List.Item>
          <List.Item>
            <Label>
              Installed:
              <Label.Detail>
                {this.props.actor
                  ? this.props.actor.wasInstalled.toString()
                  : "-"}
              </Label.Detail>
            </Label>
          </List.Item>
        </List>

        <Message hidden={this.state.errorMessage == ""} error>
          <Message.Header>Oops!</Message.Header>
          {this.state.errorMessage}
        </Message>
      </>
    );
  }
}
