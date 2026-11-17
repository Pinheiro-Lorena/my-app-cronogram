// ELEMENTOS DAS TAREFAS
const englishCheckboxes = document.querySelectorAll(
    '.english-card input[type="checkbox"]'
);
const frenchCheckboxes = document.querySelectorAll(
    '.french-card input[type="checkbox"]'
);

const englishCount = document.getElementById('english-count');
const frenchCount = document.getElementById('french-count');
const totalProgress = document.getElementById('total-progress');

// ELEMENTOS DAS ESTATÍSTICAS
const englishDays = document.getElementById('english-days');
const frenchDays = document.getElementById('french-days');
const completedTasks = document.getElementById('completed-tasks');
const consistency = document.getElementById('consistency');
const resetProgressButton = document.getElementById( 'reset-progress');

// ELEMENTOS DO TREINO
const workoutDay = document.getElementById('workout-day');
const workoutName = document.getElementById('workout-name');
const workoutCompleted = document.getElementById('workout-completed');

// DATA ATUAL
const currentDate = new Date();

function getTodayKey() {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// ATUALIZAR PROGRESSO
function updateProgress() {
    const englishDone = document.querySelectorAll(
        '.english-card input[type="checkbox"]:checked'
    ).length;

    const frenchDone = document.querySelectorAll(
        '.french-card input[type="checkbox"]:checked'
    ).length;

    englishCount.textContent = `${englishDone} / ${englishCheckboxes.length} tasks`;
    frenchCount.textContent = `${frenchDone} / ${frenchCheckboxes.length} tâches`;

    const totalDone = englishDone + frenchDone;
    const totalTasks = englishCheckboxes.length + frenchCheckboxes.length;

    const percentage = totalTasks === 0
        ? 0
        : Math.round((totalDone / totalTasks) * 100);

    totalProgress.textContent = `${percentage}%`;
}

// SALVAR TAREFAS
function saveTasks() {
    const tasks = {
        english: Array.from(englishCheckboxes).map(checkbox => checkbox.checked),
        french: Array.from(frenchCheckboxes).map(checkbox => checkbox.checked),
        workout: workoutCompleted.checked
    };

    localStorage.setItem(
        `tasks-${getTodayKey()}`,
        JSON.stringify(tasks)
    );
}

// CARREGAR TAREFAS
function loadTasks() {
    const savedTasks = localStorage.getItem(`tasks-${getTodayKey()}`);

    if (!savedTasks) {
        englishCheckboxes.forEach(checkbox => checkbox.checked = false);
        frenchCheckboxes.forEach(checkbox => checkbox.checked = false);
        workoutCompleted.checked = false;
        return;
    }

    const tasks = JSON.parse(savedTasks);

    englishCheckboxes.forEach((checkbox, index) => {
        checkbox.checked = tasks.english?.[index] ?? false;
    });

    frenchCheckboxes.forEach((checkbox, index) => {
        checkbox.checked = tasks.french?.[index] ?? false;
    });

    workoutCompleted.checked = tasks.workout ?? false;
}

// EVENTOS DAS TAREFAS
function handleTaskChange() {
    updateProgress();
    saveTasks();
    renderCalendar();
    renderPerformanceCharts();
    updateMonthlyStats();
    showDayHistory(getTodayKey());
}

englishCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleTaskChange);
});

frenchCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleTaskChange);
});

// EVENTO DO TREINO
workoutCompleted.addEventListener('change', () => {
    saveTasks();
    renderCalendar();
    updateMonthlyStats();
    showDayHistory(getTodayKey());
});

// MOSTRAR DIA DA SEMANA
const currentDay = document.getElementById('current-day');

const daysOfWeek = [
    'Domingo', 'Segunda-feira', 'Terça-feira',
    'Quarta-feira', 'Quinta-feira',
    'Sexta-feira', 'Sábado'
];

currentDay.textContent = daysOfWeek[currentDate.getDay()];

// MOSTRAR IDIOMA DO DIA
const englishCard = document.querySelector('.english-card');
const frenchCard = document.querySelector('.french-card');

