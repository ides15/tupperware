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

const Volumes = () => {
  return (
    <Route
      path="/volumes"
      render={({ match }) => (
        <Collapse isOpen={match}>
          <Box p={2}>
            <Title>Volumes</Title>
          </Box>
        </Collapse>
      )}
    />
  );
};

export default Volumes;
