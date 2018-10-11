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
        <Route exact path="/" render={() => <Redirect to="/info" />} />
        <Box>
          <DarkContainer>
            <Navbar>
              <NavbarGroup>
                <NavbarHeading>Tupperware</NavbarHeading>
              </NavbarGroup>
            </Navbar>
          </DarkContainer>
        </Box>
        <Box>
          <Box w={1} p={2}>
            <ButtonGroup>
              <APIButton route="/info" intent="primary">
                Info
              </APIButton>
              <APIButton route="/containers" intent="warning">
                Containers
              </APIButton>
              <APIButton route="/images" intent="danger">
                Images
              </APIButton>
              <APIButton route="/networks" intent="success">
                Networks
              </APIButton>
              <APIButton route="/volumes">Volumes</APIButton>
            </ButtonGroup>
            <Box mt={2}>
              <Info />
              <Containers />
              <Images />
              <Networks />
              <Volumes />
            </Box>
          </Box>
        </Box>
      </Flex>
    </Router>
  );
};

export default App;
