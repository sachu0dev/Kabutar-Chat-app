import { Drawer, Grid, Skeleton } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrors } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsMobile } from "../../redux/reducers/misc";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../socket";

const AppLayout = () => (WrappedComponent: React.FC) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();

    const chatId = params.chatId;

    const socket = getSocket();

    const { isMobile } = useSelector((state: RootState) => state.misc);
    const { user } = useSelector((state: RootState) => state.auth);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log(_id, groupChat);
    };

    const handleMobile = () => dispatch(setIsMobile(true));
    const handleCloseMobile = () => dispatch(setIsMobile(false));

    return (
      <>
        <Title title="chat" description="a chat app" />
        <Header />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer anchor="left" open={isMobile} onClose={handleCloseMobile}>
            <ChatList
              w="70vw"
              chats={data.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          </Drawer>
        )}

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
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"calc(100vh - 4rem)"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
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
