import React, { Component } from "react";

import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import _ from "lodash";
import moment from "moment";
import {
  Card as C,
  Tag,
  ButtonGroup,
  Tooltip,
  Position,
  AnchorButton,
  Collapse,
  Icon
} from "@blueprintjs/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Card = styled(C)`
  padding-top: 0;
  padding-bottom: 0;
`;

const ImageTag = styled.h3`
  margin: 0;
`;

const P = styled.p`
  font-weight: bold;
`;

class Image extends Component {
  state = {
    isOpen: false,
    removeIsLoading: false,
    imageIdHovered: false,
    parentIdHovered: false
  };

  componentDidMount() {
    const openImages = JSON.parse(localStorage.getItem("openImages"));

    if (openImages && openImages.includes(this.props.image.Id)) {
      this.setOpen(true);
    }
  }

  saveToStorage = id => {
    let openImages = JSON.parse(localStorage.getItem("openImages"));

    // If there are no images in storage
    if (!openImages) {
      openImages = [id];
      localStorage.setItem("openImages", JSON.stringify(openImages));
    }

    // If there are images in storage and they don't include the current image
    if (openImages && !openImages.includes(id)) {
      openImages.push(id);
      localStorage.setItem("openImages", JSON.stringify(openImages));
    }
  };

  removeFromStorage = id => {
    let openImages = JSON.parse(localStorage.getItem("openImages"));

    if (openImages && openImages.includes(id)) {
      openImages = _.remove(openImages, image => id !== image);
      localStorage.setItem("openImages", JSON.stringify(openImages));
    }
  };

  setOpen = open => {
    this.setState(prevState => {
      // If the developer specifies a parameter, he wants to specifically set if the component is open
      if (open !== undefined) {
        // If the developer wants the container open, set the container ID in storage, else remove it
        if (open) this.saveToStorage(this.props.image.Id);
        else this.removeFromStorage(this.props.image.Id);

        return {
          isOpen: open
        };
      }

      // If the developer does NOT specify a parameter, he wants to toggle the componet
      // If the previous state was open, remove the container from storage
      if (prevState.isOpen) this.removeFromStorage(this.props.image.Id);
      // If the previous state was not open, save the container to storage
      else this.saveToStorage(this.props.image.Id);

      return {
        isOpen: !prevState.isOpen
      };
    });
  };

  removeImage = async (e, image) => {
    this.setState({ removeIsLoading: true });
    e.stopPropagation();
    let response, status, intent;

    try {
      response = await fetch(`/api/images/${image.Id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error(error);
    }

    switch (await response.status) {
      case 200:
        status = "Image removed";
        intent = "success";
        break;
      case 404:
        status = "No such image";
        intent = "danger";
        break;
      case 409:
        status = "You cannot remove this image";
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
    this.props.updateAllImages();
    this.setState({ removeIsLoading: false });
  };

  render() {
    const { image } = this.props;

    return (
      <Box mt={1}>
        <Card interactive>
          {image.RepoTags.map((tag, i) => {
            const disabled = tag.includes("tupperware");

            return (
              <Flex
                py={1}
                justify="space-between"
                key={image.Id}
                onClick={() => this.setOpen()}
              >
                <Flex align="center">
                  <ImageTag>{tag}</ImageTag>
                  <Box ml={2}>
                    {`Created ${moment.unix(image.Created).fromNow()}`}
                  </Box>
                </Flex>
                <Flex align="center">
                  <Box mr={2}>
                    <Tag round>{(image.Size / 1000000).toFixed(1)} mb</Tag>
                  </Box>
                  <ButtonGroup fill large>
                    <Tooltip
                      content="Remove image"
                      position={Position.BOTTOM}
                      isDisabled
                    >
                      <AnchorButton
                        disabled={disabled}
                        minimal
                        loading={this.state.removeIsLoading}
                        icon="trash"
                        intent="danger"
                        onClick={e => this.removeImage(e, image)}
                      />
                    </Tooltip>
                  </ButtonGroup>
                </Flex>
              </Flex>
            );
          })}
          <Collapse isOpen={this.state.isOpen}>
            <Flex pt={1}>
              <Flex w={1 / 8} column>
                <p>ID</p>
                <p>Parent ID</p>
              </Flex>
              <Flex w={7 / 8} column>
                <Flex>
                  <CopyToClipboard text={image.Id}>
                    <P
                      onMouseOver={() =>
                        this.setState({ imageIdHovered: true })
                      }
                      onMouseLeave={() =>
                        this.setState({ imageIdHovered: false })
                      }
                    >
                      {image.Id}
                    </P>
                  </CopyToClipboard>
                  {this.state.imageIdHovered && (
                    <Box ml={1}>
                      <Icon icon="duplicate" />
                    </Box>
                  )}
                </Flex>
                <Flex>
                  <CopyToClipboard text={image.ParentId}>
                    <P
                      onMouseOver={() =>
                        this.setState({ parentIdHovered: true })
                      }
                      onMouseLeave={() =>
                        this.setState({ parentIdHovered: false })
                      }
                    >
                      {image.ParentId}
                    </P>
                  </CopyToClipboard>
                  {this.state.parentIdHovered && (
                    <Box ml={1}>
                      <Icon icon="duplicate" />
                    </Box>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Collapse>
        </Card>
      </Box>
    );
  }
}

export default Image;
