firebase.initializeApp({
  apiKey: "AIzaSyDZ922NLoAuIOfqrMCDMkWwSRSU0ejSoyA",
  authDomain: "french-demo.firebaseapp.com",
  databaseURL: "https://french-demo.firebaseio.com",
});

var base = firebase.database().ref('/');


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log('logged in with',user);
  } else {
    // No user is signed in.
    location.href = 'login.html';
  }
});


// HTML Escape helper utility
var util = (function() {
  // Thanks to Andrea Giammarchi
  var
    reEscape = /[&<>'"]/g,
    reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g,
    oEscape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    },
    oUnescape = {
      '&amp;': '&',
      '&#38;': '&',
      '&lt;': '<',
      '&#60;': '<',
      '&gt;': '>',
      '&#62;': '>',
      '&apos;': "'",
      '&#39;': "'",
      '&quot;': '"',
      '&#34;': '"'
    },
    fnEscape = function(m) {
      return oEscape[m];
    },
    fnUnescape = function(m) {
      return oUnescape[m];
    },
    replace = String.prototype.replace;
  return (Object.freeze || Object)({
    escape: function escape(s) {
      return replace.call(s, reEscape, fnEscape);
    },
    unescape: function unescape(s) {
      return replace.call(s, reUnescape, fnUnescape);
    }
  });
}());

// Tagged template function
function html(pieces) {
  var result = pieces[0];
  var substitutions = [].slice.call(arguments, 1);
  for (var i = 0; i < substitutions.length; ++i) {
    result += util.escape(substitutions[i]) + pieces[i + 1];
  }
  return result;
}


document.getElementById('input').addEventListener('submit', function(e) {
  e.preventDefault();
  base.child('messages').push({
    time: new Date().getTime(),
    user: {
      name: firebase.auth().currentUser.providerData[0].displayName,
      img: firebase.auth().currentUser.providerData[0].photoURL
    },
    message: document.getElementById('message').value
  });
  e.target.reset();
});

function add(data) {
  var date = new Date(data.time);
  var image = data.user.img;
  var name = data.user.name;
  var message = data.message;
  var datetime = date.toISOString();
  var hours = date.getHours();
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var m = document.createElement('div');
  m.className = 'message';
  m.innerHTML = html`
  <img src="${image}" title="${name}" alt="${name}" class="message--item message--item__image">
  <p class="message--item message--item__text">${message}</p>
  <time datetime="${datetime}" class="message--item message--item__time">${hours}:${minutes}</time>`;
  document.getElementById('messages').appendChild(m);
  m.scrollIntoView({
    behaviour: 'smooth'
  });
}

base.child('messages').limitToLast(10).on('child_added', function(snap) {
  add(snap.val());
});

document.getElementById('logout').addEventListener('click',function(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    location.href = "login.html";
  }, function(error) {
    // An error happened.
    alert('An error has occured while signing out. Try again.');
  });
});
