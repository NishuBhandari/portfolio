/* Interactive Data Science & Power BI Mock Widgets for Nishu Bhandari Portfolio */

let iplChartInstance = null;
let powerBIChartInstance = null;

// Initialize IPL Classifier Widget
function initIPLWidget() {
  const ctx = document.getElementById('ipl-chart-canvas');
  if (!ctx) return;

  const overs = [1, 3, 5, 8, 10, 12, 15, 17, 19, 20];
  const boundaryProbabilities = [38, 45, 52, 28, 32, 35, 48, 65, 78, 85];
  const averageRunsPerOver = [6.2, 7.5, 8.8, 6.0, 6.8, 7.2, 8.5, 10.4, 12.8, 14.1];

  if (iplChartInstance) {
    iplChartInstance.destroy();
  }

  iplChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: overs.map(o => `Over ${o}`),
      datasets: [
        {
          label: 'Boundary Probability (%) [Logistic Regression]',
          data: boundaryProbabilities,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#38bdf8',
          pointRadius: 5
        },
        {
          label: 'Run Distribution Rate (EDA)',
          data: averageRunsPerOver,
          borderColor: '#8b5cf6',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: '#c084fc',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#9ca3af',
            font: { family: 'Inter', size: 12 }
          }
        },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#f9fafb',
          bodyColor: '#38bdf8',
          borderColor: '#374151',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af' }
        }
      }
    }
  });
}

// Interactive IPL Simulation update
function updateIPLSim(overType) {
  if (!iplChartInstance) return;

  let newProbs = [];
  let newRuns = [];

  if (overType === 'powerplay') {
    newProbs = [65, 70, 75, 68, 62, 58, 40, 35, 30, 25];
    newRuns = [9.5, 10.2, 11.0, 9.8, 8.5, 7.8, 6.0, 5.5, 5.0, 4.8];
  } else if (overType === 'death') {
    newProbs = [25, 30, 35, 40, 45, 50, 68, 82, 90, 95];
    newRuns = [5.0, 5.8, 6.5, 7.0, 7.8, 8.5, 11.2, 13.5, 15.0, 16.8];
  } else {
    // Default overall
    newProbs = [38, 45, 52, 28, 32, 35, 48, 65, 78, 85];
    newRuns = [6.2, 7.5, 8.8, 6.0, 6.8, 7.2, 8.5, 10.4, 12.8, 14.1];
  }

  iplChartInstance.data.datasets[0].data = newProbs;
  iplChartInstance.data.datasets[1].data = newRuns;
  iplChartInstance.update();
}

// Power BI Sales Performance Widget
const powerBIData = {
  adidas: {
    revenue: '$42.5M',
    growth: '+14.2%',
    orders: '185K',
    categories: ['Footwear', 'Apparel', 'Accessories', 'Equipment'],
    sales: [18.2, 14.5, 6.8, 3.0],
    regions: { North: 14.2, South: 10.5, East: 9.8, West: 8.0 }
  },
  nike: {
    revenue: '$58.1M',
    growth: '+18.6%',
    orders: '240K',
    categories: ['Footwear', 'Apparel', 'Accessories', 'Equipment'],
    sales: [28.4, 19.2, 7.5, 3.0],
    regions: { North: 19.5, South: 14.2, East: 13.1, West: 11.3 }
  }
};

function initPowerBIWidget(brand = 'adidas') {
  const ctx = document.getElementById('powerbi-chart-canvas');
  if (!ctx) return;

  const dataObj = powerBIData[brand] || powerBIData.adidas;

  // Update KPI Cards
  const revElem = document.getElementById('pbi-rev');
  const growthElem = document.getElementById('pbi-growth');
  const ordersElem = document.getElementById('pbi-orders');

  if (revElem) revElem.innerText = dataObj.revenue;
  if (growthElem) growthElem.innerText = dataObj.growth;
  if (ordersElem) ordersElem.innerText = dataObj.orders;

  if (powerBIChartInstance) {
    powerBIChartInstance.destroy();
  }

  powerBIChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dataObj.categories,
      datasets: [
        {
          label: `${brand.toUpperCase()} Sales ($ Millions)`,
          data: dataObj.sales,
          backgroundColor: brand === 'adidas' ? '#3b82f6' : '#10b981',
          borderRadius: 6,
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#9ca3af', font: { family: 'Inter', size: 12 } }
        },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#f9fafb',
          bodyColor: '#60a5fa'
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', callback: value => `$${value}M` }
        }
      }
    }
  });
}

function switchPowerBIBrand(brand) {
  // Toggle button styling
  document.querySelectorAll('.pbi-brand-btn').forEach(btn => {
    btn.classList.remove('bg-blue-600', 'text-white', 'bg-emerald-600');
    btn.classList.add('bg-gray-800', 'text-gray-400');
  });

  const activeBtn = document.getElementById(`pbi-btn-${brand}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-gray-800', 'text-gray-400');
    activeBtn.classList.add(brand === 'adidas' ? 'bg-blue-600' : 'bg-emerald-600', 'text-white');
  }

  initPowerBIWidget(brand);
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initIPLWidget();
    initPowerBIWidget('adidas');
  }, 500);
});
