function serviceproviderShortText(description) {
  console.log(description);
  document.write(description.slice(0, 200) + "...");
}

function serviceproviderCheckVerified(verified) {
  console.log(verified);
  if (verified == "yes") {
    console.log(verified);
    document.write('<h6 class= "bg-success" >Zweryfikowany</h6>');
  } else if (verified == "no") {
    document.write('<h6 class= "bg-danger" >Oczekuje na weryfikację</h6>');
  } else {
    document.write('<h6 class= "bg-warning" >Błąd weryfikacji</h6>');
  }
}
