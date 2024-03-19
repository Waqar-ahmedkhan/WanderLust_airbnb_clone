if (process.env.NODE_ENV != "producation") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const session = require("express-session");
const Mongostore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./Routes/user.js");
const { env } = require("process");
const { error } = require("console");

const dbURL = process.env.ATLASDB_URL;
main()
  .then((res) => {
    console.log("💻 Mongodb Connected");
  })
  .catch((err) => {
    console.error(err);
  });
async function main() {
  await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

const store = Mongostore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR: in MONGO Seesion Store", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.send("hey, i am root ");
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "waqarahmed@gmail.com",
//     username: "delta_student",
//   });
//   let newUser = await User.register(fakeUser, "vickikhan");
//   res.send(newUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get("/testlisting", async (req, res) => {
//   let simpleListing = new Listing({
//     title: "My new Villa",
//     description: "BY the beach",
//     price: 1200,
//     location: "kpk, kohat",
//     country: "pakistan",
//   });
//   await simpleListing.save();
//   console.log("sample saved ");
//   res.send("successfull test");
// });

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something  went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
