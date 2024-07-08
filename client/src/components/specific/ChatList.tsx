import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [],
  handleDeleteChat,
}) => {
  return (
    <Stack
      width={w}
      direction={"column"}
      overflow={"auto"}
      height={"calc(100vh - 4rem)"}
    >
      {chats.map((data, index) => {
        const { avatar, name, _id, groupChat, members } = data;
        const newMessagesAlert = newMessageAlert.find(
          ({ chatId }) => chatId === _id
        );
        const isOnline = members.some((member) => onlineUsers.includes(member));
        return (
          <ChatItem
            newMessageAlert={newMessagesAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={index}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
