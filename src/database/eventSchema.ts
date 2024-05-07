import mongoose, { Schema, Document } from "mongoose";
const EventSchema = new Schema(
  {
    organization: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    time: { type: String, requred: true },
    description: { type: String, required: false },
    isVirtual: { type: Boolean, required: true },
    location: {
      type: String,
      required: true,
    },
    status: { type: String, required: true, default: 0 },
    imageLink: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
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
  time: string;
  description?: string;
  isVirtual: boolean;
  location: string;
  status: string;
  imageLink?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  _id: string;
};
// Export the Event model based on the schema
const EventModel =
  mongoose.models.Events ||
  mongoose.model<EventDocument>("Events", EventSchema);
export default EventModel;
