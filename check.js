const { scoreURL } = require("./engine/phishingEngine");
const { decide } = require("./engine/decisionEngine");

const testUrls = [
  "paypaI.com",
  "chatfakelogin.tk",
  "paypal.login-secure.com",
  "secure-google-login.tk",
  "google.com",
  "facebook.com",
  "chatgpt.com"
  

];

testUrls.forEach(url => {
  const result = scoreURL(url);
  const action = decide(result.score);

  console.log(`\nURL: ${url}`);
  console.log(`Score: ${result.score}`);
  console.log(`Decision: ${action}`);
  console.log(`Reasons: ${result.reasons.join(", ") || "None"}`);
});
