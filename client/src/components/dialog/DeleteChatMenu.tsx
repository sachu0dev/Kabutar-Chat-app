import { Menu, Stack, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc';
import { Delete, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAsyncMutation } from '../../hooks/hook';
import { useDeleteChatMutation } from '../../redux/api/api';
import { useEffect } from 'react';
import { RootState } from '../../redux/store';


const DeleteChatMenu = ({dispatch, deleteMenuAnchore }) => {

  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector((state: RootState) => state.misc);
  const isGroup = selectedDeleteChat.groupChat;

  const [deleteChat,_,deleteChatData] = useAsyncMutation(useDeleteChatMutation)

  
  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchore.current = null;
  }

  const leaveGroupHandler = ()=> {}
  const deleteChatHandler = () => {
    closeHandler();
    console.log(selectedDeleteChat.chatId);
    
    deleteChat("Deleting Chat...", { chatId: selectedDeleteChat.chatId });
  }

  useEffect(()=> {
    if(deleteChatData) navigate("/")
  },[deleteChatData])
  return (
    <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchore.current} anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}>
      <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer"
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {selectedDeleteChat.groupChat?(<><ExitToApp/><Typography>leave group</Typography></>): (<><Delete/><Typography>delete chat</Typography></>)}
      </Stack>
    </Menu>
  )
}

export default DeleteChatMenu