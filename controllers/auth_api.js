const User = require("../models/user");
const Listing = require("../models/listing");
const passport = require("passport");
const shortid = require("shortid");

module.exports.signupStudent = async (req, res) => {
    try {
        const { username, email, password, collegeName, currentYear, enrollmentNumber } = req.body;

        // Validate required fields
        if (!email || !password || !collegeName || !currentYear || !enrollmentNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newUser = new User({
            email,
            username: username || email.split('@')[0], // Fallback username
            role: "student",
            collegeName,
            currentYear,
            enrollmentNumber
        });

        const registeredUser = await User.register(newUser, password);

        // Auto login after signup
        req.login(registeredUser, (err) => {
            if (err) return res.status(500).json({ message: "Login failed after signup", error: err.message });
            res.status(201).json({ message: "Student registered successfully", user: registeredUser });
        });

    } catch (e) {
        console.error("Student Signup Error:", e);
        res.status(400).json({ message: e.message });
    }
};

module.exports.signupAdmin = async (req, res) => {
    try {
        const {
            collegeEmail, // used as email
            password,
            collegeName, // used as listing title
            description,
            nrifRanking,
            totalStudents,
            totalCounselors,
            location, // listing fields
            country,
            price
        } = req.body;

        // Check for file uploads (expecting at least 2 images, but for now we might just take one or the first one as main image)
        // Adjusting to current Listing model which has single 'image' object or we might need to handle multiple.
        // The implementation plan mentioned "at least two", but the Model has { url, filename }.
        // For now, we will use the first uploaded file as the main image.

        let image = { url: "https://images.unsplash.com/photo-1625246333195-981d549e729a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sbGVnZSUyMGNhbXB1c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", filename: "default" };
        if (req.file) {
            image = { url: req.file.path, filename: req.file.filename };
        }

        const passKey = shortid.generate();

        const newAdmin = new User({
            email: collegeEmail,
            username: collegeName.replace(/\s+/g, '_').toLowerCase() + "_" + shortid.generate(), // unique username
            role: "admin",
            passKey
        });

        const registeredAdmin = await User.register(newAdmin, password);

        // Create the College Listing
        const newListing = new Listing({
            title: collegeName,
            description,
            image,
            price: price || 0, // maybe application fee?
            location: location || "Unknown",
            country: country || "India",
            nrifRanking,
            totalStudents,
            totalCounselors,
            owner: registeredAdmin._id
        });

        await newListing.save();

        req.login(registeredAdmin, (err) => {
            if (err) return res.status(500).json({ message: "Login failed after signup", error: err.message });
            res.status(201).json({
                message: "College Admin registered successfully",
                user: registeredAdmin,
                listing: newListing,
                passKey: passKey
            });
        });

    } catch (e) {
        console.error("Admin Signup Error:", e);
        res.status(400).json({ message: e.message });
    }
};

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ message: "Internal Server Error", error: err.message });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: "Login failed", error: err.message });
            res.json({ message: "Logged in successfully", user });
        });
    })(req, res, next);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Logout failed", error: err.message });
        res.json({ message: "Logged out successfully" });
    });
};

module.exports.updateUser = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });

        const { collegeName, enrollmentNumber, currentYear } = req.body;
        const userId = req.user._id;

        // Fields to update
        const updates = {};
        if (collegeName) updates.collegeName = collegeName;
        if (enrollmentNumber) updates.enrollmentNumber = enrollmentNumber;
        if (currentYear) updates.currentYear = currentYear;

        // Perform update
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (e) {
        console.error("Update User Error:", e);
        res.status(500).json({ message: "Failed to update profile", error: e.message });
    }
};
