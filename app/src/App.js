import React, { Component } from "react";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import {
  Navbar,
  NavbarGroup,
  Alignment,
  NavbarHeading,
  Card,
  ButtonGroup,
  Hotkey,
  HotkeysTarget,
  Hotkeys
} from "@blueprintjs/core";

import APIButton from "./components/APIButton";
import Info from "./components/pages/Info";
import Containers from "./components/pages/Containers";
import Images from "./components/pages/Images";
import Networks from "./components/pages/Networks";
import Volumes from "./components/pages/Volumes";

const DarkContainer = styled(Card)`
  height: 100%;
  padding: 0;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
`;

class App extends Component {
  state = {
    dark: false
  };

  componentDidMount() {
    const dark = localStorage.getItem("dark");

    if (dark === "true") {
      this.setState({
        dark: true
      });
    }
  }

  renderHotkeys() {
    return (
      <Hotkeys>
        <Hotkey
          global={true}
          combo="shift + d"
          onKeyDown={() => {
            this.setState(
              prevState => ({
                dark: !prevState.dark
              }),
              () => {
                localStorage.setItem("dark", this.state.dark);
              }
            );
          }}
        />
      </Hotkeys>
    );
  }

  render() {
    return (
      <DarkContainer className={this.state.dark && "bp3-dark"}>
        <Router>
          <Flex column>
            <Route
              exact
              path="/"
              render={() => <Redirect to="/containers" />}
            />
            <Box>
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
                    <APIButton
                      route="/images"
                      icon="application"
                      intent="danger"
                    >
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
                <NavbarGroup align={Alignment.RIGHT}>
                  <Flex align="center">
                    <b>shift + d</b>
                  </Flex>
                </NavbarGroup>
              </Navbar>
            </Box>
            <Info />
            <Containers />
            <Images />
            <Networks />
            <Volumes />
          </Flex>
        </Router>
      </DarkContainer>
    );
  }
}

export default HotkeysTarget(App);
