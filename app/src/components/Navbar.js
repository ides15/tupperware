import React from "react";

import {
  Navbar as Nav,
  NavbarGroup,
  Alignment,
  NavbarHeading,
  ButtonGroup
} from "@blueprintjs/core";
import { Flex } from "reflexbox";

import APIButton from "./APIButton";

const Navbar = () => {
  return (
    <Nav>
      <NavbarGroup>
        <NavbarHeading>Tupperware</NavbarHeading>
        <ButtonGroup>
          <APIButton route="/info" icon="info-sign" intent="primary">
            Info
          </APIButton>
          <APIButton route="/containers" icon="box" intent="warning">
            Containers
          </APIButton>
          <APIButton route="/images" icon="application" intent="danger">
            Images
          </APIButton>
          <APIButton route="/networks" icon="globe-network" intent="success">
            Networks
          </APIButton>
          <APIButton route="/volumes" icon="database">
            Volumes
          </APIButton>
        </ButtonGroup>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Flex align="center">
          <b>shift + d</b>
        </Flex>
      </NavbarGroup>
    </Nav>
  );
};

export default Navbar;
