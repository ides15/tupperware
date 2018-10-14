import React, { Component } from "react";

import styled from "styled-components";
import {
  FocusStyleManager,
  Collapse,
  Card as C,
  AnchorButton,
  ButtonGroup,
  Position,
  Tooltip as T,
  Tag,
  EditableText
} from "@blueprintjs/core";
import { Flex, Box } from "reflexbox";
import _ from "lodash";
import moment from "moment";

const Tooltip = styled(T)`
  flex: 1;
`;

const Card = styled(C)`
  padding-top: 0;
  padding-bottom: 0;
`;

const Name = styled.h3`
  margin: 0;
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
    isOpen: false,
    startIsLoading: false,
    unpauseIsLoading: false,
    pauseIsLoading: false,
    restartIsLoading: false,
    stopIsLoading: false,
    removeIsLoading: false
  };

  componentDidMount() {
    FocusStyleManager.onlyShowFocusOnTabs();

    const openContainers = JSON.parse(localStorage.getItem("openContainers"));

    if (openContainers && openContainers.includes(this.props.container.Id)) {
      this.setOpen(true);
    }
  }

  saveToStorage = id => {
    let openContainers = JSON.parse(localStorage.getItem("openContainers"));

    // If there are no containers in storage
    if (!openContainers) {
      openContainers = [id];
      localStorage.setItem("openContainers", JSON.stringify(openContainers));
    }

    // If there are containers in storage and they don't include the current container
    if (openContainers && !openContainers.includes(id)) {
      openContainers.push(id);
      localStorage.setItem("openContainers", JSON.stringify(openContainers));
    }
  };

  removeFromStorage = id => {
    let openContainers = JSON.parse(localStorage.getItem("openContainers"));

    if (openContainers && openContainers.includes(id)) {
      openContainers = _.remove(openContainers, container => id !== container);
      localStorage.setItem("openContainers", JSON.stringify(openContainers));
    }
  };

  setOpen = open => {
    this.setState(prevState => {
      // If the developer specifies a parameter, he wants to specifically set if the component is open
      if (open !== undefined) {
        // If the developer wants the container open, set the container ID in storage, else remove it
        if (open) this.saveToStorage(this.props.container.Id);
        else this.removeFromStorage(this.props.container.Id);

        return {
          isOpen: open
        };
      }

      // If the developer does NOT specify a parameter, he wants to toggle the componet
      // If the previous state was open, remove the container from storage
      if (prevState.isOpen) this.removeFromStorage(this.props.container.Id);
      // If the previous state was not open, save the container to storage
      else this.saveToStorage(this.props.container.Id);

      return {
        isOpen: !prevState.isOpen
      };
    });
  };

  stopContainer = async (e, container) => {
    this.setState({ stopIsLoading: true });
    e.stopPropagation();
    let response, status, intent;

    try {
      response = await fetch("/api/containers/stop", {
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

    this.props.showToast(status, intent);
    this.props.updateContainer(container);
    this.setState({ stopIsLoading: false });
  };

  removeContainer = async (e, container) => {
    this.setState({ removeIsLoading: true });
    e.stopPropagation();
    let response, status, intent;

    try {
      response = await fetch(`/api/containers/${container.Id}`, {
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
        status = "You cannot remove a running container";
        intent = "warning";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.props.showToast(status, intent);
    this.setOpen(false);
    this.props.updateContainer(container);
    this.setState({ removeIsLoading: false });
  };

  startContainer = async (e, container) => {
    this.setState({ startIsLoading: true });
    e.stopPropagation();
    let response, status, intent;

    try {
      response = await fetch(`/api/containers/${container.Id}`, {
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

    this.props.showToast(status, intent);
    this.props.updateContainer(container);
    this.setState({ startIsLoading: false });
  };

  restartContainer = async (e, container) => {
    this.setState({ restartIsLoading: true });
    e.stopPropagation();
    let response, status, intent;

    try {
      response = await fetch(`/api/containers/${container.Id}/restart`, {
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

    this.props.showToast(status, intent);
    this.props.updateContainer(container);
    this.setState({ restartIsLoading: false });
  };

  renameContainer = async (container, name) => {
    let response, status, intent;

    // If the use clicks away without changing anything
    if (container.Names[0] === name) return;

    try {
      response = await fetch(
        `/api/containers/${container.Id}/rename?name=${name}`,
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
      case 400:
        status = `Error renaming to '${name}'`;
        intent = "danger";
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

    this.props.showToast(status, intent);
    this.props.updateContainer(container);
  };

  pauseContainer = async (e, container) => {
    this.setState({ pauseIsLoading: true });
    e.stopPropagation();
    let response, status, intent;

    try {
      response = await fetch(`/api/containers/${container.Id}/pause`, {
        method: "POST"
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = `Container paused`;
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

    this.props.showToast(status, intent);
    this.props.updateContainer(container);
    this.setState({ pauseIsLoading: false });
  };

  unpauseContainer = async (e, container) => {
    this.setState({ unpauseIsLoading: true });
    e.stopPropagation();
    let response, status, intent;

    try {
      response = await fetch(`/api/containers/${container.Id}/unpause`, {
        method: "POST"
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 204:
        status = `Container unpaused`;
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

    this.props.showToast(status, intent);
    this.props.updateContainer(container);
    this.setState({ unpauseIsLoading: false });
  };

  render() {
    const { container } = this.props;
    const containerNetworks = container.NetworkSettings.Networks;
    let networks = [];

    for (const network in containerNetworks) {
      networks.push({ name: network, data: containerNetworks[network] });
    }

    return (
      <Box mt={1}>
        <Card interactive>
          {container.Names.map((name, j) => (
            <Flex
              py={1}
              justify="space-between"
              key={container.Id}
              onClick={() => this.setOpen()}
            >
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
              <Flex align="center">
                <ButtonGroup fill large>
                  {container.State === "exited" && (
                    <Tooltip
                      content="Start container"
                      position={Position.BOTTOM}
                    >
                      <AnchorButton
                        minimal
                        loading={this.state.startIsLoading}
                        icon="play"
                        intent="primary"
                        onClick={e => this.startContainer(e, container)}
                      />
                    </Tooltip>
                  )}
                  {container.State === "paused" && (
                    <Tooltip
                      content="Unpause container"
                      position={Position.BOTTOM}
                    >
                      <AnchorButton
                        minimal
                        loading={this.state.unpauseIsLoading}
                        icon="play"
                        intent="primary"
                        onClick={e => this.unpauseContainer(e, container)}
                      />
                    </Tooltip>
                  )}
                  {container.State === "running" && (
                    <Tooltip
                      content="Pause container"
                      position={Position.BOTTOM}
                    >
                      <AnchorButton
                        minimal
                        loading={this.state.pauseIsLoading}
                        icon="pause"
                        intent="primary"
                        onClick={e => this.pauseContainer(e, container)}
                      />
                    </Tooltip>
                  )}
                  <Tooltip
                    content="Restart container"
                    position={Position.BOTTOM}
                    isDisabled
                  >
                    <AnchorButton
                      minimal
                      loading={this.state.restartIsLoading}
                      icon="refresh"
                      intent="warning"
                      onClick={e => this.restartContainer(e, container)}
                    />
                  </Tooltip>
                  {container.State !== "exited" && (
                    <Tooltip
                      content="Stop container"
                      position={Position.BOTTOM}
                    >
                      <AnchorButton
                        minimal
                        loading={this.state.stopIsLoading}
                        icon="stop"
                        intent="danger"
                        onClick={e => this.stopContainer(e, container)}
                      />
                    </Tooltip>
                  )}
                  <Tooltip
                    content="Remove container"
                    position={Position.BOTTOM}
                  >
                    <AnchorButton
                      minimal
                      loading={this.state.removeIsLoading}
                      icon="trash"
                      intent="danger"
                      onClick={e => this.removeContainer(e, container)}
                    />
                  </Tooltip>
                </ButtonGroup>
                {container.Ports[0] &&
                  container.Ports[0].IP && (
                    <Tooltip content="Open site" position={Position.BOTTOM}>
                      <AnchorButton
                        minimal
                        large
                        icon="share"
                        onClick={e => {
                          e.stopPropagation();
                          window.open(
                            `http://${container.Ports[0].IP}:${
                              container.Ports[0].PublicPort
                            }`,
                            "_blank"
                          );
                        }}
                      />
                    </Tooltip>
                  )}
              </Flex>
            </Flex>
          ))}
          <Collapse isOpen={this.state.isOpen}>
            <Flex pt={1}>
              <Flex w={1 / 5} column>
                <p>ID</p>
                <p>Created</p>
                <p>Command</p>
                <p>Image ID</p>
                <Box mt={2}>
                  <p>Size</p>
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
                  <P>{(container.SizeRootFs / 1000000).toFixed(1)} mb</P>
                  <P>{container.State}</P>
                  <P>{container.Status}</P>
                </Box>
              </Flex>
            </Flex>
            <Flex mt={2} column>
              <h3>Networks</h3>
              <Flex pb={1}>
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
        </Card>
      </Box>
    );
  }
}

export default Container;