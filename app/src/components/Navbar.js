import React from "react";

import {
  Navbar as Nav,
  NavbarGroup,
  Alignment,
  NavbarHeading,
  ButtonGroup,
  Button
} from "@blueprintjs/core";
import { Flex } from "reflexbox";
import styled from "styled-components";

import APIButton from "./APIButton";

const Container = styled.div`
  max-width: 1750px;
  width: 100%;
  margin: auto;
`;

const Navbar = ({ darkTheme, toggleDarkTheme }) => {
  return (
    <Nav>
      <Container>
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
            <Button minimal onClick={() => toggleDarkTheme()}>
              <b>shift + d</b>
            </Button>
          </Flex>
        </NavbarGroup>
      </Container>
    </Nav>
  );
};

export default Navbar;
