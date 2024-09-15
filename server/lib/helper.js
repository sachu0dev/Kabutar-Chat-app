import { userSocketIDs } from "../index.js"

export const getOtherMembers = (members, userId)=> {
  return members.find((member)=> member._id.toString() !== userId.toString())
}


export const getSockets = (users = []) => {


  const sockets = users.map((user) => {
    const userId = user.toString(); 
    const socketId = userSocketIDs.get(userId);

    if (!socketId) {
      console.warn(`Socket ID not found for user: ${userId}`, userSocketIDs);
      return null;
    }

    return socketId.toString();
  }).filter(socketId => socketId);

  // console.log("Resulting socket IDs:", sockets);
  return sockets;
};




  export const getBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  };