const today = currentDate.getDay();

if (today >= 1 && today <= 3) {
    englishCard.style.display = 'block';
    frenchCard.style.display = 'none';
} else if (today >= 4 && today <= 6) {
    englishCard.style.display = 'none';
    frenchCard.style.display = 'block';
} else {
    englishCard.style.display = 'none';
    frenchCard.style.display = 'none';
}

// MOSTRAR TREINO DO DIA
const workouts = [
    'Rest Day',
    'Glutes & Hamstrings',
    'Upper Body',
    'Lower Body',
    'Upper Body',
    'Glutes Isolation',
    'Abs'
];

const currentWorkout = currentDate.getDay();

workoutDay.textContent = daysOfWeek[currentWorkout];
workoutName.textContent = workouts[currentWorkout];

// CALENDÁRIO
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');
const dayHistory = document.getElementById('day-history');

let calendarDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
);

let selectedDate = getTodayKey();

const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

// DESENHAR CALENDÁRIO
function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    monthYear.textContent = `${monthNames[month]} ${year}`;
    calendarDays.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = (firstDay + 6) % 7;

    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('button');
        emptyDay.classList.add('empty');
        emptyDay.disabled = true;
        calendarDays.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const button = document.createElement('button');
        button.textContent = day;

        const savedTasks = localStorage.getItem(`tasks-${dateKey}`);

        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);

            const hasCompletedTasks =
                (tasks.english || []).some(Boolean) ||
                (tasks.french || []).some(Boolean) ||
                tasks.workout === true;

            if (hasCompletedTasks) {
                button.classList.add('completed');
            }
        }

        if (dateKey === getTodayKey()) {
            button.classList.add('today');
        }

        if (dateKey === selectedDate) {
            button.classList.add('selected');
        }

        button.addEventListener('click', () => {
            selectedDate = dateKey;
            renderCalendar();
            showDayHistory(dateKey);
        });

        calendarDays.appendChild(button);
    }
}

// HISTÓRICO DO DIA
function showDayHistory(dateKey) {
    const savedTasks = localStorage.getItem(`tasks-${dateKey}`);

    if (!savedTasks) {
        dayHistory.innerHTML = `<p>No activities recorded on this day.</p>`;
        return;
    }

    const tasks = JSON.parse(savedTasks);

    const englishNames = Array.from(englishCheckboxes).map(checkbox =>
        checkbox.parentElement.textContent.trim()
    );

    const frenchNames = Array.from(frenchCheckboxes).map(checkbox =>
        checkbox.parentElement.textContent.trim()
    );

    const completedEnglish = englishNames.filter((name, index) =>
        tasks.english?.[index]
    );

    const completedFrench = frenchNames.filter((name, index) =>
        tasks.french?.[index]
    );

    const workoutStatus = tasks.workout
        ? 'Workout completed!'
        : 'Workout not completed';

    dayHistory.innerHTML = `
        <h3>${dateKey}</h3>

        <p><strong>English</strong></p>
        <p>${completedEnglish.length ? completedEnglish.join(', ') : 'No completed tasks'}</p>

        <p><strong>French</strong></p>
        <p>${completedFrench.length ? completedFrench.join(', ') : 'No completed tasks'}</p>

        <p><strong>Training</strong></p>
        <p>${workoutStatus}</p>
    `;
}

// NAVEGAÇÃO DO CALENDÁRIO
prevMonth.addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
    updateMonthlyStats();
    renderPerformanceCharts();
});

nextMonth.addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
    updateMonthlyStats();
    renderPerformanceCharts();
});

