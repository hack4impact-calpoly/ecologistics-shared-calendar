import mongoose, { Schema, Document } from "mongoose";

// Interface for the Event document
interface EventDocument extends Document {
  title: string;
  description: string;
  date: Date;
  status: Number;
  location: Location;
  image: string;
}

interface Location {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: false },
  isVirtual: { type: Boolean, required: true },
  location: {
    type: {address: String, required: true},
  },
  status: { type: Number, required: true, default: 0 }, //Idea: 0 pending, 1 approved, -1 or 2 denied
  imageLink: { type: String, required: false }
}, {
  timestamps: true 
});

// Export the Event model based on the schema
const EventModel =
  mongoose.models.Events ||
  mongoose.model<EventDocument>("Events", EventSchema);

export default EventModel;
