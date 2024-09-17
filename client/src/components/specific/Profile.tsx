import { Avatar, Stack, Typography, Skeleton } from "@mui/material";
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

  const isLoading = !user;

  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      {isLoading ? (
        <Skeleton
          variant="circular"
          width={200}
          height={200}
          sx={{ marginBottom: "1rem" }}
        />
      ) : (
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
      )}

      {isLoading ? (
        <>
          <Skeleton width={150} height={30} />
          <Skeleton width={200} height={30} />
          <Skeleton width={150} height={30} />
          <Skeleton width={100} height={30} />
        </>
      ) : (
        <>
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
        </>
      )}
    </Stack>
  );
};

interface ProfileCardProps {
  text: string;
  heading: string;
  Icon?: JSX.Element;
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
