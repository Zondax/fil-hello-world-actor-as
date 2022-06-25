import React, { Component } from "react";
import { Button, Label, List, Message } from "semantic-ui-react";
import { Actor, Instance } from "../lib/types";

interface Props {
  account: any;
  instance: Instance | null;
}

interface State {
  inProgress: boolean;
  errorMessage: string;
  message: string;
}

export class Hello extends Component<Props, any> {
  state: State = {
    message: "",
    inProgress: false,
    errorMessage: "",
  };

  runSayHello = async () => {
    if (!this.props.instance) {
      alert("Create an actor instance first!");
      return;
    }

    const reqBody = {
      address: this.props.account.address,
      key: this.props.account.private_base64,
      id: this.props.instance.id,
    };

    this.setState({ inProgress: true, errorMessage: "" });
    try {
      const result = await fetch(`api/say_hello`, {
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
      else this.setState({ message: parsedBody.message });
    } catch (err: any) {
      this.setState({ errorMessage: err });
    }

    this.setState({ inProgress: false });
  };

  render() {
    return (
      <>
        <Button
          disabled={!this.props.instance}
          loading={this.state.inProgress}
          secondary
          onClick={this.runSayHello}
        >
          Run
        </Button>

        <List style={{ marginTop: "5px" }}>
          <List.Item>
            <Label>
              Message:
              <Label.Detail>{this.state.message || "-"}</Label.Detail>
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
