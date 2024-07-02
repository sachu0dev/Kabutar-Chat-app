import { Avatar, Stack, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
const Profile = () => {
  const { user, loader } = useSelector((state: RootState) => state.auth);
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: "200px",
          height: "200px",
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
        src={user?.avatar?.url}
      ></Avatar>
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        Icon={<UserNameIcon />}
      />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};
const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);
export default Profile;
