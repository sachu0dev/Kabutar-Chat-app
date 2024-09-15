import { Box, Typography } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import { grayColor } from "../constants/color";

function Home() {
  return (
    <Box bgcolor={grayColor} height={"calc(100vh - 4rem)"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a Friend to Chat
      </Typography>
    </Box>
  );
}

export default AppLayout()(Home);
