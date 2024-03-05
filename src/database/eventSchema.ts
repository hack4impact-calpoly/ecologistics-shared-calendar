import mongoose, { Schema, Document } from "mongoose";

// Interface for the Event document
interface EventDocument extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
}

// Schema for the Event
const EventSchema: Schema<EventDocument> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
});

// Export the Event model based on the schema
const EventModel =
  mongoose.models.Events ||
  mongoose.model<EventDocument>("Events", EventSchema);

export default EventModel;