import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsMobile } from "../../redux/reducers/misc";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events";
import {
  incrementNotificationCount,
  setNewMessageAlert,
} from "../../redux/reducers/chat";

const AppLayout = () => (WrappedComponent: React.FC) => {
  return (props) => {
    useSocketEvents;
    const params = useParams();
    const dispatch = useDispatch();

    const chatId = params.chatId;

    const socket = getSocket();

    const { isMobile } = useSelector((state: RootState) => state.misc);
    const { user } = useSelector((state: RootState) => state.auth);
    const { newMessageAlert } = useSelector((state: RootState) => state.chat);
    console.log(newMessageAlert, "newMessageAlert");

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log(_id, groupChat);
    };

    const handleMobile = () => dispatch(setIsMobile(true));
    const handleCloseMobile = () => dispatch(setIsMobile(false));
    const newMessagesAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessageAlert(data));
        const sds = data.chatId;
        console.log("newMessage", sds);
      },
      [chatId]
    );
    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotificationCount());
    }, [dispatch]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessagesAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
    };

    useSocketEvents(socket, eventHandlers);

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
              newMessageAlert={newMessageAlert}
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
                newMessageAlert={newMessageAlert}
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
