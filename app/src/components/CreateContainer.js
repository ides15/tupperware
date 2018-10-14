import React, { Component } from "react";

import { Flex } from "reflexbox";
import { Dialog, FormGroup, InputGroup } from "@blueprintjs/core";

class CreateContainer extends Component {
  state = {
    images: []
  };

  async componentDidMount() {
    let images = await fetch("/api/images");
    images = await images.json();

    this.setState({ images });
  }

  render() {
    const { isOpen, setCreateContainerIsOpen } = this.props;

    return (
      <Dialog
        title="Create Container"
        isOpen={isOpen}
        onClose={() => setCreateContainerIsOpen(false)}
      >
        <Flex p={2} column>
          <FormGroup
            inline
            label="Name"
            labelFor="container-name"
            labelInfo="(required)"
          >
            <InputGroup id="container-name" placeholder="Name" />
          </FormGroup>
          <FormGroup
            inline
            label="Image"
            labelFor="container-image"
            labelInfo="(required)"
          >
            <InputGroup id="container-image" placeholder="Image" />
          </FormGroup>
        </Flex>
      </Dialog>
    );
  }
}

export default CreateContainer;
