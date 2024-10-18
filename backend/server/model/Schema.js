import { union } from 'zod';

const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  salt: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ["admin", "driver", "user"],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: function () { return this.role === 'driver'; } // Only required for drivers
    },
    coordinates: {
      type: [Number],
      required: function () { return this.role === 'driver'; }
    }
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () { return this.role === 'driver'; }
  }
}, { timestamps: true });

// Vehicle schema
const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  capacity: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["available", "in transit", "maintenance"],
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Booking schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  pickupAddress: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    street: { type: String, required: true },
    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  dropAddress: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    street: { type: String, required: true },
    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  pickupDate: {
    type: Date,
    required: true
  },
  estimatedPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "enroute to pickup", "enroute to drop", "cancelled", "delivered"],
    required: true,
    default: "pending"
  },
  approvals: {
    type: String,
    enum: ["approved", "not approved"],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  allocatedDriverPhone: {
    type: String
  },
  cost: {
    type: Number
  }
}, { timestamps: true });

// Jobs schema
const jobsSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  approvals: {
    type: String,
    enum: ["approved", "not approved"],
    required: true
  },
  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  jobStatus: {
    type: String,
    enum: ["pending", "enroute to pickup", "enroute to drop", "cancelled", "delivered"],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  }
}, { timestamps: true });

// Fleet schema
const fleetSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fleet: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle"
  }],
  drivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

userSchema.index({ currentLocation: '2dsphere' });


export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export const Job = mongoose.models.Job || mongoose.model('Job', jobsSchema);
export const Fleet = mongoose.models.Fleet || mongoose.model('Fleet', fleetSchema);

// export {
//   User,
//   Vehicle,
//   Booking,
//   Job,
//   Fleet,
// };