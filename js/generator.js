import { generateKey, encrypt } from "./crypter.js";

const form = document.getElementById("confession-form");
const errorEl = document.getElementById("form-error");
const result = document.getElementById("result");
const urlInput = document.getElementById("share-url");
const copyBtn = document.getElementById("copy");
const copyStatus = document.getElementById("copy-status");

const messageEl = document.getElementById("message");
messageEl.style.scrollbarWidth = "none";

const MAX_ROWS = 5;

function autosize() {
  const cs = getComputedStyle(messageEl);
  let lineHeight = parseFloat(cs.lineHeight);
  if (Number.isNaN(lineHeight)) lineHeight = parseFloat(cs.fontSize) * 1.2;
  const frame =
    parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) +
    parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
  const maxHeight = lineHeight * MAX_ROWS + frame;

  const prevScroll = messageEl.scrollTop;
  messageEl.style.height = "auto";
  const needed = messageEl.scrollHeight + (messageEl.offsetHeight - messageEl.clientHeight);
  const overflowing = needed > maxHeight + 1;

  messageEl.style.height = Math.min(needed, maxHeight) + "px";
  messageEl.style.overflowY = overflowing ? "auto" : "hidden";

  if (!overflowing) return;
  const atEnd = messageEl.selectionStart === messageEl.value.length;
  messageEl.scrollTop = atEnd ? messageEl.scrollHeight : prevScroll;
}

messageEl.addEventListener("input", autosize);
window.addEventListener("resize", autosize);
document.fonts.ready.then(autosize);
autosize();

form.addEventListener("input", () => {
  result.hidden = true;
  copyStatus.textContent = "";
});

const MAX_URL_LENGTH = 2000;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  copyStatus.textContent = "";

  const fd = new FormData(form);
  const payload = {
    receiver_name: String(fd.get("receiver_name") || "").trim(),
    sender_name: String(fd.get("sender_name") || "").trim(),
    message: String(fd.get("message") || "").trim(),
  };

  if (!payload.receiver_name || !payload.message) {
    errorEl.textContent = "Enter the receiver's name and a message.";
    result.hidden = true;
    return;
  }

  if (!window.crypto || !crypto.subtle) {
    errorEl.textContent = "Encryption needs HTTPS or localhost. Open this page from one of those.";
    return;
  }

  try {
    const key = await generateKey();
    const token = await encrypt(JSON.stringify(payload), key);
    const url = new URL("confession.html", location.href);
    url.searchParams.set("data", token);
    url.hash = "k=" + key;
    const link = url.toString();
    if (link.length > MAX_URL_LENGTH) {
      errorEl.textContent = "This message is too long for a reliable link. Shorten it and try again.";
      result.hidden = true;
      return;
    }
    urlInput.value = link;
    result.hidden = false;
  } catch {
    errorEl.textContent = "Could not generate the link. Try again.";
    result.hidden = true;
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(urlInput.value);
    copyStatus.textContent = "Copied.";
  } catch {
    urlInput.select();
    copyStatus.textContent = "Press Ctrl+C to copy.";
  }
});