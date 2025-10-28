(function(){
  const tableRows = [...document.querySelectorAll('#calcTable tr')]
    .filter(r => r.querySelector('[data-point]'));
  const grandTotal = document.getElementById('grandTotal');
  const resetBtn = document.getElementById('resetBtn');
  const inputs = document.querySelectorAll('.amountInput');
  const promoFrom = document.querySelector('.fromLvl');
  const promoTo = document.querySelector('.toLvl');
  const promoDiff = document.querySelector('.diffCell');
  const themeToggle = document.getElementById('themeToggle');

  // ===== LOAD SAVED DATA =====
  const saved = JSON.parse(localStorage.getItem('officerCalc') || '{}');
  if(saved.values){
    inputs.forEach((inp, i) => inp.value = saved.values[i] ?? 0);
    if(saved.from) promoFrom.value = saved.from;
    if(saved.to) promoTo.value = saved.to;
  }

  // ===== THEME SYSTEM =====
  const savedTheme = localStorage.getItem('officerTheme') || 'dark';
  if(savedTheme === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('officerTheme', isLight ? 'light' : 'dark');
  });

  // ===== LOGIC =====
  const num = v => Number(v)||0;

  function calcPromotionDiff(){
    const diff = Math.max(0, num(promoTo.value) - num(promoFrom.value));
    promoDiff.textContent = diff;
    return diff;
  }

  function updateTotals(){
    let grand = 0;
    tableRows.forEach(row=>{
      const p = num(row.querySelector('[data-point]').textContent);
      const a = num(row.querySelector('.amountInput').value);
      const t = p*a;
      row.querySelector('.totalCell').textContent = t.toLocaleString();
      grand += t;
    });

    // promotion
    const promoRow = document.querySelector('.promoAmount');
    const diff = calcPromotionDiff();
    const promoTotalCell = promoRow.closest('tr').querySelector('.totalCell');
    const promoTotal = diff * num(promoRow.value);
    promoTotalCell.textContent = promoTotal.toLocaleString();
    grand += promoTotal;

    grandTotal.textContent = grand.toLocaleString();
    grandTotal.classList.remove('flash');
    void grandTotal.offsetWidth;
    grandTotal.classList.add('flash');

    saveState();
  }

  function saveState(){
    const values = [...inputs].map(i => i.value);
    const state = {values, from: promoFrom.value, to: promoTo.value};
    localStorage.setItem('officerCalc', JSON.stringify(state));
  }

  // ===== alert button replaces the × button ===== //
  document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.querySelector('.back-btn');
  
  backBtn.addEventListener('click', function(event) {
    event.preventDefault(); // cegah pindah halaman
    alert('Gunakan tombol "Reset Total" untuk menghapus semua nilai!\n\nTombol 🔍 hanya sebagai informasi.');
  });
});
  
  // ===== automatically minimize page ===== //
  document.addEventListener('DOMContentLoaded', () => {
  // Atur zoom halaman ke 60% saat pertama kali halaman dimuat
  document.body.style.zoom = "0.6";
});
  
  // ===== EVENTS =====
  inputs.forEach(i=>i.addEventListener('input', updateTotals));
  [promoFrom, promoTo].forEach(s=>s.addEventListener('change', updateTotals));
  resetBtn.addEventListener('click', ()=>{
    inputs.forEach(i=>i.value=0);
    promoFrom.value='1';
    promoTo.value='2';
    localStorage.removeItem('officerCalc');
    updateTotals();
  });

  // ===== INIT =====
  calcPromotionDiff();
  updateTotals();
})();
