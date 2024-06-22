import mongoose , {Schema, model} from "mongoose";


const schema = new Schema({

  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "rejected"]
  },
  sender: {
    type: Types.ObjectId,
    ref: "User",
    requried: true
  },
  receiver: {
    type: Types.ObjectId,
    ref: "User",
    requried: true
  },
},{
  timestamps: true

});


export const Request = mongoose.models.Request ||  model("Request", schema)