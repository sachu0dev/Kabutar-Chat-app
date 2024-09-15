import { Badge, Box, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { Link } from "../styles/StyledComponents";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import { Margin } from "@mui/icons-material";

const ChatItem = ({
  avatar = [],
  name = "",
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  handleDeleteChat,
}) => {
  return (
    <Link
      sx={{ padding: 0 }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
          backgroundColor: sameSender ? "#EEEEF8" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          gap: "1rem",
          cursor: "pointer",
          height: "6rem",
          margin: "0.5rem 0.5rem 0 0.5rem",
          "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
          borderRadius: "1rem",
        }}
       
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2rem"}}>
        {avatar.length > 0 && (
          <Badge badgeContent={newMessageAlert?.count} color="warning">
            <AvatarCard avatar={avatar} />
          </Badge>
        )}

        <Stack>
          <Typography color={"black"} variant="h6">{name}</Typography>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>
        </div>
        {isOnline ? (
          <Box
            sx={{
              width: "0.5rem",
              height: "0.5rem",
              bgcolor: "green",
              borderRadius: "50%",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "0.5rem",
              height: "0.5rem",
              bgcolor: "gray",
              borderRadius: "50%",
            }}
          />
        )}
      </Box>
    </Link>
  );
};

export default memo(ChatItem);
