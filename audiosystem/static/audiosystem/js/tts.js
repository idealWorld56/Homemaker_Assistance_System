var r = document.getElementById('result');

function startConverting () {
  if('webkitSpeechRecognition' in window){
    var speechRecognizer = new webkitSpeechRecognition();
    speechRecognizer.continuous = true;
    speechRecognizer.lang = 'en-IN';
    speechRecognizer.start();

    var finalTranscripts = '';

    speechRecognizer.onresult = function(event){
      for(var i = event.resultIndex; i < event.results.length; i++){
        var transcript = event.results[i][0].transcript;
        transcript.replace("\n", "<br>");
        finalTranscripts = transcript;
      }

      console.log(finalTranscripts);

      finalTranscripts = finalTranscripts.toLowerCase();

      if ((finalTranscripts == "back") || (finalTranscripts== "go back")) {
        window.history.go(-1);
      }
      else {
        redirectvoice(finalTranscripts);
      }
    };

    speechRecognizer.onerror = function (event) {
    };
  }
  else {
    r.innerHTML = 'Your browser is not supported. If google chrome, please upgrade!';
  }
}

var csrftoken = Cookies.get('csrftoken');
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  }
});
function redirectvoice(target){
  console.log('loading json0');
  var jsondata = {
    'target':target
  }
  $.ajax({
    // _headers: { 'X-Requested-With': 'XMLHttpRequest' },
    // get headers() {
    //   return this._headers;
    // },
    // set headers(value) {
    //   this._headers = value;
    // },
    type: 'POST',
    url: "http://localhost:8000/audiosystem/voice-recognizer/",
    data: jsondata,
    dataType: "json",
    }).done(function (data) {
      if (data.success) {
        window.location.href = data.url;
      }   
      else {
        window.location.reload()
      }
  });
}