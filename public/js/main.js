function serviceproviderShortText(description) {
  console.log(description);
  document.write(description.slice(0, 200) + "...");
}

function serviceproviderCheckVerified(verified) {
  console.log(verified);
  if (verified == "yes") {
    console.log(verified);
    document.write(
      '<h3 class= "serviceprovider-verification-true" >Zweryfikowany</h3>'
    );
  } else if (verified == "no") {
    document.write(
      '<h3 class= "serviceprovider-verification-false" >Oczekuje na weryfikację</h3>'
    );
  } else {
    document.write(
      '<h3 class= "serviceprovider-verification-error" >Błąd weryfikacji</h3>'
    );
  }
}
