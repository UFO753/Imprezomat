const { app, User } = require(".");

app.post("/userdashboard", async (req, res) => {
  //nie działą do naprawienia lol
  const { username, firstname, lastname, groupID } = req.body;
  console.log(req.body);
  try {
    const existingUser = await User.findOneAndUpdate(
      { username: username },
      { $set: { username, firstname, lastname } },
      { new: true }
    );
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony" });
    }
    res.redirect("/userdashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd podczas aktualizacji danych");
    res.redirect("/userdashboard");
  }
});
