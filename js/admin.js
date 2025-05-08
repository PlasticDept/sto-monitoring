// Fungsi untuk parsing CSV ke array objek
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim().toLowerCase()] = values[index] ? values[index].trim() : "";
    });
    return row;
  });
}

// Submit CSV dan simpan ke Firebase
document.getElementById("csvForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const file = document.getElementById("csvFile").files[0];
  if (!file) return alert("Pilih file CSV terlebih dahulu.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const csvText = e.target.result;
    const parsed = parseCSV(csvText);

    const formatted = parsed.map((row) => {
      const target = parseInt(row["target"]) || 0;
      const uploads = [
        parseInt(row["upload1"]) || 0,
        parseInt(row["upload2"]) || 0,
        parseInt(row["upload3"]) || 0,
        parseInt(row["upload4"]) || 0,
        parseInt(row["upload5"]) || 0,
        parseInt(row["upload6"]) || 0,
        parseInt(row["upload7"]) || 0,
      ];
      const total = uploads.reduce((sum, val) => sum + val, 0);
      const remaining = Math.max(target - total, 0);

      return {
        group: row["group"] || "",
        pic: row["pic"] || "",
        target: target,
        upload1: uploads[0],
        upload2: uploads[1],
        upload3: uploads[2],
        upload4: uploads[3],
        upload5: uploads[4],
        upload6: uploads[5],
        upload7: uploads[6],
        total: total,
        remaining: remaining
      };
    });

    // Simpan ke Firebase per baris
    formatted.forEach((item, index) => {
      db.ref("pra_sto_data/row_" + index).set(item);
    });

    alert("Data berhasil diunggah!");
    loadDataFromFirebase(); // refresh tabel
  };
  reader.readAsText(file);
});

// Fungsi untuk load data ke tabel
function loadDataFromFirebase() {
  const tbody = document.querySelector("#data-table tbody");
  tbody.innerHTML = "";

  db.ref("pra_sto_data").once("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    Object.entries(data).forEach(([id, item]) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", id);

      row.innerHTML = `
        <td contenteditable="true" data-field="group">${item.group}</td>
        <td contenteditable="true" data-field="pic">${item.pic}</td>
        <td contenteditable="true" data-field="target">${item.target}</td>
        <td contenteditable="true" data-field="upload1">${item.upload1 || ""}</td>
        <td contenteditable="true" data-field="upload2">${item.upload2 || ""}</td>
        <td contenteditable="true" data-field="upload3">${item.upload3 || ""}</td>
        <td contenteditable="true" data-field="upload4">${item.upload4 || ""}</td>
        <td contenteditable="true" data-field="upload5">${item.upload5 || ""}</td>
        <td contenteditable="true" data-field="upload6">${item.upload6 || ""}</td>
        <td contenteditable="true" data-field="upload7">${item.upload7 || ""}</td>
        <td>${item.total}</td>
        <td>${item.remaining}</td>
      `;
      tbody.appendChild(row);
    });
  });
}

// Auto-update saat sel diedit
document.addEventListener("input", function (e) {
  const cell = e.target;
  if (cell.tagName === "TD" && cell.hasAttribute("contenteditable")) {
    const row = cell.closest("tr");
    const rowId = row.getAttribute("data-id");
    const field = cell.getAttribute("data-field");
    const value = cell.innerText;

    if (rowId && field) {
      db.ref(`pra_sto_data/${rowId}/${field}`).set(value);
    }
  }
});

// Load data saat halaman pertama kali dibuka
document.addEventListener("DOMContentLoaded", function () {
  loadDataFromFirebase();
});
