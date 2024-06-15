import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { sampleNotifications } from "../../constants/sampleData";

function Notifications() {
  const friendRequestHandler = (_id, accept) => {
    console.log("friendRequestHandler");
  };
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"30rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {sampleNotifications.length > 0 ? (
          sampleNotifications.map((notification, index) => (
            <NotificationsItem
              sender={notification.sender}
              _id={notification._id}
              handler={friendRequestHandler}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>0 Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
}

const NotificationsItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name + " sent you a friend request."}
        </Typography>
      </Stack>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
      >
        <Button onClick={() => handler(_id, true)}>Accept</Button>
        <Button color="error" onClick={() => handler(_id, false)}>
          Reject
        </Button>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
