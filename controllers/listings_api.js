const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.json(allListings);
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner")
        .populate({
            path: "appointments",
            populate: {
                path: "student",
                select: "_id username email"
            }
        });

    if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
};

module.exports.createListing = async (req, res) => {
    try {
        const { path: url, filename } = req.file;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        console.error("API createListing error:", err);
        res.status(400).json({ error: err.message });
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (req.file) {
            const { path: url, filename } = req.file;
            listing.image = { url, filename };
            await listing.save();
        }
        res.json(listing);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing) {
        res.json({ message: "Listing deleted" });
    } else {
        res.status(404).json({ message: "Listing not found" });
    }
};
