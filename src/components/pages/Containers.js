import React, { Component } from "react";

import styled from "styled-components";
import {
  Button,
  Icon,
  Collapse,
  Card,
  Tooltip,
  Position,
  Tag,
  ButtonGroup,
  Toaster
} from "@blueprintjs/core";
import { Route } from "react-router-dom";
import { Flex, Box } from "reflexbox";
import _ from "lodash";

import Container from "../Container";

const Title = styled.h2`
  margin: 0;
`;

class Containers extends Component {
  constructor() {
    super();
    this.state = {
      containers: []
    };
  }

  showToast = (message, intent) => {
    const AppToaster = Toaster.create({
      className: "recipe-toaster",
      position: Position.TOP_RIGHT
    });

    AppToaster.show({ message, intent });
  };

  async componentDidMount() {
    this.updateAllContainers();
    this.update = setInterval(() => this.updateAllContainers(), 30 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

  updateAllContainers = async () => {
    const containers = await fetch("/containers");
    this.setState({ containers: await containers.json() });
  };

  updateContainer = async container => {
    let newContainer;
    try {
      newContainer = await fetch(`/containers/${container.Id}`);
      newContainer = await newContainer.json();
    } catch (error) {
      console.error(error);
    }

    newContainer = await newContainer[0];

    let containers = this.state.containers;
    const containerIndex = _.findIndex(containers, { Id: container.Id });

    if (newContainer === undefined) {
      _.remove(containers, n => n === containers[containerIndex]);
    } else {
      containers[containerIndex] = newContainer;
    }

    this.setState({ containers });
  };

  deleteStoppedContainers = async () => {
    let response, status, intent;

    try {
      response = await fetch("/containers/prune", {
        method: "POST"
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 200:
        const body = await response.json();

        if (body.ContainersDeleted) {
          status = `${body.ContainersDeleted.length} containers deleted`;
        } else {
          status = "No containers were deleted";
        }
        intent = "success";
        break;
      case 500:
        status = "Server error";
        intent = "danger";
        break;
      default:
        status = response.status;
    }

    this.showToast(status, intent);
    this.updateAllContainers();
  };

  render() {
    const { containers } = this.state;

    return (
      <Route
        path="/containers"
        render={({ match }) => (
          <Collapse isOpen={match}>
            <Card>
              <Flex justify="space-between" align="center">
                <Flex align="center">
                  <Title>Containers</Title>
                  <Box ml={1}>
                    <Tag large minimal round>
                      {this.state.containers.length}
                    </Tag>
                  </Box>
                </Flex>
                <Flex>
                  <ButtonGroup large>
                    <Tooltip
                      position={Position.BOTTOM}
                      content="Delete stopped containers"
                    >
                      <Button
                        minimal
                        onClick={() => this.deleteStoppedContainers()}
                      >
                        <Icon icon="filter-remove" iconSize="20" />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      position={Position.BOTTOM}
                      content="Update all containers"
                    >
                      <Button
                        minimal
                        onClick={() => this.updateAllContainers()}
                      >
                        <Icon icon="refresh" iconSize="20" />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </Flex>
              </Flex>
              {containers && (
                <>
                  {containers.map((container, i) => (
                    <Container
                      container={container}
                      match={match}
                      key={`container-${i}`}
                      updateContainer={this.updateContainer}
                      showToast={this.showToast}
                    />
                  ))}
                </>
              )}
            </Card>
          </Collapse>
        )}
      />
    );
  }
}

export default Containers;
