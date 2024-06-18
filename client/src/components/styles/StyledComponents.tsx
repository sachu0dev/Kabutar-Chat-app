import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor, matBlack } from "../../constants/color";

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
  padding: "1rem",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});

export const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${grayColor};
  outline: none;
`;

export const SearchField = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${grayColor};
  color: black;
  font-size: 1rem;
  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.6);
`;

export const CurveButton = styled("button")`
  border-radius: 1.5rem;
  background-color: ${matBlack};
  cursor: pointer;
  color: white;
  font-size: 1rem;
  padding: 1rem 2rem;
  border: none;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
