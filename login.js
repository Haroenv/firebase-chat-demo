firebase.initializeApp({
  apiKey: "AIzaSyDZ922NLoAuIOfqrMCDMkWwSRSU0ejSoyA",
  authDomain: "french-demo.firebaseapp.com",
  databaseURL: "https://french-demo.firebaseio.com",
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    location.href = '.';
  } else {
    // No user is signed in.
    console.log('not yet logged in');
  }
});

var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('public_profile');

document.getElementById('login').addEventListener('click',function(e){
  e.preventDefault();
  firebase.auth().signInWithRedirect(provider)
    .then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log(result);
      location.href = '.';
    })
    .catch(function(error) {
      console.warn("error while signing in 😢",error);
  });
});
