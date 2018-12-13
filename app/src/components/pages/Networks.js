import React from "react";

import { Collapse } from "@blueprintjs/core";
import { Route } from "react-router-dom";
import styled from "styled-components";
import { Box } from "reflexbox";

const Title = styled.h2`
  margin: 0;
`;

const Networks = () => {
  return (
    <Route
      path="/networks"
      render={({ match }) => (
        <Collapse isOpen={match}>
          <Box p={2}>
            <Title>Networks</Title>
          </Box>
        </Collapse>
      )}
    />
  );
};

export default Networks;
