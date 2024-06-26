import { userSocketIDs } from "../index.js"

export const getOtherMembers = (members, userId)=> {
  return members.find((member)=> member._id.toString() !== userId.toString())
}


export const getSockets = (users = [])=> {
  return users.map((user)=> userSocketIDs.get(user._id)).toString()}


  export const getBase64 = (file)=> {
    return `data:${file.type};base64,${file.buffer.toString("base64")}`
  }