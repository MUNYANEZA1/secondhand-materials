import mongoose, { Document, Schema } from 'mongoose';

export interface IRide extends Document {
  type: 'offer' | 'request';
  user: mongoose.Schema.Types.ObjectId; // User offering or requesting the ride
  origin: string;
  originCoords?: { lat: number; lng: number }; // Optional: for map integration
  destination: string;
  destinationCoords?: { lat: number; lng: number }; // Optional: for map integration
  date: Date;
  time: string; // e.g., "14:30"
  availableSeats?: number; // For 'offer' type
  seatsNeeded?: number; // For 'request' type
  price: number; // Price per seat for 'offer', or proposed contribution for 'request'
  description?: string;
  preferences?: string[];
  car?: {
    make?: string;
    model?: string;
    color?: string;
    licensePlate?: string; // Consider privacy implications if displaying widely
  };
  passengers?: Array<{
    userId: mongoose.Schema.Types.ObjectId;
    name: string; // Denormalized
    seatsBooked: number;
    bookingStatus: 'pending' | 'confirmed' | 'cancelled';
  }>; // For 'offer' type, list of users who booked
  status: 'active' | 'full' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const rideSchema = new Schema<IRide>(
  {
    type: { type: String, enum: ['offer', 'request'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origin: { type: String, required: true, trim: true },
    originCoords: { lat: Number, lng: Number },
    destination: { type: String, required: true, trim: true },
    destinationCoords: { lat: Number, lng: Number },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Consider validation for format HH:mm
    availableSeats: { type: Number, min: 0 }, // Required if type is 'offer'
    seatsNeeded: { type: Number, min: 1 },    // Required if type is 'request'
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    preferences: [{ type: String, trim: true }],
    car: {
      make: { type: String, trim: true },
      model: { type: String, trim: true },
      color: { type: String, trim: true },
      licensePlate: { type: String, trim: true }, // Encrypt or handle with care
    },
    passengers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        seatsBooked: { type: Number, required: true, min: 1 },
        bookingStatus: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
        _id: false,
      }
    ],
    status: {
      type: String,
      enum: ['active', 'full', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

rideSchema.index({ type: 1, date: 1, origin: 'text', destination: 'text', status: 1 });
rideSchema.index({ user: 1, type: 1 });

// Validation based on type
rideSchema.pre('save', function (next) {
  if (this.type === 'offer' && (this.availableSeats === undefined || this.availableSeats < 0)) {
    return next(new Error('Available seats must be specified for ride offers.'));
  }
  if (this.type === 'request' && (this.seatsNeeded === undefined || this.seatsNeeded <= 0)) {
    return next(new Error('Seats needed must be specified for ride requests.'));
  }
  if (this.type === 'offer' && this.passengers) {
    const confirmedSeats = this.passengers
        .filter(p => p.bookingStatus === 'confirmed')
        .reduce((sum, p) => sum + p.seatsBooked, 0);
    if (confirmedSeats >= (this.availableSeats || 0)) {
        this.status = 'full';
    } else {
        // If not full, and was previously full but now has space, set back to active
        if(this.status === 'full' && confirmedSeats < (this.availableSeats || 0)) {
             this.status = 'active';
        }
    }
  }
  next();
});

const Ride = mongoose.model<IRide>('Ride', rideSchema);

export default Ride;
