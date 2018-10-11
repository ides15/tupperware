import React, { Component } from "react";

import styled from "styled-components";
import { Button, Icon, Collapse, Card } from "@blueprintjs/core";
import { Route } from "react-router-dom";
import { Flex } from "reflexbox";
import _ from "lodash";

import Container from "../Container";

const Title = styled.h2`
  margin: 0;
`;

class Containers extends Component {
  constructor() {
    super();
    this.state = {
      containers: null
    };
  }

  async componentDidMount() {
    this.updateAllContainers();
    this.update = setInterval(() => this.updateAllContainers(), 15 * 1000);
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

  render() {
    const { containers } = this.state;

    return (
      <Route
        path="/containers"
        render={({ match }) => (
          <Collapse isOpen={match}>
            <Card>
              <Flex justify="space-between" align="center">
                <Title>Containers</Title>
                <Button minimal onClick={() => this.updateAllContainers()}>
                  <Icon icon="refresh" iconSize="20" />
                </Button>
              </Flex>
              {containers && (
                <>
                  {containers.map((container, i) => (
                    <Container
                      container={container}
                      match={match}
                      key={`container-${i}`}
                      updateContainer={this.updateContainer}
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
