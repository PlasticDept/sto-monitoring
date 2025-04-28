// --- Untuk Input Page ---
const form = document.getElementById('inputForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pic = document.getElementById('pic').value;
    const progress = document.getElementById('progress').value;

    try {
      const response = await fetch('URL_APPS_SCRIPT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pic, progress }),
      });

      const result = await response.json();
      document.getElementById('message').innerText = result.message || 'Data berhasil dikirim!';
      form.reset();
    } catch (error) {
      document.getElementById('message').innerText = 'Error mengirim data!';
      console.error(error);
    }
  });
}

// --- Untuk Monitoring Page ---
async function loadMonitoring() {
  try {
    const response = await fetch('URL_APPS_SCRIPT');
    const data = await response.json();

    const labels = data.map(item => item.pic);
    const progresses = data.map(item => parseFloat(item.progress));

    // Bar Chart
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Progress (%)',
          data: progresses,
          backgroundColor: 'rgba(0, 123, 255, 0.6)',
        }]
      },
    });

    // Pie Chart
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: progresses,
          backgroundColor: [
            'rgba(0, 123, 255, 0.6)',
            'rgba(40, 167, 69, 0.6)',
            'rgba(255, 193, 7, 0.6)',
            'rgba(220, 53, 69, 0.6)'
          ],
        }]
      },
    });

  } catch (error) {
    console.error('Error loading monitoring data', error);
  }
}

if (document.getElementById('barChart')) {
  loadMonitoring();
}
