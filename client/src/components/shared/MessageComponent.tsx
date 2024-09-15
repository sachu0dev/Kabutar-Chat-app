import { Box, Typography } from "@mui/material";
import moment from "moment";
import { memo } from "react";
import { grayColor, lightBlue } from "../../constants/color";
import { fileFormat } from "../../lib/features";
import renderAttachment from "./renderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender?._id == user?._id;

  const timeAgo = moment(createdAt).fromNow();
  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "#7678ED" : "#EEEEF8",
        color: sameSender ? "white" : "black",
        padding: "0.5rem",
        borderRadius: "5px",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={"#4B4B8A"} fontWeight={"bold"}>
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

      <Typography variant="caption" color={sameSender ? "lightgray" : "text.primary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
