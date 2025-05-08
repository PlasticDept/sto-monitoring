document.getElementById("uploadBtn").addEventListener("click", function () {
  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];
  if (!file) return alert("Pilih file CSV terlebih dahulu.");

  Papa.parse(file, {
    header: true,
    complete: function (results) {
      const data = results.data.filter(row => row.PIC && row['Target (LOC)']);
      const formatted = data.map((row, i) => ({
        Group: `GROUP ${i + 1}`,
        PIC: row.PIC,
        Target: Number(row['Target (LOC)']),
        Upload1: Number(row['Upload Data 1'] || 0),
        Upload2: Number(row['Upload Data 2'] || 0),
        Upload3: Number(row['Upload Data 3'] || 0),
        Upload4: Number(row['Upload Data 4'] || 0),
        Upload5: Number(row['Upload Data 5'] || 0),
        Upload6: Number(row['Upload Data 6'] || 0),
        Upload7: Number(row['Upload Data 7'] || 0),
      }));

      db.ref("pra_sto_data").set(formatted);
      alert("Data berhasil diupload!");
      renderTable(formatted);
    }
  });
});

function renderTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    Object.entries(item).forEach(([key, val]) => {
      const td = document.createElement("td");
      td.contentEditable = key !== "Group"; // Group tidak bisa diedit
      td.innerText = val;
      td.dataset.index = index;
      td.dataset.key = key;
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });
}

// Inline edit listener
document.querySelector("#dataTable").addEventListener("blur", function (e) {
  if (e.target.tagName === "TD") {
    const index = e.target.dataset.index;
    const key = e.target.dataset.key;
    const newValue = e.target.innerText;

    db.ref(`pra_sto_data/${index}/${key}`).set(isNaN(newValue) ? newValue : Number(newValue));
  }
}, true);
