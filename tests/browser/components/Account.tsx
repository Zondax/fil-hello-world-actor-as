import React, { Component } from "react";
import { Label, List } from "semantic-ui-react";

interface Props {
  account: any;
  seed: string;
  derivationPath: string;
}

export class Account extends Component<Props, any> {
  render() {
    return (
      <List>
        <List.Item>
          <Label>
            Seed:
            <Label.Detail>{this.props.seed}</Label.Detail>
          </Label>
        </List.Item>
        <List.Item>
          <Label>
            Path:
            <Label.Detail>{this.props.derivationPath}</Label.Detail>
          </Label>
        </List.Item>
        <List.Item>
          <Label>
            Address:
            <Label.Detail>
              {this.props.account ? this.props.account.address : ""}
            </Label.Detail>
          </Label>
        </List.Item>
        <List.Item>
          <Label>
            KeyFile (to add account in Lotus):
            <Label.Detail>
              {this.props.account
                ? Buffer.from(
                    `{"Type":"secp256k1","PrivateKey":"${this.props.account.private_base64}"}`
                  ).toString("hex")
                : ""}
            </Label.Detail>
          </Label>
        </List.Item>
      </List>
    );
  }
}
