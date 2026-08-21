const mongoose = require("mongoose");

const applicationSettingSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },

    startDate: {
      type: Date,
      required: [true, "Application start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "Application end date is required"],

      validate: {
        validator: function (value) {
          return value > this.startDate;
        },

        message: "Application end date must be after the start date.",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ApplicationSetting",
  applicationSettingSchema
);