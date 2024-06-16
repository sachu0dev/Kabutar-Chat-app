import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent: React.FC) => {
  return (props) => {
    const params = useParams();

    const chatId = params.chatId;

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log(_id, groupChat);
    };
    return (
      <>
        <Title title="chat" description="a chat app" />
        <Header />

        <Grid container height={"calc(100vh - 4rem"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"calc(100vh - 4rem"}
          >
            <ChatList
              chats={sampleChats}
              chatId={chatId}
              newMessagesAlert={[
                {
                  chatId,
                  count: 4,
                },
              ]}
              onlineUsers={["1", "2"]}
              handleDeleteChat={handleDeleteChat}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"calc(100vh - 4rem)"}>
            <WrappedComponent {...props} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: {
                xs: "none",
                md: "block",
                padding: "2rem",
              },
            }}
            height={"calc(100vh - 4rem)"}
            bgcolor={"#1d1c20"}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
