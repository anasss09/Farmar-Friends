import mongoose, { Schema } from "mongoose";

const farmerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // This ensures one farmer profile per user
    },

    weather: {
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
      monsoon: {
        type: String, // "Rainy", "Cloudy", "Clear"
        required: true,
      },
      humidity: {
        type: Number,
        required: true,
      },
      temperature: {
        type: Number,
        required: true,
      }
    },

    soil: {
      soil_type: {
        type: String,
        default: null
      },
      probability: {
        type: Number,
        default: null
      }
    },

    farm: {
      location: {
        type: String, // e.g., "Delhi, India"
      },
      soilType: {
        type: String, // "Loamy", "Sandy", etc.
      },
      crops: [
        {
          type: String, // e.g., "Rice", "Wheat"
        },
      ],
      area: {
        type: String, // in acres/hectares
      },
    },

    forumPost: [
      {
        userImage: {
          type: String,
        },
        message: {
          type: String,
        },
        username: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      },
    ],
  },
  { timestamps: true }
);

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;