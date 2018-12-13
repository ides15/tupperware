import React, { Component } from "react";

import { Collapse } from "@blueprintjs/core";
import { Route } from "react-router-dom";
import { Box } from "reflexbox";
import styled from "styled-components";

const Title = styled.h2`
  margin: 0;
`;

class Info extends Component {
  state = {
    info: null
  };

  async componentDidMount() {
    const info = await fetch("/api/info");
    this.setState({ info: await info.json() });
  }

  render() {
    // const { info } = this.state;

    return (
      <Route
        path="/info"
        render={({ match }) => (
          <Collapse isOpen={match}>
            <Box p={2}>
              <Title>Info</Title>
              {/* {info && (
                <Flex column>
                  <Flex>
                    Name
                    {info.Name}
                  </Flex>
                  <Flex>
                    Operating System
                    {info.OSType}, {info.OperatingSystem}
                  </Flex>
                </Flex>
              )} */}
            </Box>
          </Collapse>
        )}
      />
    );
  }
}

export default Info;
