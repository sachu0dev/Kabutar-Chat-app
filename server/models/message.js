import mongoose , {Schema, model} from "mongoose";



const schema = new Schema({
  content: String,
  attachments: {
    public_id: {
      tyle: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  sender: {
    type: Types.ObjectId,
    ref: "User",
    requried: true
  },
  chat: {
    type: Types.ObjectId,
    ref: "Chat",
    requried: true
  },
},{
  timestamps: true
});


export const Message = mongoose.models.Message ||  model("Message", schema)