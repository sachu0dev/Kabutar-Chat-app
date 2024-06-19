import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Table from "../shared/Table";
import { Avatar } from "@mui/material";
import { DashboardData } from "../../constants/sampleData";
import { transformImage } from "../../lib/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];
const UserManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      DashboardData.users.map((user) => ({
        ...user,
        id: user._id,
        avatar: transformImage(user.avatar, 50),
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table heading={"All Users"} rows={rows} columns={columns} />
    </AdminLayout>
  );
};

export default UserManagement;
