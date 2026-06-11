const activitiesConfig = {
  'discipulado-rvf': { name: 'Discipulados RVF Semana', color: 'var(--bg-discipulado-rvf)', lightText: false },
  'oracion': { name: 'Discipulado Oracion 1 Dom y cont 2', color: 'var(--bg-oracion)', lightText: true },
  'casas': { name: 'Casas de evangelismo', color: 'var(--bg-casas)', lightText: false },
  'diplomado': { name: 'Diplomado UTCV CREER SIN LIMITES', color: 'var(--bg-diplomado)', lightText: true },
  'mujeres': { name: 'Reunion Mujeres', color: 'var(--bg-mujeres)', lightText: false },
  'varones': { name: 'Reunion Varones', color: 'var(--bg-varones)', lightText: true },
  'jovenes': { name: 'Reunion Jovenes', color: 'var(--bg-jovenes)', lightText: false },
  'matrimonios': { name: 'Reunion Matrimonios', color: 'var(--bg-matrimonios)', lightText: false },
  'vigilias': { name: 'Vigilias de Oracion', color: 'var(--bg-vigilias)', lightText: true }
};

const eventsDatabase = {
  2026: {
    5: { // JUNIO
      6: { type: 'jovenes' },
      11: { type: 'diplomado' },
      17: { type: 'mujeres' },
      18: { type: 'discipulado-rvf' },
      19: { type: 'varones' },
      20: { type: 'jovenes' },
      21: { type: 'oracion' },
      23: { type: 'casas' },
      25: { type: 'diplomado' },
      30: { type: 'casas' }
    },
    6: { // JULIO
      1: { type: 'mujeres' },
      2: { type: 'discipulado-rvf' },
      3: { type: 'vigilias' },
      4: { type: 'jovenes' },
      5: { type: 'oracion' },
      7: { type: 'casas' },
      9: { type: 'diplomado' },
      10: { type: 'varones' },
      14: { type: 'casas' },
      17: { type: 'matrimonios' },
      18: { type: 'jovenes' },
      21: { type: 'casas' },
      23: { type: 'diplomado' },
      28: { type: 'casas' },
      29: { type: 'mujeres' },
      31: { type: 'varones' }
    }
  }
};

let currentMonth = 5;
const currentYear = 2026;

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderDashboard(currentMonth);

  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      currentMonth = parseInt(e.target.dataset.month);
      renderDashboard(currentMonth);
    });
  });
}

function renderDashboard(month) {
  const calendarDays = document.getElementById('calendarDays');
  const timelineList = document.getElementById('timelineList');
  const globalCounter = document.getElementById('globalCounter');

  calendarDays.innerHTML = '';
  timelineList.innerHTML = '';

  const firstDayIndex = new Date(currentYear, month, 1).getDay();
  const totalDays = new Date(currentYear, month + 1, 0).getDate();
  const monthEvents = eventsDatabase[currentYear][month] || {};

  // Contar cuántos días ocupados hay en total en el mes
  const totalActiveDays = Object.keys(monthEvents).length;
  globalCounter.innerText = `${totalActiveDays} días con actividades programadas`;

  // 1. Renderizar desvíos de celdas vacías del calendario
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyBox = document.createElement('div');
    emptyBox.className = 'day-box empty';
    calendarDays.appendChild(emptyBox);
  }

  // Guardaremos qué tipos de actividades aparecen este mes para no duplicarlas a la derecha
  const activeTypesInMonth = new Set();

  // 2. Renderizar cuadrícula completa de días
  for (let day = 1; day <= totalDays; day++) {
    const dayBox = document.createElement('div');
    dayBox.className = 'day-box';
    dayBox.innerHTML = `<span>${day}</span>`;

    if (monthEvents[day]) {
      const event = monthEvents[day];
      const config = activitiesConfig[event.type];

      if (config) {
        activeTypesInMonth.add(event.type); // Registramos que este tipo existe en el mes

        dayBox.classList.add('active-event');
        dayBox.dataset.eventType = event.type; // Guardamos su tipo para rastrearlo en el hover
        dayBox.style.backgroundColor = config.color;
        dayBox.style.color = config.lightText ? '#fff' : '#000';
        dayBox.innerHTML += `<span class="dot-indicator" style="background: ${config.lightText ? '#fff' : '#000'}"></span>`;

        // Interactividad al pasar el cursor sobre un día del calendario
        dayBox.addEventListener('mouseenter', () => highlightEventType(event.type));
        dayBox.addEventListener('mouseleave', () => clearAllHighlights());
      }
    }
    calendarDays.appendChild(dayBox);
  }

  // 3. Renderizar el panel derecho: Solo las actividades únicas que ocurren este mes
  activeTypesInMonth.forEach(type => {
    const config = activitiesConfig[type];
    if (config) {
      const activityItem = document.createElement('div');
      activityItem.className = 'activity-item';
      activityItem.id = `activity-item-${type}`;
      activityItem.style.borderLeftColor = config.color;

      activityItem.innerHTML = `
                <div class="activity-info">
                    <h4 class="title">${config.name}</h4>
                    <span class="subtitle">Pasa el cursor para ver los días</span>
                </div>
            `;

      // Interactividad al pasar el cursor sobre el título del evento
      activityItem.addEventListener('mouseenter', () => highlightEventType(type));
      activityItem.addEventListener('mouseleave', () => clearAllHighlights());

      timelineList.appendChild(activityItem);
    }
  });
}

// Resalta globalmente todas las celdas y la tarjeta del mismo tipo de evento
function highlightEventType(type) {
  const layout = document.querySelector('.dashboard-layout');
  layout.classList.add('dimmed');

  // Destacar la tarjeta de la derecha
  const targetItem = document.getElementById(`activity-item-${type}`);
  if (targetItem) targetItem.classList.add('highlighted');

  // Destacar todos los días del calendario que correspondan a este tipo
  const dynamicCells = document.querySelectorAll(`.day-box[data-event-type="${type}"]`);
  dynamicCells.forEach(cell => cell.classList.add('highlighted'));
}

// Apaga todos los filtros y restablece la UI original
function clearAllHighlights() {
  const layout = document.querySelector('.dashboard-layout');
  layout.classList.remove('dimmed');

  document.querySelectorAll('.day-box').forEach(b => b.classList.remove('highlighted'));
  document.querySelectorAll('.activity-item').forEach(i => i.classList.remove('highlighted'));
}