import React from "react";

import { Collapse, Card } from "@blueprintjs/core";
import { Route } from "react-router-dom";

const Networks = () => {
  return (
    <Route
      path="/networks"
      render={({ match }) => (
        <Collapse isOpen={match}>
          <Card>
            <h1>Networks</h1>
          </Card>
        </Collapse>
      )}
    />
  );
};

export default Networks;
