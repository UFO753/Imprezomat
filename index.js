const express = require("express");
const mongoose = require("mongoose");
const app = express();
exports.app = app;
const port = 3000;
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const { name } = require("ejs");
const LocalStrategy = require("passport-local").Strategy;

mongoose.connect("mongodb://127.0.0.1:27017/imprezomat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Błąd połączenia z bazą danych:", error);
});
db.once("open", () => {
  console.log("Połączono z bazą danych!");
});

db.on("disconnected", () => {
  console.log("Połączenie z bazą danych zostało przerwane.");
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  groupID: String,
  email: String,
  superadmin: String,
  image: String,
});

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true },
  userpicture: String,
});

const serviceprovider = new mongoose.Schema({
  globalname: { type: String, required: true },
  description: { type: String, required: true },
  category1: String,
  category2: String,
  category3: String,
  photo: String,
  photo1: String,
  photo2: String,
  photo3: String,
  photo4: String,
  photo5: String,
  photo6: String,
  isverified: String,
  reviews: [reviewSchema],
});

const User = mongoose.model("User", userSchema, "users");
exports.User = User;

const ServiceProviderModel = mongoose.model(
  "ServiceProviderModel",
  serviceprovider,
  "servicesproviders"
);

app.get("/serviceprovidersaa", async (req, res) => {});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  require("express-session")({
    secret: "keyboarddog",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, {
          message: "Nieprawidłowa nazwa użytkownika.",
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Nieprawidłowe hasło." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

app.get("/", async (req, res) => {
  try {
    let allServiceProviders = await ServiceProviderModel.find();
    res.render("pages/index", {
      user: req.user,
      allServiceProviders: allServiceProviders,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/serviceproviders", async (req, res) => {
  try {
    let allServiceProviders = await ServiceProviderModel.find();
    res.render("pages/serviceproviders", {
      user: req.user,
      allServiceProviders: allServiceProviders,
    });
  } catch (error) {
    console.error(error);
  }
});
app.get("/calendar", function (req, res) {
  res.render("pages/calendar", { user: req.user });
});
app.get("/login", function (req, res) {
  res.render("pages/login", { user: req.user });
});
app.get("/about", function (req, res) {
  res.render("pages/about", { user: req.user });
});
app.get("/userdashboard", function (req, res) {
  res.render("pages/userdashboard", { user: req.user });
});
app.get("/update-data", function (req, res) {
  res.render("pages/userdashboard", { user: req.user });
});

app.get("/serviceproviderfull/:id", async (req, res) => {
  try {
    const checkserviceprovider = await ServiceProviderModel.findOne({
      _id: req.params.id,
    });
    res.render("pages/serviceproviderfull", {
      user: req.user,
      serviceprovider: checkserviceprovider,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/registerserviceprovider", function (req, res) {
  res.render("pages/registerserviceprovider", {
    user: req.user,
  });
});

app.post("/serviceproviderfull/:id/add-review", async (req, res) => {
  try {
    const { username, comment } = req.body;
    const userpicture = req.user.image;
    console.log(req.user.image);
    const date = new Date().toDateString();
    const CurrentServiceProvider = await ServiceProviderModel.findById(
      req.params.id
    );
    CurrentServiceProvider.reviews.push({
      username,
      comment,
      userpicture,
      date,
    });
    await CurrentServiceProvider.save();

    res.redirect(`/serviceproviderfull/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/verifyserviceprovider/:id", async (req, res) => {
  try {
    let isverified = "yes";
    let updatedServiceProvider = await ServiceProviderModel.findOneAndUpdate(
      { _id: req.params.id },
      { isverified },
      { new: true }
    );
    if (!updatedServiceProvider) {
      return res.status(404).json({
        success: false,
        message: "Dostawca usług nie został znaleziony",
      });
    }
    res.redirect("/serviceproviders");
  } catch (error) {
    console.error(error);
  }
});

app.post("/deleteserviceprovider/:id", async (req, res) => {
  try {
    let updatedServiceProvider = await ServiceProviderModel.deleteOne({
      _id: req.params.id,
    });
    if (!updatedServiceProvider) {
      return res.status(404).json({
        success: false,
        message: "Dostawca usług nie został znaleziony",
      });
    }
    res.redirect("/serviceproviders");
  } catch (error) {
    console.error(error);
  }
});

app.post("/uploadprofilepicture/:id", async (req, res) => {
  const { image } = req.body;
  try {
    console.log(image);
    let existingUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { image: image },
      { new: true }
    );
    console.log(existingUser);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Użytkownik nie został znaleziony" });
    }
    res.redirect("/userdashboard");
  } catch (error) {
    console.error(error);
  }
});

app.get("/register", function (req, res) {
  res.render("pages/register", {
    message: req.flash("message"),
    user: req.user,
  });
});

app.get("/", isAuthenticated, (req, res) => {
  res.render("pages/userdashboard");
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
});
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      req.flash("message", "Użytkownik o tej nazwie już istnieje.");
      return res.redirect("/register");
    }
    let image = "https://i.imgur.com/tGh9Ii7.png";
    let superadmin = "no";
    const newUser = new User({
      username,
      password: bcrypt.hashSync(password, 10),
      email,
      superadmin,
      image,
    });
    await newUser.save();

    req.flash(
      "message",
      "Rejestracja zakończona sukcesem. Teraz możesz się zalogować."
    );
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.redirect("/register");
  }
});

app.post("/registerserviceprovider", async (req, res) => {
  const {
    globalname,
    description,
    category1,
    category2,
    category3,
    photo,
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    photo6,
    isverified,
  } = req.body;

  try {
    const newServiceProviderModel = new ServiceProviderModel({
      globalname,
      description,
      category1,
      category2,
      category3,
      photo,
      photo1,
      photo2,
      photo3,
      photo4,
      photo5,
      photo6,
      isverified,
    });
    await newServiceProviderModel.save();

    req.flash("message", "Rejestracja zakończona sukcesem.");
    res.redirect("/serviceproviders");
  } catch (error) {
    console.error(error);
    res.redirect("/registerserviceprovider");
  }
});

app.post("/userdashboard/:id", async (req, res) => {
  const { username, firstname, lastname, email, groupID } = req.body;
  try {
    const existingUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { username, firstname, lastname, email },
      { new: true }
    );

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Użytkownik nie został znaleziony" });
    }
    res.status(200).json({
      success: true,
      message: "Aktualizacja danych przebiegła pomyślnie.",
    });
    res.redirect("/userdashboard");
  } catch (error) {
    console.error(error);
    res
      .status(200)
      .json({ success: false, message: "Błąd podczas aktualizacji danych." });
    res.redirect("/userdashboard");
  }
});

//app.use("/", routes);
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.listen(port, () =>
  console.log(`Aplikacja express została uruchomiona na porcie ${port}!`)
);
