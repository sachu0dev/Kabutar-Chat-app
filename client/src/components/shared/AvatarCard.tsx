import { Avatar, AvatarGroup, Stack } from "@mui/material";
import React from "react";
import { transformImage } from "../../lib/features";

interface AvatarCardProps {
  avatar: string[];
  max?: number;
}

const AvatarCard: React.FC<AvatarCardProps> = ({ avatar = [], max = 2 }) => {
  return (
    <Stack direction={"row"} spacing={0.5} position={"relative"}>
      <AvatarGroup max={max}>
        {avatar?.map((src, index) => (
          <Avatar
            key={index}
            src={transformImage(src)}
            alt="avatar"
            sx={{
              width: "3rem",
              height: "3rem",
            }}
          />
        ))}
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
