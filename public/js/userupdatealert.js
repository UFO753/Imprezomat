document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  // Przygotuj dane w formacie JSON
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });
  // Wyślij żądanie do serwera

  console.log("funkcja się uruchamia");
  try {
    const response = await fetch("/userdashboard/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ustaw nagłówek typu treści na JSON
      },
      body: JSON.stringify(data),
    });

    const data = await response.json();
    console.log("Co dalej?");
    if (data.success) {
      wyswietlAlert("success", data.message);
    } else {
      wyswietlAlert("danger", data.message);
    }
  } catch (error) {
    console.error("Błąd:", error);
  }
});

function wyswietlAlert(typ, tekst) {
  const alertBox = document.getElementById("alertBox");
  alertBox.classList.remove("d-none");
  alertBox.classList.add(`alert-${typ}`);
  alertBox.textContent = tekst;

  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 5000); // Ukryj alert po 5 sekundach
}
