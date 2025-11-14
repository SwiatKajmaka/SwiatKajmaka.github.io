const API_URL = "https://script.google.com/macros/s/AKfycbyiB5Tti50oJOokiNJAb6_mHal07Uak7S0lVBs9LP57KF0yj11iR56qKNNEG6gqb1r2/exec";

function getPastDate() {
  const now = new Date();
  now.setFullYear(now.getFullYear() - 20);
  return now.toISOString().split("T")[0];
}

async function loadData() {
  const date = getPastDate();
  const res = await fetch(`${API_URL}?date=${date}`);
  const data = await res.json();

  const container = document.getElementById("container");

  if (data.error) {
    container.innerHTML = `<p>${data.error}</p>`;
    return;
  }

  container.innerHTML = `
    <div class="news-card">
      <h2>${data.title1}</h2>
      <p>${data.summary1}</p>
      <span class="show-source" onclick="toggle('s1')">Pokaż źródło</span>
      <div id="s1" class="source">Źródło: <a href="${data.link1}" target="_blank">${data.link1}</a><br>Opracowano przez ChatGPT</div>
    </div>

    <div class="news-card">
      <h2>${data.title2}</h2>
      <p>${data.summary2}</p>
      <span class="show-source" onclick="toggle('s2')">Pokaż źródło</span>
      <div id="s2" class="source">Źródło: <a href="${data.link2}" target="_blank">${data.link2}</a><br>Opracowano przez ChatGPT</div>
    </div>

    <div class="news-card">
      <h2>${data.title3}</h2>
      <p>${data.summary3}</p>
      <span class="show-source" onclick="toggle('s3')">Pokaż źródło</span>
      <div id="s3" class="source">Źródło: <a href="${data.link3}" target="_blank">${data.link3}</a><br>Opracowano przez ChatGPT</div>
    </div>
  `;
}

function toggle(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "block" ? "none" : "block";
}

loadData();