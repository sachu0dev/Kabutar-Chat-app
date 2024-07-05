import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSedFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearchMenu } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

function Search() {
  const search = useInputValidation("");
  const { isSearchMenu } = useSelector((state: RootState) => state.misc);
  const dispatch = useDispatch();

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSedFriendRequestMutation
  );

  const [users, setUsers] = useState([]);
  const addFriendHandler = async (id) => {
    await sendFriendRequest("Send friend request", { userId: id });
  };

  const searchCloseHandler = () => {
    dispatch(setIsSearchMenu(false));
  };

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      searchUser(search.value).then((data) => setUsers(data.data.users));
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [search.value]);
  return (
    <Dialog open={isSearchMenu} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
}

export default Search;
