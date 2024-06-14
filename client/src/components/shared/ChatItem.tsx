import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";

const ChatItem = ({
  avatar = [],
  name = "",
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessagesAlert,
  index = 0,
  handleDeleteChatOpen,
}) => {
  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChatOpen(e, _id, groupChat)}
    >
      {" "}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: " 1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          gap: "1rem",
        }}
      >
        {/* avatar card */}
        <Stack>
          <Typography>{name}</Typography>
          {newMessagesAlert && (
            <Typography>{newMessagesAlert.count} New Message</Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: "0.5rem",
              height: "0.5rem",
              bgcolor: "green",
              borderRadius: "50%",
              position: "absolute",
              right: "50%",
              top: "1rem",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default memo(ChatItem);
