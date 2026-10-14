const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(buffer) {
  let s = "";
  new Uint8Array(buffer).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str) {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

function importKey(keyB64, usage) {
  return crypto.subtle.importKey("raw", fromBase64Url(keyB64), "AES-GCM", false, [usage]);
}

export async function generateKey() {
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
  return toBase64Url(await crypto.subtle.exportKey("raw", key));
}

export async function encrypt(plaintext, keyB64) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await importKey(keyB64, "encrypt"),
    encoder.encode(plaintext)
  );
  const out = new Uint8Array(iv.length + cipher.byteLength);
  out.set(iv);
  out.set(new Uint8Array(cipher), iv.length);
  return toBase64Url(out);
}

export async function decrypt(token, keyB64) {
  const bytes = fromBase64Url(token);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: bytes.slice(0, 12) },
    await importKey(keyB64, "decrypt"),
    bytes.slice(12)
  );
  return decoder.decode(plain);
}