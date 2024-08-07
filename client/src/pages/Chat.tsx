import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import FileMenu from "../components/dialog/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { grayColor, orange } from "../constants/color";
import {
  ALERT,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { getSocket } from "../socket";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessageAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";

interface ChatProps {
  chatId: string;
  user: any;
}

function Chat({ chatId, user }: ChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  const messageOnChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      socket?.emit(START_TYPING, {
        members,
        chatId,
        user: { _id: user._id, name: user.name },
      });
      setIsTyping(true);
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket?.emit(STOP_TYPING, {
        members,
        chatId,
        user: { _id: user._id, name: user.name },
      });
      setIsTyping(false);
    }, 2000);
  };

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchorEl(e.currentTarget);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket?.emit(NEW_MESSAGE, { chatId, members, message });
    socket?.emit(STOP_TYPING, {
      members,
      chatId,
      user: { _id: user._id, name: user.name },
    });
    setIsTyping(false);

    setMessage("");
  };

  useEffect(() => {
    if (!chatDetails.data?.chat) {
      return navigate(`/`);
    }
  }, [chatDetails.data]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const stratTypingListener = useCallback(
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

  const alertListner = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data,
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
    [ALERT]: alertListner,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: stratTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandlers);

  useErrors(errors);

  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    setAllMessages([...oldMessages, ...messages]);
  }, [messages, oldMessages]);

  useEffect(() => {
    return () => {
      socket.off(NEW_MESSAGE, newMessagesListener);
    };
  }, [socket, newMessagesListener]);

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));

    return () => {
      setMessages([]);
      setOldMessages([]);
      setPage(1);
      setAllMessages([]);
      setFileMenuAnchorEl(null);
    };
  }, [chatId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allMessages, userTyping]);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing="border-box"
        padding="1rem"
        spacing="1rem"
        bgcolor={grayColor}
        height="90%"
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {allMessages.map((message) => (
          <MessageComponent
            key={message._id}
            message={message}
            user={user}
            userTyping={userTyping}
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
            sx={{ position: "absolute", left: "1.5rem", rotate: "30deg" }}
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
              bgcolor: orange,
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
