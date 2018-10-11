import React from "react";

import { Collapse, Card } from "@blueprintjs/core";
import { Route } from "react-router-dom";

const Images = () => {
  return (
    <Route
      path="/images"
      render={({ match }) => (
        <Collapse isOpen={match}>
          <Card>
            <h1>Images</h1>
          </Card>
        </Collapse>
      )}
    />
  );
};

export default Images;
