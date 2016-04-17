var base = new Firebase('https://french-demo.firebaseio.com');

var auth = base.getAuth();

if (auth) {
  location.href = '.';
} else {
  console.log('not logged in');
}

base.onAuth(function(authData){
  if (authData) {
    location.href = '.';
  } else {
    console.log('not logged in');
  }
});

var auth = function(service) {
  console.log('logging in');
  base.authWithOAuthPopup(service, function(error, authData) {
    if (error) {
      console.warn('Login Failed!', error);
    } else {
      location.href = '.';
    }
  });
};

document.getElementById('login').addEventListener('click',function(e){
  e.preventDefault();
  auth('facebook');
});
