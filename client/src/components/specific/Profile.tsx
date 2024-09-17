import { Avatar, Backdrop, Stack, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { useSelector } from "react-redux";
import { transformImage } from "../../lib/features";
import { RootState } from "../../redux/store";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user?.avatar?.url && (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: "200px",
          height: "200px",
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
        src={transformImage(user?.avatar.url, 200)}
      />
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
  )
};

interface ProfileCardProps {
  text: string;
  heading: string;
  Icon?: JSX.Element; // Mark Icon as optional
}

const ProfileCard = ({ text, Icon, heading }: ProfileCardProps) => (
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
