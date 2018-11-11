import React, { Component } from "react";

import styled from "styled-components";
import { Flex } from "reflexbox";
import { Hotkeys, Hotkey, HotkeysTarget } from "@blueprintjs/core";

const Shell = styled(Flex)`
  border-radius: 3px;
  background-color: #182026;
  max-height: 500px;
  overflow-y: auto;
`;

const Log = styled.code`
  color: #e1e8ed;
  font-size: 16px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;

  ${props => `color: ${props.color}`};
`;

class Logs extends Component {
  state = {
    logs: []
  };

  async componentDidMount() {
    this.updateLogs();
  }

  updateLogs = async () => {
    const logs = await fetch(`/api/containers/${this.props.container.Id}/logs`);

    this.setState({ logs: await logs.json() });
  };

  renderHotkeys() {
    return (
      <Hotkeys>
        <Hotkey
          global={true}
          combo="shift + u"
          onKeyDown={() => {
            this.updateLogs();
          }}
        />
      </Hotkeys>
    );
  }

  render() {
    return (
      <>
        {!this.props.container.Image.includes("tupperware") && (
          <Flex w={1} pb={2}>
            <Shell column w={1} p={1}>
              <Log color={"limegreen"}>Update logs with shift + u</Log>
              {this.state.logs.map((log, i) => {
                if (this.state.logs.length <= 1)
                  return <Log key={`log-${i}`}>No logs for this container</Log>;
                return <Log key={`log-${i}`}>{log}</Log>;
              })}
            </Shell>
          </Flex>
        )}
      </>
    );
  }
}

export default HotkeysTarget(Logs);
