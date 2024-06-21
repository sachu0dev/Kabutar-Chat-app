import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Table from "../shared/Table";
import { DashboardData } from "../../constants/sampleData";
import { fileFormat, transformImage } from "../../lib/features";
import moment from "moment";
import { Avatar, Box, Stack } from "@mui/material";
import renderAttachment from "../../components/shared/renderAttachment";

interface Attachment {
  public_id: string;
  url: string;
}

interface Sender {
  _id: string;
  name: string;
  avatar: string;
}

interface Message {
  _id: string;
  attachments: Attachment[];
  content: string;
  sender: Sender;
  chat: string;
  groupChat: boolean;
  createdAt: string;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params: { row: Message }) => {
      const { attachment } = params.row;
      return attachment?.length > 0 ? (
        <Stack direction="row" spacing={1}>
          {attachment.map((i) => {
            const url = i.url;
            const file = fileFormat(url);
            return (
              <Box key={i.public_id}>
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black" }}
                >
                  {renderAttachment(url, file)}
                </a>
              </Box>
            );
          })}
        </Stack>
      ) : (
        "No Attachments"
      );
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params: { row: Message }) => {
      const { sender } = params.row;
      return (
        <Stack>
          <Avatar alt={sender.name} src={sender.avatar} />
          <span>{sender.name}</span>
        </Stack>
      );
    },
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState<Message[]>([]);

  useEffect(() => {
    setRows(
      DashboardData.messages.map((message: Message) => ({
        ...message,
        id: message._id,
        sender: {
          ...message.sender,
          avatar: transformImage(message.sender.avatar, 50),
        },
        createdAt: moment(message.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      }))
    );
  }, []);

  return (
    <AdminLayout>
      <Table
        heading={"All Messages"}
        rows={rows}
        columns={columns}
        rowHeight={200}
      />
    </AdminLayout>
  );
};

export default MessageManagement;