// ESTATÍSTICAS MENSAIS
function updateMonthlyStats() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isCurrentMonth =
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth();

    const daysToCount = isCurrentMonth
        ? currentDate.getDate()
        : daysInMonth;

    let englishDaysCount = 0;
    let frenchDaysCount = 0;
    let completedTasksCount = 0;
    let activeDays = 0;

    for (let day = 1; day <= daysToCount; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const savedTasks = localStorage.getItem(`tasks-${dateKey}`);

        if (!savedTasks) continue;

        const tasks = JSON.parse(savedTasks);

        const englishDone = (tasks.english || []).filter(Boolean).length;
        const frenchDone = (tasks.french || []).filter(Boolean).length;
        const workoutDone = tasks.workout === true;

        if (englishDone > 0) englishDaysCount++;
        if (frenchDone > 0) frenchDaysCount++;

        completedTasksCount += englishDone + frenchDone;

        if (workoutDone) {
            completedTasksCount++;
        }

        if (englishDone > 0 || frenchDone > 0 || workoutDone) {
            activeDays++;
        }
    }

    const consistencyPercentage = Math.round(
        (activeDays / daysToCount) * 100
    );

    englishDays.textContent = `${englishDaysCount} days`;
    frenchDays.textContent = `${frenchDaysCount} days`;
    completedTasks.textContent = completedTasksCount;
    consistency.textContent = `${consistencyPercentage}%`;
}

// Resetar Progresso

resetProgressButton.addEventListener('click', () => {
    const confirmation = confirm(
        'Are you sure you want to reset all progress for this month? This action cannot be undone.'
    );

    if (!confirmation) return;

    Object.keys(localStorage).forEach(key => {
        if (/^tasks-\d{4}-\d{2}$/.test(key)) {
            localStorage.removeItem(key);
        }
    });

    // Atualizar o dashboard
    loadTasks();
    updateProgress();
    renderCalendar();
    renderPerformanceCharts();
    showDayHistory(selectedDate);
    updateMonthlyStats();

    alert('Your progress has been successfully reset!');
});

// GRÁFICO DE DESEMPENHO NOS ESTUDOS
function renderPerformanceCharts() {
    const studyChart = document.getElementById('study-chart');
    const workoutChart = document.getElementById('workout-chart');

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    studyChart.innerHTML = '';
    workoutChart.innerHTML = '';

    const studyBars = document.createElement('div');
    studyBars.classList.add('chart-bars');

    const workoutBars = document.createElement('div');
    workoutBars.classList.add('chart-bars');

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const savedTasks = localStorage.getItem(`tasks-${dateKey}`);

        let studyCompleted = 0;
        let workoutCompletedCount = 0;

        if (savedTasks){
            const tasks = JSON.parse(savedTasks);

            studyCompleted = (tasks.english || []).filter(Boolean).length +
            (tasks.french || []).filter(Boolean).length;

            workoutCompletedCount = tasks.workout ? 1 : 0;
        }
        
        //barra de estudos

        const studyWrapper = document.createElement('div');
        studyWrapper.classList.add('bar-wrapper');

        const studyBar = document.createElement('div');
        studyBar.classList.add('bar');
        studyBar.style.height = `${(studyCompleted /6) * 150}px`;
        studyBar.title = `${day}: ${studyCompleted} study tasks`;

        const studyLabel = document.createElement('span');
        studyLabel.textContent = day;

        studyWrapper.appendChild(studyBar);
        studyWrapper.appendChild(studyLabel);
        studyBars.appendChild(studyWrapper);

        //barra de treinos

        const workoutWrapper = document.createElement('div');
        workoutWrapper.classList.add('bar-wrapper');

        const workoutBar = document.createElement('div');
        workoutBar.classList.add('bar');
        workoutBar.style.height = `${workoutCompletedCount * 150}px`;
        workoutBar.title =`${day}: ${workoutCompletedCount} workout`;

        const workoutLabel = document.createElement('span');
        workoutLabel.textContent = day;

        workoutWrapper.appendChild(workoutBar);
        workoutWrapper.appendChild(workoutLabel);
        workoutBars.appendChild(workoutWrapper);


    }
    studyChart.appendChild(studyBars);
    workoutChart.appendChild(workoutBars);

}



// INICIALIZAÇÃO
loadTasks();
updateProgress();
renderCalendar();
renderPerformanceCharts();
showDayHistory(selectedDate);
updateMonthlyStats();


// REGISTRAR SERVICE WORKER
if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {

        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully!');
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });

    });

}