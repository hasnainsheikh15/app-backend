import mongoose, { Schema } from "mongoose";

const subscriberModel = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Subscription = mongoose.model("Subscription", subscriberModel);
