import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useInputValidation } from "6pp";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";
import { RootState } from "../../redux/store"; // Ensure RootState is imported correctly

interface User {
  _id: string;
}

const NewGroup = () => {
  const { isNewGroup } = useSelector((state: RootState) => state.misc); // Correct RootState type
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery("");

  const [newGroup, newGroupLoading] = useAsyncMutation(useNewGroupMutation);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Assuming _id is string

  const groupName = useInputValidation("");
  const errors = [{ isError, error }];

  useErrors(errors);

  const selectMembersHandler = (_id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(_id)
        ? prev.filter((currElement) => currElement !== _id)
        : [...prev, _id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name cannot be empty");
    if (selectedUsers.length < 2)
      return toast.error("Group should have at least two members");
    newGroup("Creating New Group..", {
      name: groupName.value,
      members: selectedUsers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
    groupName.clear(); // Use clear method to reset input
    setSelectedUsers([]);
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data.friends?.map((user: User) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMembersHandler}
                isAdded={selectedUsers.includes(user._id)}
                handerIsLoading={isLoading}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button
            variant="outlined"
            color={"error"}
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={newGroupLoading}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
