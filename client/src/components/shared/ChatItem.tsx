import { Badge, Box, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { Link } from "../styles/StyledComponents";
import AvatarCard from "./AvatarCard";

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
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          gap: "1rem",
          cursor: "pointer",
          height: "6rem",
        }}
      >
        {avatar.length > 0 && (
          <Badge badgeContent={newMessageAlert?.count} color="error">
            <AvatarCard avatar={avatar} />
          </Badge>
        )}

        <Stack>
          <Typography>{name}</Typography>
          {/* {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )} */}
        </Stack>
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
