const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    // Campus Details
    nrifRanking: Number,
    totalStudents: Number,
    totalCounselors: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    // ADD THIS: appointments reference
    appointments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        // Also delete associated appointments
        const Appointment = require("./appointment.js");
        await Appointment.deleteMany({ _id: { $in: listing.appointments } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;