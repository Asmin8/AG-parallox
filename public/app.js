const chatDiv = document.getElementById("chat");
const input = document.getElementById("msg");
const aiSelect = document.getElementById("aiSelect");

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.innerText = text;
  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function send() {
  const message = input.value.trim();
  if (!message) return;

  const ai = aiSelect.value;

  // Add user message
  addMessage("user", message);
  input.value = "";

  // Show typing
  addMessage("ai", "Typing...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, ai })
    });

    const data = await res.json();

    // Remove typing message
    chatDiv.lastChild.remove();

    if (data.reply) {
      addMessage("ai", data.reply);
    } else if (data.error) {
      addMessage("ai", `Error: ${data.error}`);
    } else {
      addMessage("ai", "Unknown error occurred");
    }

  } catch (err) {
    chatDiv.lastChild.remove();
    addMessage("ai", `Network error: ${err.message}`);
  }
}
