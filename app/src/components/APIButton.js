import React from "react";

import styled from "styled-components";
import { Button } from "@blueprintjs/core";
import { Link as L } from "react-router-dom";

const Link = styled(L)`
  &:hover {
    text-decoration: unset;
  }
`;

const APIButton = ({ route, icon, intent, children }) => (
  <Link to={route}>
    <Button icon={icon} minimal large intent={intent}>
      {children}
    </Button>
  </Link>
);

export default APIButton;
