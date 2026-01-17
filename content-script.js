console.log("ActiveCampaign content script loaded");

// Handshake for popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PING") {
    sendResponse({ alive: true });
    return true;
  }

  if (msg.action === "extract") {
    const data = extractContacts();
    chrome.runtime.sendMessage({ data });
  }
});

function extractContacts() {
  /**
   * WHY THIS WORKS:
   * - Contact names are always links to /app/contacts/{id}
   * - Sidebar/header links exist, so we scope to main content
   */

  const main = document.querySelector('[role="main"]') || document.body;

  const contactLinks = Array.from(
    main.querySelectorAll('a[href^="/app/contacts/"]')
  );

  const seen = new Set();
  const contacts = [];

  contactLinks.forEach(link => {
    const row = link.closest('tr, div');
    if (!row) return;

    const text = row.innerText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    const email = text.find(t => t.includes('@'));
    const name = link.innerText.trim();
    const phone = text.find(t => t.startsWith('+'));

    if (!name || !email) return;
    if (seen.has(email)) return;

    seen.add(email);
    const cleanName = name.replace(email, "").trim();

    contacts.push({
      id: email,
      name,
      email,
      phone: phone || null
    });
  });

  console.log("Extracted contacts:", contacts);
  return contacts;
}
