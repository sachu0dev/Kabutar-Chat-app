import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import AdminLayout from "../layout/AdminLayout";
import { CurveButton, SearchField } from "../styles/StyledComponents";

const Dashboard = () => {
  const Appbar = (
    <Paper
      elevation={3}
      sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
        <SearchField type="text" placeholder="Search..." />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1} />
        <Typography
          display={{
            xs: "none",
            lg: "block",
          }}
          textAlign={"center"}
          color={"rgba(0,0,0,0.6)"}
        >
          {moment().format("dddd, D MMMM YYYY")}
        </Typography>
        <NotificationsIcon sx={{ fontSize: "2rem" }} />
      </Stack>
    </Paper>
  );

  const Widgets = <>lfkdls</>;
  return (
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}
        <Stack direction={"row"} flexWrap={"wrap"} spacing={"2rem"}>
          <Paper
            sx={{
              padding: "2rem 3rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography>Last Messages</Typography>
            {"Chat"}
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              width: "100%",
              maxWidth: "25rem",
              height: "25rem",
            }}
          >
            {"Dougnut Chart"}
            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
              <GroupIcon /> <Typography>Vs</Typography>
              <PersonIcon />
            </Stack>
          </Paper>
        </Stack>
        {Widgets}
      </Container>
    </AdminLayout>
  );
};

export default Dashboard;
