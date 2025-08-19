import { Currency } from "lucide-react";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [1000, "Price cannot exceed 1000"],
    },
    Currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["IQD", "EUR", "GBP", "INR", "JPY"],
      default: "IQD",
    },
    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["sports", "news", "lifestyle", "entertainment", "education"],
      default: "sports",
    },
    PaymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "canceled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: (value) => value > this.startDate,
        message: "renewalDate  most be in the past",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      indexed,
    },
  },
  { Timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriod = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriod[this.frequency]
    );
  }

  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});

const subscription= mongoose.model('Subscription', subscriptionSchema);

export default subscription;