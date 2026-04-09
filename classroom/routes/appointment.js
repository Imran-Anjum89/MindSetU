const express = require('express');
const router = express.Router();
const Appointment = require('../../models/appointment.js');
const { isLoggedIn } = require('../../middleware'); // ✅
// Assuming you have auth middleware

// Get all appointments for logged-in user
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const appointments = await Appointment.find({ bookedBy: req.user._id })
            .sort({ createdAt: -1 });
        res.render('appointments/index', { appointments });
    } catch (err) {
        req.flash('error', 'Something went wrong!');
        res.redirect('/listings');
    }
});

// Show form for new appointment
router.get('/new', isLoggedIn, (req, res) => {
    res.render('appointments/new');
});

// Create new appointment
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const appointmentData = {
            ...req.body,
            bookedBy: req.user._id
        };
        
        const appointment = new Appointment(appointmentData);
        await appointment.save();
        
        req.flash('success', 'Appointment booked successfully! You will receive confirmation within 24 hours.');
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to book appointment. Please try again.');
        res.redirect('/appointments/new');
    }
});

// Show specific appointment
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ 
            _id: req.params.id, 
            bookedBy: req.user._id 
        });
        
        if (!appointment) {
            req.flash('error', 'Appointment not found');
            return res.redirect('/appointments');
        }
        
        res.render('appointments/show', { appointment });
    } catch (err) {
        req.flash('error', 'Appointment not found');
        res.redirect('/appointments');
    }
});

// Show edit form
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ 
            _id: req.params.id, 
            bookedBy: req.user._id 
        });
        
        if (!appointment) {
            req.flash('error', 'Appointment not found');
            return res.redirect('/appointments');
        }
        
        if (appointment.status === 'completed') {
            req.flash('error', 'Cannot edit completed appointments');
            return res.redirect(`/appointments/${appointment._id}`);
        }
        
        res.render('appointments/edit', { appointment });
    } catch (err) {
        req.flash('error', 'Appointment not found');
        res.redirect('/appointments');
    }
});

// Update appointment
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, bookedBy: req.user._id },
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!appointment) {
            req.flash('error', 'Appointment not found');
            return res.redirect('/appointments');
        }
        
        req.flash('success', 'Appointment updated successfully!');
        res.redirect(`/appointments/${appointment._id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update appointment');
        res.redirect(`/appointments/${req.params.id}/edit`);
    }
});

// Delete appointment
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({ 
            _id: req.params.id, 
            bookedBy: req.user._id 
        });
        
        if (!appointment) {
            req.flash('error', 'Appointment not found');
            return res.redirect('/appointments');
        }
        
        req.flash('success', 'Appointment cancelled successfully');
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to cancel appointment');
        res.redirect('/appointments');
    }
});

module.exports = router;
