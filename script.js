// 1. Catálogo oficial de actividades y colores estructurados
const activities = [
  { id: 'discipulado-rvf', name: 'Discipulados RVF Semana', color: 'var(--bg-discipulado-rvf)', textColor: 'var(--text-dark)' },
  { id: 'oracion', name: 'Discipulado Oracion 1 Dom y cont 2', color: 'var(--bg-oracion)', textColor: 'var(--text-light)' },
  { id: 'casas', name: 'Casas de evangelismo', color: 'var(--bg-casas)', textColor: 'var(--text-dark)' },
  { id: 'diplomado', name: 'Diplomado UTCV CREER SIN LIMITES', color: 'var(--bg-diplomado)', textColor: 'var(--text-light)' },
  { id: 'mujeres', name: 'Reunion Mujeres', color: 'var(--bg-mujeres)', textColor: 'var(--text-dark)' },
  { id: 'varones', name: 'Reunion Varones', color: 'var(--bg-varones)', textColor: 'var(--text-light)' },
  { id: 'jovenes', name: 'Reunion Jovenes', color: 'var(--bg-jovenes)', textColor: 'var(--text-dark)' },
  { id: 'matrimonios', name: 'Reunion Matrimonios', color: 'var(--bg-matrimonios)', textColor: 'var(--text-dark)' },
  { id: 'vigilias', name: 'Vigilias de Oracion', color: 'var(--bg-vigilias)', textColor: 'var(--text-light)' }
];

// 2. Base de datos de eventos mensuales estructurada por [año][mes_indexado_0]
const eventsDatabase = {
  2026: {
    5: { // JUNIO
      6: ['jovenes'],
      11: ['diplomado'],
      17: ['mujeres'],          // Corregido a Reunión de Mujeres
      18: ['discipulado-rvf'],
      19: ['varones'],
      20: ['jovenes'],
      21: ['oracion'],          // Día del padre (Rosa/Magenta)
      23: ['casas'],
      25: ['diplomado'],
      30: ['casas']
    },
    6: { // JULIO
      1: ['mujeres'],           // Corregido: Miércoles 1 es Reunión de Mujeres
      2: ['discipulado-rvf'],   // Corregido: Jueves 2 es Discipulados RVF Semana
      3: ['vigilias'],          // Corregido: Viernes 3 es Vigilias de Oración
      4: ['jovenes'],           // Corregido: Sábado 4 es Reunión de Jóvenes
      5: ['oracion'],
      7: ['casas'],
      9: ['diplomado'],
      10: ['varones'],
      14: ['casas'],
      17: ['matrimonios'],
      18: ['jovenes'],
      21: ['casas'],
      23: ['diplomado'],
      28: ['casas'],
      29: ['mujeres'],
      31: ['varones']
    }
  }
};

// Configuración del estado inicial del calendario (Empieza en Junio 2026)
let currentYear = 2026;
let currentMonth = 5;

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

document.addEventListener("DOMContentLoaded", () => {
  renderLegend();
  renderCalendar(currentMonth, currentYear);

  // Eventos de los botones de navegación
  document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
});

// Generar el menú lateral izquierdo (Leyenda)
function renderLegend() {
  const legendList = document.getElementById('legendList');
  legendList.innerHTML = '';

  activities.forEach(act => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.dataset.activityId = act.id;
    item.innerHTML = `
            <div class="color-box" style="background: ${act.color};"></div>
            <span>${act.name}</span>
        `;

    // Interacción por Hover
    item.addEventListener('mouseenter', () => highlightActivity(act.id));
    item.addEventListener('mouseleave', () => clearHighlight());

    legendList.appendChild(item);
  });
}

// Generar los días de cualquier mes/año de manera matemática
function renderCalendar(month, year) {
  const monthTitle = document.getElementById('monthTitle');
  const calendarDays = document.getElementById('calendarDays');

  // Actualizar el título en pantalla
  monthTitle.innerText = `${monthNames[month]} ${year}`;
  calendarDays.innerHTML = '';

  // Calcular en qué día cae el día 1 del mes (0=Dom, 1=Lun, 2=Mar...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Calcular el número total de días que tiene el mes seleccionado
  const totalDays = new Date(year, month + 1, 0).getDate();

  // 1. Renderizar celdas vacías del inicio del mes (desfase)
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'day-cell empty';
    calendarDays.appendChild(emptyCell);
  }

  // Obtener los eventos correspondientes al mes actual si existen en la base de datos
  const monthEvents = eventsDatabase[year] && eventsDatabase[year][month] ? eventsDatabase[year][month] : {};

  // 2. Renderizar los días reales del mes
  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';
    dayCell.innerHTML = `<span>${day}</span>`;

    // Si el día actual contiene actividades programadas
    if (monthEvents[day]) {
      const currentActs = monthEvents[day];
      dayCell.dataset.activities = currentActs.join(',');

      // Aplicar el color y diseño de la actividad principal
      const primaryActId = currentActs[0];
      const actConfig = activities.find(a => a.id === primaryActId);

      if (actConfig) {
        dayCell.style.backgroundColor = actConfig.color;
        dayCell.style.color = actConfig.textColor;

        if (actConfig.textColor === 'var(--text-dark)') {
          dayCell.style.borderColor = 'rgba(0, 0, 0, 0.12)';
        }
      }
    }

    calendarDays.appendChild(dayCell);
  }
}

// Cambiar de mes mediante las flechas
function changeMonth(direction) {
  currentMonth += direction;

  // Manejo de desbordamiento de año
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  renderCalendar(currentMonth, currentYear);
}

// Filtrar e iluminar los días activos al pasar el ratón por la leyenda
function highlightActivity(activityId) {
  const container = document.querySelector('.calendar-container');
  container.classList.add('dimmed');

  const cells = document.querySelectorAll('.day-cell:not(.empty)');
  cells.forEach(cell => {
    const cellActs = cell.dataset.activities ? cell.dataset.activities.split(',') : [];
    if (cellActs.includes(activityId)) {
      cell.classList.add('highlighted');
    }
  });
}

// Quitar el filtro y regresar a la normalidad
function clearHighlight() {
  const container = document.querySelector('.calendar-container');
  container.classList.remove('dimmed');

  const cells = document.querySelectorAll('.day-cell');
  cells.forEach(cell => {
    cell.classList.remove('highlighted');
  });
}