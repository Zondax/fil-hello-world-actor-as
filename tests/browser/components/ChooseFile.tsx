import React, { Component, RefObject } from "react";
import { Button, Container, Label } from "semantic-ui-react";

interface Props {
  file: File | null;
  fileInputRef: RefObject<HTMLInputElement>;
  setFile: (file: File) => void;
}

export class ChooseFile extends Component<Props, any> {
  fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files) this.props.setFile(files[0]);
  };

  render() {
    return (
      <>
        <Container>
          <input
            ref={this.props.fileInputRef}
            type="file"
            hidden
            onChange={this.fileChange}
          />
          <Button
            secondary
            content="Choose File"
            labelPosition="left"
            icon="file"
            onClick={() =>
              this.props.fileInputRef.current
                ? this.props.fileInputRef.current.click()
                : undefined
            }
          />
        </Container>
        <Container>
          <Label style={{ marginTop: "5px" }}>
            FileName:
            <Label.Detail>
              {this.props.file ? this.props.file.name : "-"}
            </Label.Detail>
          </Label>
        </Container>
      </>
    );
  }
}
