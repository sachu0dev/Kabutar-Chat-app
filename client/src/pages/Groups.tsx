import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
  Padding,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { lazy, memo, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../components/shared/AvatarCard";
import { Link as LinkComponent } from "../components/styles/StyledComponents";
import { bgGradient, matBlack } from "../constants/color";
import { sampleChats, sampleUsers } from "../constants/sampleData";
import UserItem from "../components/shared/UserItem";

const ConfirmDeleteDialog = lazy(
  () => import("../components/dialog/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(
  () => import("../components/dialog/AddMemberDialog")
);

// Define the type for a chat group
interface ChatGroup {
  _id: string;
  name: string;
  avatar: string;
}

function Groups() {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const navigateBack = () => {
    navigate("/");
  };

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const deleteHandler = () => {
    console.log("deleteHandler");
  };

  const updateGroupName = () => {
    setIsEdit(false);
    console.log("update group name to: " + groupNameUpdatedValue);
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
    console.log(groupNameUpdatedValue);
  };

  const openAddMemeberHandler = () => {
    console.log("openAddMemeberHandler");
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const removeMemberHandler = (id) => {
    console.log("removeMemberHandler" + id);
    closeConfirmDeleteHandler;
  };
  useEffect(() => {
    if (chatId) {
      setGroupName(`Group ${chatId}`);
      setGroupNameUpdatedValue(`Group ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            color: "white",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={"1rem"}
        padding={"1rem "}
      >
        {isEdit ? (
          <>
            <TextField
              value={groupNameUpdatedValue}
              onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            />
            <IconButton onClick={updateGroupName}>
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h4">{groupName}</Typography>
            <IconButton onClick={() => setIsEdit(true)}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </Stack>
    </>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setAddMemberDialog(true)}
      >
        Add Member
      </Button>
    </Stack>
  );

  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: { xs: "none", sm: "block" },
          backgroundImage: bgGradient,
        }}
        sm={4}
      >
        <GroupsList myGroups={sampleChats} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}

        {groupName && (
          <>
            {GroupName}
            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                md: "1rem 4rem",
                xs: "0",
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {sampleUsers &&
                sampleUsers.map((user) => (
                  <UserItem
                    user={user}
                    key={user._id}
                    isAdded
                    styling={{
                      boxShadow: "0 0 .5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))}
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>

      {addMemberDialog && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog open={addMemberDialog} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <>
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        </>
      )}

      <Drawer
        open={isMobileMenuOpen}
        onClose={handleMobile}
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
      >
        <GroupsList w={"70vw"} myGroups={sampleChats} chatId={chatId} />
      </Drawer>
    </Grid>
  );
}

// Define the props type for GroupsList
interface GroupsListProps {
  w?: string;
  myGroups: ChatGroup[];
  chatId?: string;
}

const GroupsList = ({ w = "100%", myGroups = [], chatId }: GroupsListProps) => {
  return (
    <Stack
      sx={{ width: w }}
      direction={"column"}
      overflow={"auto"}
      height={"100%"}
    >
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem key={group._id} group={group} chatId={chatId} />
        ))
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No Groups
        </Typography>
      )}
    </Stack>
  );
};

interface GroupListItemProps {
  group: ChatGroup;
  chatId?: string;
}

const GroupListItem = memo(({ group, chatId }: GroupListItemProps) => {
  const { name, avatar, _id } = group;
  return (
    <LinkComponent
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography textAlign={"center"}>{name}</Typography>
      </Stack>
    </LinkComponent>
  );
});

export default Groups;
