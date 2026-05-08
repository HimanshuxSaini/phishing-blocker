console.log("🔥 LOADED phishingEngine.js FROM ENGINE FOLDER");

const { URL } = require("url");

// ================= CONFIG =================

const BRANDS = ["paypal", "google", "amazon", "facebook", "microsoft"];
const RISKY_TLDS = [".tk", ".ml", ".ga", ".cf", ".xyz"];

// Homoglyph normalization map
// NOTE: Node lowercases hostnames automatically
const HOMOGLYPHS = {
  "0": "o",
  "1": "l",
  "i": "l",
  "|": "l",
  "3": "e",
  "5": "s",
  "7": "t"
};

// ================= HELPERS =================

function normalizeDomain(domain) {
  let result = domain;
  for (const key in HOMOGLYPHS) {
    result = result.split(key).join(HOMOGLYPHS[key]);
  }
  return result.toLowerCase();
}

function entropy(str) {
  const freq = {};
  for (const c of str) freq[c] = (freq[c] || 0) + 1;
  return Object.values(freq)
    .map(f => -f / str.length * Math.log2(f / str.length))
    .reduce((a, b) => a + b, 0);
}

function getHostname(input) {
  try {
    if (!input.startsWith("http")) input = "http://" + input;
    return new URL(input).hostname;
  } catch {
    return null;
  }
}

// ================= CORE ENGINE =================

function scoreURL(url) {
  const host = getHostname(url);
  let score = 0;
  const reasons = [];

  if (!host) {
    return { score: 10, reasons: ["Invalid URL"] };
  }

  const normalized = normalizeDomain(host);

  // 1️⃣ ROOT-DOMAIN HOMOGRAPH ATTACK
  // Example: paypaI.com → paypal.com
  BRANDS.forEach(b => {
    const legit = `${b}.com`;
    if (normalized === legit && host !== legit) {
      score += 4;
      reasons.push(`Root-domain homograph attack: ${b}`);
    }
  });

  // 2️⃣ BRAND MISUSE IN SUBDOMAIN
  // Example: paypal.login-secure.com
  BRANDS.forEach(b => {
    const legit = `${b}.com`;
    if (normalized.includes(b) && !normalized.endsWith(legit)) {
      score += 3;
      reasons.push(`Brand misuse: ${b}`);
    }
  });

  // 3️⃣ DEEP / SUSPICIOUS SUBDOMAIN
  if (host.split(".").length > 4) {
    score += 2;
    reasons.push("Too many subdomains");
  }

  // 4️⃣ RISKY TLD
  RISKY_TLDS.forEach(tld => {
    if (host.endsWith(tld)) {
      score += 2;
      reasons.push("High-risk TLD");
    }
  });

  // 5️⃣ RANDOM / MACHINE-GENERATED DOMAIN
  if (entropy(host) > 3.6) {
    score += 2;
    reasons.push("High entropy domain");
  }

  // Deduplicate reasons (company-grade)
  return {
    score,
    reasons: [...new Set(reasons)]
  };
}

module.exports = { scoreURL };
