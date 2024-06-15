import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";

const NewGroup = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const groupName = useInputValidation("");

  const selectMembersHandler = (_id) => {
    console.log(_id);
  };

  const submitHandler = () => {
    console.log("submitHandler");
  };
  return (
    <Dialog open>
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
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectMembersHandler}
            />
          ))}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant="outlined" color={"error"} size="large">
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={submitHandler}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
