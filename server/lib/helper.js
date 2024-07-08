import { userSocketIDs } from "../index.js"

export const getOtherMembers = (members, userId)=> {
  return members.find((member)=> member._id.toString() !== userId.toString())
}


export const getSockets = (users = []) => {
  const sockets = users.map((user) => {
    const userId = user.toString(); // Convert ObjectId to string
    const socketId = userSocketIDs.get(userId);
    if (!socketId) {
      console.warn(`Socket ID not found for user: ${userId}`);
      return null;
    }
    return socketId.toString();
  }).filter(socketId => socketId); // Filter out null values

  return sockets;
};




  export const getBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  };
