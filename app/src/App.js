import React from "react";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Card,
  ButtonGroup
} from "@blueprintjs/core";

import APIButton from "./components/APIButton";
import Info from "./components/pages/Info";
import Containers from "./components/pages/Containers";
import Images from "./components/pages/Images";
import Networks from "./components/pages/Networks";
import Volumes from "./components/pages/Volumes";

const DarkContainer = styled(Card)`
  padding: 0;
`;

const App = () => {
  return (
    <Router>
      <Flex column>
        <Route exact path="/" render={() => <Redirect to="/containers" />} />
        <Box>
          <DarkContainer>
            <Navbar>
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
                  <APIButton
                    route="/networks"
                    icon="globe-network"
                    intent="success"
                  >
                    Networks
                  </APIButton>
                  <APIButton route="/volumes" icon="database">
                    Volumes
                  </APIButton>
                </ButtonGroup>
              </NavbarGroup>
            </Navbar>
          </DarkContainer>
        </Box>
        <Info />
        <Containers />
        <Images />
        <Networks />
        <Volumes />
      </Flex>
    </Router>
  );
};

export default App;
