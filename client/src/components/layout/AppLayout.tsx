import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../socket";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
} from "../../constants/events";
import {
  incrementNotificationCount,
  setNewMessageAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../dialog/DeleteChatMenu";
import { RootState } from "../../redux/store";

const AppLayout = () => (WrappedComponent: React.FC) => {
  return (props) => {
    useSocketEvents;
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const chatId = params.chatId;
    const deleteMenuAnchore = useRef(null);


    const socket = getSocket();

    const { isMobile } = useSelector((state: RootState) => state.misc);
    const { user } = useSelector((state: RootState) => state.auth);
    const { newMessageAlert } = useSelector((state: RootState) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: newMessageAlert,
        get: false,
      });
    }, [newMessageAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchore.current = e.currentTarget;
    };

    const handleMobile = () => dispatch(setIsMobile(true));
    const handleCloseMobile = () => dispatch(setIsMobile(false));
    const newMessagesListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessageAlert(data));
        const sds = data.chatId;
        console.log("newMessage", sds);
      },
      [chatId]
    );

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);
    const newRequestListener = useCallback(() => {
      dispatch(incrementNotificationCount());
    }, [dispatch]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessagesListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
    };

    useSocketEvents(socket, eventHandlers);



    return (
      <>
        <Title title="chat" description="a chat app" />
        <Header />

        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchore={deleteMenuAnchore } />

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
            bgcolor={"#202022"}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
