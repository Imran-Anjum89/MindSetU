const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    enrollmentNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    preferredDate: {
        type: Date,
        required: true
    },
    preferredTime: {
        type: String,
        required: true
    },
    sessionType: {
        type: String,
        enum: ['individual', 'group', 'crisis', 'academic', 'career', 'stress'],
        required: true
    },
    additionalNotes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes for better query performance
appointmentSchema.index({ bookedBy: 1 });
appointmentSchema.index({ preferredDate: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);