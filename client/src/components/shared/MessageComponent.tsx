import { withTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { grayColor, lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import { render } from "react-dom";
import renderAttachment from "./renderAttachment";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();
  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "green" : "white",
        color: sameSender ? "white" : "black",
        padding: "0.5rem",
        borderRadius: "5px",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"bold"}>
          {sender?.name}
        </Typography>
      )}
      {content && <Typography>{content}</Typography>}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <Box key={index} bgcolor={grayColor}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {renderAttachment({ file, url })}
              </a>
            </Box>
          );
        })}

      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </div>
  );
};

export default memo(MessageComponent);
