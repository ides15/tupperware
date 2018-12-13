import React, { Component } from "react";

import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import {
  Collapse,
  Tag,
  Button,
  Icon,
  ButtonGroup,
  Tooltip,
  Position,
  Toaster
} from "@blueprintjs/core";
import { Route } from "react-router-dom";
import Image from "../Image";

const Title = styled.h2`
  margin: 0;
`;

class Images extends Component {
  state = {
    images: []
  };

  async componentDidMount() {
    await this.updateAllImages();
    this.update = setInterval(() => this.updateAllImages(), 120 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

  showToast = (message, intent) => {
    const AppToaster = Toaster.create({
      className: "recipe-toaster",
      position: Position.BOTTOM
    });

    AppToaster.show({ message, intent });
  };

  updateAllImages = async () => {
    const images = await fetch("/api/images");
    this.setState({ images: await images.json() });
  };

  render() {
    const { images } = this.state;

    return (
      <Route
        path="/images"
        render={({ match }) => (
          <Collapse isOpen={match}>
            <Box p={2}>
              <Flex justify="space-between" align="center">
                <Flex align="center">
                  <Title>Images</Title>
                  <Box ml={1}>
                    <Tag large minimal round>
                      {this.state.images.length}
                    </Tag>
                  </Box>
                </Flex>
                <Flex>
                  <ButtonGroup large>
                    <Tooltip
                      position={Position.BOTTOM}
                      content="Update all images"
                    >
                      <Button minimal onClick={() => this.updateAllImages()}>
                        <Icon icon="refresh" iconSize="20" />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </Flex>
              </Flex>
              {images && (
                <>
                  {images.map((image, i) => (
                    <Image
                      image={image}
                      match={match}
                      key={`image-${i}`}
                      showToast={this.showToast}
                      updateAllImages={this.updateAllImages}
                    />
                  ))}
                </>
              )}
            </Box>
          </Collapse>
        )}
      />
    );
  }
}

export default Images;
