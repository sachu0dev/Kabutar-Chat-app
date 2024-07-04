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
import { sampleUsers } from "../../constants/sampleData";
import {
  useLazySearchUserQuery,
  useSedFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearchMenu } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";
import toast from "react-hot-toast";
import { Message } from "../../../../server/models/message";

function Search() {
  const search = useInputValidation("");
  const { isSearchMenu } = useSelector((state: RootState) => state.misc);
  const dispatch = useDispatch();

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest] = useSedFriendRequestMutation();

  let isLoadingSendFriendRequest = false;

  const [users, setUsers] = useState([]);
  const addFriendHandler = async (id) => {
    try {
      const res = await sendFriendRequest({ userId: id });
      if (res.data) {
        toast.success(res.data.message);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
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
