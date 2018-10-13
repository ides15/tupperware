import React, { Component } from "react";

import styled from "styled-components";
import {
  Collapse,
  Card,
  Icon,
  Button,
  ButtonGroup,
  Toaster,
  Position,
  Tooltip as T,
  Tag,
  EditableText
} from "@blueprintjs/core";
import { Route, Redirect, Link as L } from "react-router-dom";
import { Flex, Box } from "reflexbox";
import _ from "lodash";
import moment from "moment";

const Tooltip = styled(T)`
  flex: 1;
`;

const Name = styled.h3`
  margin: 0;
`;

const Link = styled(L)`
  color: unset;

  &:hover {
    text-decoration: unset;
    color: unset;
  }
`;

const P = styled.p`
  font-weight: bold;
`;

const exists = data => {
  if (data) return <P>{data}</P>;
  return <p>n/a</p>;
};

class Container extends Component {
  state = {
    toContainers: false
  };

  toContainers = () => {
    this.setState({ toContainers: true }, () => {
      this.setState({ toContainers: false });
    });
  };

  showToast = (message, intent) => {
    const AppToaster = Toaster.create({
      className: "recipe-toaster",
      position: Position.TOP_RIGHT
    });

    AppToaster.show({ message, intent });
  };

  stopContainer = async container => {
    let response, status, intent;

    try {
      response = await fetch("/containers/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ containerId: container.Id })
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = "Container stopped";
        intent = "success";
        break;
      case 304:
        status = "Container already stopped";
        intent = "warning";
        break;
      case 404:
        status = "No such container";
        intent = "danger";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.showToast(status, intent);
    this.props.updateContainer(container);
  };

  removeContainer = async container => {
    let response, status, intent;

    try {
      response = await fetch(`/containers/${container.Id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = "Container removed";
        intent = "success";
        break;
      case 400:
        status = "Something went wrong, bad parameter";
        intent = "danger";
        break;
      case 404:
        status = "No such container";
        intent = "danger";
        break;
      case 409:
        status = "You cannot remove a running container.";
        intent = "warning";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.showToast(status, intent);
    this.props.updateContainer(container);

    if ((await response.status) === 204) this.toContainers();
  };

  startContainer = async container => {
    let response, status, intent;

    try {
      response = await fetch(`/containers/${container.Id}`, {
        method: "POST"
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = "Container started";
        intent = "success";
        break;
      case 304:
        status = "Container already started";
        intent = "warning";
        break;
      case 404:
        status = "No such container";
        intent = "danger";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.showToast(status, intent);
    this.props.updateContainer(container);
  };

  restartContainer = async container => {
    let response, status, intent;

    try {
      response = await fetch(`/containers/${container.Id}/restart`, {
        method: "POST"
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = "Container restarted";
        intent = "success";
        break;
      case 404:
        status = "No such container";
        intent = "danger";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.showToast(status, intent);
    this.props.updateContainer(container);
  };

  renameContainer = async (container, name) => {
    let response, status, intent;

    try {
      response = await fetch(
        `/containers/${container.Id}/rename?name=${name}`,
        {
          method: "POST"
        }
      );
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = `Container renamed to '${name}'`;
        intent = "success";
        break;
      case 404:
        status = "No such container";
        intent = "danger";
        break;
      case 409:
        status = `The name ${name} is already in use`;
        intent = "danger";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.showToast(status, intent);
    this.props.updateContainer(container);
  };

  pauseContainer = async container => {
    let response, status, intent;

    try {
      response = await fetch(`/containers/${container.Id}/pause`, {
        method: "POST"
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = `Container paused'`;
        intent = "success";
        break;
      case 404:
        status = "No such container";
        intent = "danger";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.showToast(status, intent);
    this.props.updateContainer(container);
  };

  unpauseContainer = async container => {
    let response, status, intent;

    try {
      response = await fetch(`/containers/${container.Id}/unpause`, {
        method: "POST"
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = `Container unpaused'`;
        intent = "success";
        break;
      case 404:
        status = "No such container";
        intent = "danger";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.showToast(status, intent);
    this.props.updateContainer(container);
  };

  render() {
    const { container, match } = this.props;
    const containerNetworks = container.NetworkSettings.Networks;
    let networks = [];

    for (const network in containerNetworks) {
      networks.push({ name: network, data: containerNetworks[network] });
    }

    return (
      <Box mt={1}>
        <Link to={`${match.url}/${container.Id}`}>
          <Card interactive>
            {container.Names.map((name, j) => (
              <Flex justify="space-between" key={container.Id}>
                <Flex align="center">
                  <Box mr={2}>
                    <Tag intent="primary" round>
                      {container.Image}
                    </Tag>
                  </Box>
                  <Name>
                    <EditableText
                      defaultValue={name}
                      selectAllOnFocus
                      confirmOnEnterKey
                      onConfirm={name => this.renameContainer(container, name)}
                    />
                  </Name>
                  <Box ml={2}>{container.Status}</Box>
                </Flex>
              </Flex>
            ))}
            {this.state.toContainers ? (
              <Redirect to="/containers" />
            ) : (
              <Route
                path={`${match.path}/:containerId`}
                render={({ match }) => (
                  <Collapse isOpen={match.params.containerId === container.Id}>
                    <Box mt={2}>
                      <ButtonGroup fill large>
                        {container.State === "exited" && (
                          <Tooltip
                            content="Start container"
                            position={Position.BOTTOM}
                          >
                            <Button
                              intent="primary"
                              onClick={() => this.startContainer(container)}
                            >
                              <Icon icon="play" />
                            </Button>
                          </Tooltip>
                        )}
                        {container.State === "paused" && (
                          <Tooltip
                            content="Unpause container"
                            position={Position.BOTTOM}
                          >
                            <Button
                              intent="primary"
                              onClick={() => this.unpauseContainer(container)}
                            >
                              <Icon icon="play" />
                            </Button>
                          </Tooltip>
                        )}
                        {container.State === "running" && (
                          <Tooltip
                            content="Pause container"
                            position={Position.BOTTOM}
                          >
                            <Button
                              intent="primary"
                              onClick={() => this.pauseContainer(container)}
                            >
                              <Icon icon="pause" />
                            </Button>
                          </Tooltip>
                        )}
                        <Tooltip
                          content="Restart container"
                          position={Position.BOTTOM}
                        >
                          <Button
                            intent="warning"
                            onClick={() => this.restartContainer(container)}
                          >
                            <Icon icon="refresh" />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content="Stop container"
                          position={Position.BOTTOM}
                        >
                          <Button
                            intent="danger"
                            onClick={() => this.stopContainer(container)}
                          >
                            <Icon icon="stop" />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content="Remove container"
                          position={Position.BOTTOM}
                        >
                          <Button
                            intent="danger"
                            onClick={() => this.removeContainer(container)}
                          >
                            <Icon icon="trash" />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </Box>
                    <Flex pt={2}>
                      <Flex w={1 / 5} column>
                        <p>ID</p>
                        <p>Created</p>
                        <p>Command</p>
                        <p>Image ID</p>
                        <Box mt={2}>
                          <p>State</p>
                          <p>Status</p>
                        </Box>
                      </Flex>
                      <Flex w={4 / 5} column>
                        <P>{_.truncate(container.Id)}</P>
                        <P>
                          {moment
                            .unix(container.Created)
                            .format("h:mm:ss a on dddd, MMMM Do YYYY")}
                        </P>
                        <P>{container.Command}</P>
                        <P>{_.truncate(container.ImageID)}</P>
                        <Box mt={2}>
                          <P>{container.State}</P>
                          <P>{container.Status}</P>
                        </Box>
                      </Flex>
                    </Flex>
                    <Flex mt={2} column>
                      <h3>Networks</h3>
                      <Flex>
                        {networks.map((network, i) => {
                          return (
                            <React.Fragment key={`network-${i}`}>
                              <Flex w={1 / 5} column>
                                <p>{network.name}</p>
                              </Flex>
                              <Flex w={4 / 5}>
                                <Flex w={1 / 5} column>
                                  <p>Network ID</p>
                                  <p>MAC Address</p>
                                  <p>Endpoint ID</p>
                                  <p>Gateway</p>
                                  <p>Global IPv6</p>
                                  <p>IP Address</p>
                                </Flex>
                                <Flex w={4 / 5} column>
                                  {exists(_.truncate(network.data.NetworkID))}
                                  {exists(network.data.MacAddress)}
                                  {exists(network.data.EndpointID)}
                                  {exists(network.data.Gateway)}
                                  {exists(network.data.GlobalIPv6Address)}
                                  {exists(network.data.IPAddress)}
                                </Flex>
                              </Flex>
                            </React.Fragment>
                          );
                        })}
                      </Flex>
                    </Flex>
                  </Collapse>
                )}
              />
            )}
          </Card>
        </Link>
      </Box>
    );
  }
}

export default Container;
