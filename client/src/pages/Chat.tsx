import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import FileMenu from "../components/dialog/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { TypingLoader } from "../components/layout/Loaders";
import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  START_TYPING,
  STOP_TYPING,
  JOIN_CHAT,
} from "../constants/events";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { getSocket } from "../socket";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessageAlert } from "../redux/reducers/chat";

function Chat({ chatId, user }) {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState([]);
  const typingTimeOut = useRef(null);

  const socket = getSocket();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({
    chatId,
    page,
    skip: !chatId,
  });

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails.data?.chat?.members;

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  useEffect(() => {
    if (chatId) {
      socket?.emit(JOIN_CHAT, { chatId });
    }

    return () => {
      if (chatId) {
        socket?.emit('leave', { chatId });
      }
    };
  }, [chatId, socket]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError, navigate]);

  const messageOnChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      socket?.emit(START_TYPING, {
        chatId,
        user: { _id: user._id, name: user.name },
      });
      setIsTyping(true);
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket?.emit(STOP_TYPING, {
        chatId,
        user: { _id: user._id, name: user.name },
      });
      setIsTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchorEl(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket?.emit(NEW_MESSAGE, { chatId, members, message });
    socket?.emit(STOP_TYPING, {
      chatId,
      user: { _id: user._id, name: user.name },
    });
    setIsTyping(false);
    setMessage("");
  };

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping((prev) => [...prev, data.user]);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping((prev) =>
        prev.filter((user) => user._id !== data.user._id)
      );
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "ljdsklfj",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandlers);

  useErrors(errors);

  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    setAllMessages([...oldMessages, ...messages]);
  }, [messages, oldMessages]);

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));

    return () => {
      setMessages([]);
      setOldMessages([]);
      setPage(1);
      setAllMessages([]);
      setFileMenuAnchorEl(null);
    };
  }, [chatId, dispatch, setOldMessages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, userTyping]);

  if (chatDetails.isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      <Stack
        ref={containerRef}
        boxSizing="border-box"
        padding="1rem"
        spacing="1rem"
        bgcolor="white"
        height="90%"
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        {allMessages.map((message) => (
          <MessageComponent
            key={message._id}
            message={message}
            user={user}
          />
        ))}
        {userTyping.length > 0 && <TypingLoader userTyping={userTyping} />}
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction="row"
          height="100%"
          padding="1rem"
          alignItems="center"
          position="relative"
        >
          <IconButton
            sx={{ position: "absolute", left: "1.5rem", rotate: "30deg", color: "#7678ED" }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message Here...."
            value={message}
            onChange={messageOnChangeHandler}
          />
          <IconButton
            type="submit"
            sx={{
              bgcolor: "#7678ED",
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorEl={fileMenuAnchorEl} chatId={chatId} />
    </>
  );
}

export default AppLayout()(Chat);