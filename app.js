const targetProtein = 140;
const targetFat = 60;
const targetCarb = 400;

let weightChart;

function saveData() {
  const protein = parseInt(document.getElementById("protein").value) || 0;
  const fat = parseInt(document.getElementById("fat").value) || 0;
  const carb = parseInt(document.getElementById("carb").value) || 0;
  const weight = parseFloat(document.getElementById("weight").value) || 0;

  const today = new Date().toISOString().split("T")[0];

  const data = JSON.parse(localStorage.getItem("muscleData")) || [];

  // 🔥 同じ日付があるか探す
  const existingIndex = data.findIndex(d => d.date === today);

  if (existingIndex !== -1) {
    // 既にあるなら更新
    data[existingIndex] = { date: today, protein, fat, carb, weight };
  } else {
    // 無ければ追加
    data.push({ date: today, protein, fat, carb, weight });
  }

  localStorage.setItem("muscleData", JSON.stringify(data));

  showDifference(protein, fat, carb);
  updateChart();
}

function showDifference(p, f, c) {
  const proteinLeft = targetProtein - p;
  const fatLeft = targetFat - f;
  const carbLeft = targetCarb - c;

  document.getElementById("result").innerHTML =
    `タンパク質残り: ${proteinLeft} g<br>
     脂質残り: ${fatLeft} g<br>
     炭水化物残り: ${carbLeft} g`;

  updateRate("proteinRate", p, targetProtein);
  updateRate("fatRate", f, targetFat);
  updateRate("carbRate", c, targetCarb);
}

function updateRate(id, value, target) {
  const rate = Math.round((value / target) * 100);
  const el = document.getElementById(id);
  el.innerHTML = rate + "%";

  if (rate >= 100) {
    el.style.color = "#00e676";
  } else if (rate >= 70) {
    el.style.color = "#ffeb3b";
  } else {
    el.style.color = "#ff5252";
  }
}

function updateChart() {
  const data = JSON.parse(localStorage.getItem("muscleData")) || [];

  const labels = data.map(d => d.date);
  const weights = data.map(d => d.weight);

  const ctx = document.getElementById("weightChart").getContext("2d");

  if (weightChart) {
    weightChart.destroy();
  }

  weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '体重 (kg)',
        data: weights,
        fill: false,
        tension: 0.2
      }]
    }
  });
}

window.onload = updateChart;

window.onload = function () {
  updateChart();

  const today = new Date().toISOString().split("T")[0];
  const data = JSON.parse(localStorage.getItem("muscleData")) || [];

  const todayData = data.find(d => d.date === today);

  if (todayData) {
    document.getElementById("protein").value = todayData.protein;
    document.getElementById("fat").value = todayData.fat;
    document.getElementById("carb").value = todayData.carb;
    document.getElementById("weight").value = todayData.weight;

    showDifference(todayData.protein, todayData.fat, todayData.carb);
  }
};