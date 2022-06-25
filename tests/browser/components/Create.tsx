import React, { Component } from "react";
import { Button, Label, List, Message } from "semantic-ui-react";
import { Actor, Instance } from "../lib/types";

interface Props {
  actor: Actor | null;
  account: any;
  instance: Instance | null;
  setInstance: (inst: Instance) => void;
}

interface State {
  inProgress: boolean;
  errorMessage: string;
}

export class Create extends Component<Props, any> {
  state: State = {
    inProgress: false,
    errorMessage: "",
  };

  createActor = async () => {
    if (!this.props.actor) {
      alert("Install an actor first!");
      return;
    }

    const reqBody = {
      address: this.props.account.address,
      key: this.props.account.private_base64,
      cid: this.props.actor.cid,
    };

    this.setState({ inProgress: true, errorMessage: "" });
    try {
      const result = await fetch(`api/create`, {
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
      else
        this.props.setInstance({
          id: parsedBody.idAddr,
          robustAddress: parsedBody.robustAddr,
        });
    } catch (err: any) {
      this.setState({ errorMessage: err });
    }

    this.setState({
      inProgress: false,
    });
  };

  render() {
    return (
      <>
        <Button
          disabled={!this.props.actor}
          loading={this.state.inProgress}
          secondary
          onClick={this.createActor}
        >
          Run
        </Button>
        <List style={{ marginTop: "5px" }}>
          <List.Item>
            <Label>
              Instance ID:
              <Label.Detail>
                {this.props.instance ? this.props.instance.id : "-"}
              </Label.Detail>
            </Label>
          </List.Item>
          <List.Item>
            <Label>
              Instance Robust ID:
              <Label.Detail>
                {this.props.instance ? this.props.instance.robustAddress : "-"}
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
