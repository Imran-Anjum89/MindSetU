if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cors = require("cors");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routers
const listingRouter = require("./classroom/routes/listing.js");
const apiListingRouter = require("./classroom/routes/api_listings.js");
const apiAuthRouter = require("./classroom/routes/api_auth.js");
const reviewRouter = require("./classroom/routes/review.js");
const userRouter = require("./classroom/routes/user.js");
const appointmentRoutes = require("./classroom/routes/appointment.js");

// MongoDB Connection
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("MongoDB connection successful.");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// App Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());

// Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Mongo-session store error", err);
});

const sessionOptions = {
  store: store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash + user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Demo User (for testing)
app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student",
    role: "student", // Explicit role
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

// Routes
app.use("/api/auth", apiAuthRouter);
app.use("/api/listings", apiListingRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/listings/:listingId/appointments", appointmentRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Page not found!");
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";

  // For API routes, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(statusCode).json({
      error: err.message,
      statusCode: statusCode
    });
  }

  // For traditional routes, render EJS template
  res.status(statusCode).render("error", { err });
});

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000.");
});
