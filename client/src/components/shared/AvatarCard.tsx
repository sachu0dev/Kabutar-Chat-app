import { Avatar, AvatarGroup, Stack } from "@mui/material";
import React from "react";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup max={max}>
        {avatar?.map((src, index) => (
          <Avatar
            key={index}
            src={src}
            alt="avatar"
            sx={{
              width: "3rem",
              height: "3rem",
              position: "absolute",
              left: {
                xs: `${1 + index}rem`,
                sm: `${0.5 + index}rem`,
              },
            }}
          />
        ))}
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
