import React from "react";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";
import { transformImage } from "../../lib/features";

interface AttachmentProps {
  file: string;
  url: string;
}

const renderAttachment: React.FC<AttachmentProps> = ({ file, url }) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          width={"200px"}
          height={"150px"}
          style={{
            objectFit: "contain",
          }}
        />
      );

    case "audio":
      return <audio src={url} preload="none" controls />;

    case "pdf":
      return <embed src={url} width={"200px"} />;

    case "file":
      return (
        <a href={url} download>
          Download
        </a>
      );

    default:
      return <FileOpenIcon />;
  }
};

export default renderAttachment;
