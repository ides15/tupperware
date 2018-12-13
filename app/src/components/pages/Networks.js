import React from "react";

import { Collapse as C } from "@blueprintjs/core";
import { Route } from "react-router-dom";
import styled from "styled-components";
import { Box } from "reflexbox";

const Title = styled.h2`
  margin: 0;
`;

const Collapse = styled(C)`
  max-width: 1750px;
  width: 100%;
  margin: auto;
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
