const express = require("express");
const mongoose = require("mongoose");
const app = express();
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
});

const serviceprovider = new mongoose.Schema({
  globalname: String,
  description: String,
  category1: String,
  category2: String,
  category3: String,
  photo: String,
  isverified: String,
});

const User = mongoose.model("User", userSchema, "users");

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

app.get("/", function (req, res) {
  res.render("pages/index", { user: req.user });
});

app.get("/serviceproviders", async (req, res) => {
  try {
    const allServiceProviders = await ServiceProviderModel.find();
    console.log(allServiceProviders);
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

app.get("/registerserviceprovider", function (req, res) {
  res.render("pages/registerserviceprovider", {
    user: req.user,
  });
});

app.get("/register", function (req, res) {
  res.render("pages/register", {
    message: req.flash("message"),
    user: req.user,
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

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

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      req.flash("message", "Użytkownik o tej nazwie już istnieje.");
      return res.redirect("/register");
    }

    const newUser = new User({
      username,
      password: bcrypt.hashSync(password, 10),
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
    isverified,
  } = req.body;

  console.log(req.body);

  try {
    const newServiceProviderModel = new ServiceProviderModel({
      globalname,
      description,
      category1,
      category2,
      category3,
      photo,
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

app.post("/update-data", async (req, res) => {
  //nie działą do naprawienia lol
  const { username, firstname, lastname, groupID } = req.body;
  console.log(firstname);
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      existingUser.firstname = firstname;
      existingUser.lastname = lastname;
      existingUser.groupID = groupID;

      await existingUser.save();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd podczas aktualizacji danych");
  }
});

//app.use("/", routes);
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.listen(port, () =>
  console.log(`Aplikacja express została uruchomiona na porcie ${port}!`)
);
