function decide(score) {
  if (score >= 7) return "BLOCK";
  if (score >= 4) return "WARN";
  return "ALLOW";
}

module.exports = { decide };
