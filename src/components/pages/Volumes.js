import React from "react";

import { Collapse, Card } from "@blueprintjs/core";
import { Route } from "react-router-dom";

const Volumes = () => {
  return (
    <Route
      path="/volumes"
      render={({ match }) => (
        <Collapse isOpen={match}>
          <Card>
            <h1>Volumes</h1>
          </Card>
        </Collapse>
      )}
    />
  );
};

export default Volumes;
