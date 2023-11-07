function serviceproviderShortText(description) {
  document.write(description.slice(0, 200) + "...");
}

function serviceproviderCheckVerified(verified) {
  if (verified == "yes") {
    document.write('<h6 class= "bg-success" >Zweryfikowany</h6>');
  } else if (verified == "no") {
    document.write('<h6 class= "bg-danger" >Oczekuje na weryfikację</h6>');
  } else {
    document.write('<h6 class= "bg-warning" >Błąd weryfikacji</h6>');
  }
}

function ChangeActiveNavbar(toChange) {
  let tempActive = document.getElementsByClassName("active");
  tempActive[0].classList.remove("active");
  let tempNewActive = document.getElementById(toChange);
  tempNewActive.classList.add("active");
}

var currentUrl = window.location.pathname;
var currentUrlCorrect = currentUrl.substring(1);
if (window.location) {
  switch (currentUrlCorrect) {
    case "about":
      ChangeActiveNavbar("navabout");
      break;
    case "login":
      ChangeActiveNavbar("navlogin");
      break;
    case "register":
      ChangeActiveNavbar("navregister");
      break;
    case "calendar":
      ChangeActiveNavbar("navcalendar");
      break;
    case "serviceproviders":
      ChangeActiveNavbar("navserviceproviders");
      break;
    case "userdashboard":
      ChangeActiveNavbar("navuserdashboard");
      break;
    case "registerserviceprovider":
      ChangeActiveNavbar("navregisterserviceprovider");
      break;
    default:
  }
}
