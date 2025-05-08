document.addEventListener("DOMContentLoaded", function () {
  const csvForm = document.getElementById("csvForm");
  const csvFile = document.getElementById("csvFile");
  const tableBody = document.querySelector("#data-table tbody");
  const db = firebase.database();

  // Fungsi hitung total dan sisa
  function calculateTotals(dataRow) {
    const uploads = [
      dataRow["Upload Data 1"], dataRow["Upload Data 2"], dataRow["Upload Data 3"],
      dataRow["Upload Data 4"], dataRow["Upload Data 5"], dataRow["Upload Data 6"],
      dataRow["Upload Data 7"]
    ];
    const totalUpload = uploads.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    const target = parseInt(dataRow["Target (LOC)"]) || 0;
    const remaining = Math.max(target - totalUpload, 0);

    return { totalUpload, remaining };
  }

  // Upload CSV ke Firebase
  csvForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const file = csvFile.files[0];
    if (!file) return alert("Pilih file CSV terlebih dahulu.");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;

        data.forEach((row, index) => {
          const groupName = `GROUP_${index + 1}`;
          const { totalUpload, remaining } = calculateTotals(row);

          const dataToSave = {
            Group: groupName,
            PIC: row["PIC"] || "",
            "Target (LOC)": row["Target (LOC)"] || "0",
            "Upload Data 1": row["Upload Data 1"] || "0",
            "Upload Data 2": row["Upload Data 2"] || "0",
            "Upload Data 3": row["Upload Data 3"] || "0",
            "Upload Data 4": row["Upload Data 4"] || "0",
            "Upload Data 5": row["Upload Data 5"] || "0",
            "Upload Data 6": row["Upload Data 6"] || "0",
            "Upload Data 7": row["Upload Data 7"] || "0",
            TOTAL: totalUpload.toString(),
            REMAINING: remaining.toString()
          };

          db.ref("monitoring_pra_sto/" + groupName).set(dataToSave);
        });

        alert("Data berhasil diupload ke Firebase.");
        csvForm.reset();
        loadDataFromFirebase(); // Refresh tampilan
      }
    });
  });

  // Tampilkan data dari Firebase
  function loadDataFromFirebase() {
    db.ref("monitoring_pra_sto").once("value", function (snapshot) {
      tableBody.innerHTML = "";

      snapshot.forEach(function (childSnapshot) {
        const data = childSnapshot.val();

        const row = document.createElement("tr");

        Object.keys(data).forEach((key) => {
          const cell = document.createElement("td");
          cell.textContent = data[key];
          cell.setAttribute("data-key", key);
          cell.setAttribute("contenteditable", key !== "Group");
          row.appendChild(cell);
        });

        row.setAttribute("data-group", data["Group"]);
        tableBody.appendChild(row);
      });
    });
  }

  // Inline editing dan update ke database
  document.addEventListener("input", function (e) {
    const cell = e.target;
    const row = cell.closest("tr");
    const group = row.getAttribute("data-group");

    const updatedData = {};
    row.querySelectorAll("td").forEach((td) => {
      const key = td.getAttribute("data-key");
      updatedData[key] = td.textContent.trim();
    });

    // Hitung ulang total dan remaining
    const { totalUpload, remaining } = calculateTotals(updatedData);
    updatedData.TOTAL = totalUpload.toString();
    updatedData.REMAINING = remaining.toString();

    // Perbarui tampilan langsung
    row.querySelectorAll("td").forEach((td) => {
      const key = td.getAttribute("data-key");
      if (key === "TOTAL") td.textContent = updatedData.TOTAL;
      if (key === "REMAINING") td.textContent = updatedData.REMAINING;
    });

    // Kirim ke Firebase
    db.ref("monitoring_pra_sto/" + group).set(updatedData);
  });

  // Initial load
  loadDataFromFirebase();
});
