import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

export const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  posistion: "absolute",
  width: "1px",
});

export const Link = styled(LinkComponent)({
  textDecoration: "none",
  color: "black",
  cursor: "pointer",
  padding: "1rem",
  "&:hover": {
    backgroundColor: "@f0f0f0",
  },
});
