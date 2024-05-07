import mongoose, { Schema, Document } from "mongoose";
const EventSchema = new Schema(
  {
    organization: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: false },
    isVirtual: { type: Boolean, required: true },
    location: {
      type: String,
      required: true,
    },
    status: { type: String, required: true, default: "Pending" },
    deniedReason: { type: String, required: false },
    imageLink: { type: String, required: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    _id: { type: mongoose.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);
// For type inference that matches the schema.
// THIS MUST MATCH THE SCHEMA
export type EventDocument = {
  organization: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  isVirtual: boolean;
  location: string;
  status: string;
  deniedReason?: string;
  imageLink?: string;
  createdBy: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
};
// Export the Event model based on the schema
const EventModel =
  mongoose.models.Events ||
  mongoose.model<EventDocument>("Events", EventSchema);
export default EventModel;
