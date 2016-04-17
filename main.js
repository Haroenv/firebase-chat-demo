var base = new Firebase('https://french-demo.firebaseio.com');

var auth = base.getAuth();
if (auth) {
  console.log('logged in with: '+auth.uid);
} else {
  console.warn('not logged in');
  location.href = 'login.html';
}

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
      name: 'Haroen Viaene',
      img: 'https://lh6.googleusercontent.com/-K3zTbtIokhQ/AAAAAAAAAAI/AAAAAAAABp8/XW4ywobvmdM/photo.jpg?sz=30'
    },
    message: document.getElementById('message').value
  });
  document.getElementById('message').value = '';
});

var add = function(data) {
  var image, name, message, datetime, hours, minutes;
  var date = new Date(data.time);
  var image = data.user.img;
  var name = data.user.name;
  var message = data.message;
  var datetime = date.toISOString();
  var hours = date.getHours();
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  document.getElementById('messages').innerHTML += html `<div class="message">
  <img src="${image}" alt="${name}" class="message--item message--item__image">
  <p class="message--item message--item__text">${message}</p>
  <time datetime="${datetime}" class="message--item message--item__time">${hours}:${minutes}</time>
  </div>`;
}

base.child('messages').limitToLast(10).on('child_added', function(snap) {
  add(snap.val());
});
