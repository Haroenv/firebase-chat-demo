var base = new Firebase('https://french-demo.firebaseio.com');

var auth = base.getAuth();

if (auth) {
  console.log('logged in with: '+auth.uid);
  location.href = '.';
} else {
  console.log('not logged in');
}

var auth = function(service) {
  console.log('logging in');
  base.authWithOAuthPopup(service, function(error, authData) {
    if (error) {
      console.warn('Login Failed!', error);
    } else {
      // make a new account if it didn't exist yet
      base.child('users').child(authData.uid).once('value', function(snapshot){
        if (!snapshot.exists()) {
          base.child('users').child(authData.uid).set({
            provider: authData.provider,
            name: getName(authData)
          });
        }
      });
    }
  });
};

document.getElementById('login').addEventListener('click',function(e){
  e.preventDefault();
  auth('facebook');
});
