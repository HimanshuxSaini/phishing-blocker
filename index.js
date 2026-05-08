module.exports = function checkHostname(pattern, message="Phishing Scam Detected", replace_html=false) {
  let detect = true
  if (pattern.test(window.location.hostname)){
    detect = false;
  }
  if (window.location.hostname == 'localhost'){
    detect = false;
  }
  if (detect){
    console.error(message + " " + window.location.hostname)
    if (replace_html){
      document.getElementsByTagName('body')[0].innerHTML = message; 
    }else{
      alert(message);
    }
  }
}
