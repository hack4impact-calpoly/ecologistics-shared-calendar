import mongoose, { Schema, Document } from "mongoose";

// Interface for the Event document
interface EventDocument extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
}

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: false },
    isVirtual: { type: Boolean, required: true },
    location: {
      type: { street: String, city: String, state: String, postalCode: String },
      required: false,
    },
    virtualLocation: { type: String, required: false },
    status: { type: Number, required: true, default: 0 }, // Idea: 0 pending, 1 approved, -1 or 2 denied
    imageLink: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// Export the Event model based on the schema
const EventModel =
  mongoose.models.Events ||
  mongoose.model<EventDocument>("Events", EventSchema);

export default EventModel;
