const chatDiv = document.getElementById("chat");

function add(role, text) {
  const d = document.createElement("div");
  d.className = "msg " + role;
  d.innerText = text;
  chatDiv.appendChild(d);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function send() {
  const input = document.getElementById("msg");
  const ai = document.getElementById("aiSelect").value;
  const text = input.value;

  if (!text) return;
  add("user", text);
  input.value = "";

  add("ai", "Typing...");

const res = await fetch("/api/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ message: text, ai })
});


  const data = await res.json();
  chatDiv.lastChild.remove();
  add("ai", data.reply);
}
