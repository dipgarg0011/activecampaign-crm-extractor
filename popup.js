const output = document.getElementById("output");

document.getElementById("extract").addEventListener("click", () => {
  output.innerHTML = "Extracting…";

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.id) {
      output.innerHTML = "No active tab.";
      return;
    }

    chrome.tabs.sendMessage(tab.id, { type: "PING" }, (res) => {
      if (chrome.runtime.lastError || !res?.alive) {
        output.innerHTML =
          "Content script not ready.<br/>Reload page and try again.";
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: "extract" });
    });
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  renderContacts(msg.data);
});

function renderContacts(contacts) {
  if (!Array.isArray(contacts) || contacts.length === 0) {
    output.innerHTML = '<div class="empty">No contacts found</div>';
    return;
  }

  output.innerHTML = "";

  contacts.forEach(c => {
    const div = document.createElement("div");
    div.className = "contact";

    div.innerHTML = `
      <div class="name">${c.name || "Unnamed"}</div>
      <div class="email">${c.email}</div>
      ${c.phone ? `<div class="phone">${c.phone}</div>` : ""}
    `;

    output.appendChild(div);
  });
}
