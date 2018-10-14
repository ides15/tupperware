import React, { Component } from "react";

import { Collapse, Card } from "@blueprintjs/core";
import { Route } from "react-router-dom";
import { Flex } from "reflexbox";

class Info extends Component {
  constructor() {
    super();

    this.state = {
      info: null
    };
  }

  async componentDidMount() {
    const info = await fetch("/api/info");
    this.setState({ info: await info.json() });
  }

  render() {
    const { info } = this.state;

    return (
      <Route
        path="/info"
        render={({ match }) => (
          <Collapse isOpen={match}>
            <Card>
              <h2>Info</h2>
              {info && (
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
              )}
            </Card>
          </Collapse>
        )}
      />
    );
  }
}

export default Info;
