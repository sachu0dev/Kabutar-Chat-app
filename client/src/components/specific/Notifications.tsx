import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationQuery,
} from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

function Notifications() {
  const { isNotification } = useSelector((state: any) => state.misc);
  const { isLoading, data, error, isError } = useGetNotificationQuery();
  const dispatch = useDispatch();
  const [acceptRequest] = useAcceptFriendRequestMutation();

  const friendRequestHandler = async (_id: string, accept: boolean) => {
    dispatch(setIsNotification(false));
    try {
      const res: any = await acceptRequest({ requestId: _id, accept });
      if (res?.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useErrors([{ error, isError }]);

  const closeHandler = () => {
    dispatch(setIsNotification(false));
  };

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"30rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : data && data.allRequests.length > 0 ? (
          data.allRequests.map((notification: any) => (
            <NotificationsItem
              key={notification._id}
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

interface NotificationsItemProps {
  sender: {
    name: string;
    avatar: string;
  };
  _id: string;
  handler: (_id: string, accept: boolean) => void;
}

const NotificationsItem = memo(
  ({ sender, _id, handler }: NotificationsItemProps) => {
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
  }
);

export default Notifications;
