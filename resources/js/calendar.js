import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

class DateManager {
    static #YYYY_MM_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

    #getCurrentURLStartDate() {
        const currentURL = new URL(window.location.href);
        return currentURL.searchParams.get('start_date');
    }

    #isValidDatePattern(date) {
        return DateManager.#YYYY_MM_PATTERN.test(date);
    }

    static getInitialDate() {
        const dateManagerInstance = new DateManager();
        const startDate = dateManagerInstance.#getCurrentURLStartDate();
        if (dateManagerInstance.#isValidDatePattern(startDate)) {
            return new Date(startDate);
        }
        return new Date();
    }
}


function renderCalendars() {
    const initialDate = DateManager.getInitialDate();
    let index = 1;
    while (index <= 12) {
        let calendarEl = document.getElementById(createCalendarElementId(index));
        let date = getNextDate(initialDate, index - 1);
        let calendar = initializeCalendar(calendarEl, date);
        calendar.render();
        index++;
    }
}

function createCalendarElementId(index) {
    return 'calendar' + index;
}

function getNextDate(date, monthsToAdd) {
    let newDate = new Date(date.getFullYear(), date.getMonth(), 1);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    let formattedDate = newDate.getFullYear() + '-' + String(newDate.getMonth() + 1).padStart(2, '0') + '-' + String(newDate.getDate()).padStart(2, '0');
    return formattedDate;
}

function initializeCalendar(element, date) {
    let calendar = new Calendar(element, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        initialDate: date,
        contentHeight: "auto",
        locale: "ja",
        dayCellContent: function(e) {
            e.dayNumberText = e.dayNumberText.replace('日', '');
        },
        events: function(info, successCallback, failureCallback) {
            axios.post("/schedule-get", {
                client_id: document.getElementById('client_id').value,
                start_date: info.start.valueOf(),
                end_date: info.end.valueOf(),
            })
            .then((response) => {
                calendar.removeAllEvents();  // This is now correctly referencing the local calendar variable
                successCallback(response.data);
                document.getElementsByClassName('title')[0].textContent = response.data[0].client + '様 施工予定表 ';
                document.getElementById('memo').textContent = response.data[0].memo;
            })
            .catch(() => {
                // Handle the error, if any
            });
        },
    });
    return calendar;
}

renderCalendars();

async function fetchHolidays(year) {
    const response = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`);
    const holidays = await response.json();
    return Object.keys(holidays);
}

async function highlightHolidays() {
    const currentYear = new Date().getFullYear();
    const holidays = await fetchHolidays(currentYear);

    // Note: We are selecting elements with the `data-date` attribute within `.fc-daygrid-day` class.
    const daygridDays = document.querySelectorAll('.fc-daygrid-day[data-date]');

    daygridDays.forEach((daygrid) => {
        const date = daygrid.getAttribute('data-date');  // Getting the value of the data-date attribute
        const hasHEvent = !!daygrid.querySelector('.fc-daygrid-event-harness > .fc-h-event');  // Using the nested selector to find .fc-h-event

        if (holidays.includes(date) && hasHEvent) {
            const dayNumberElement = daygrid.querySelector('.fc-daygrid-day-number');
            dayNumberElement.style.color = 'red';
            dayNumberElement.style.fontWeight = 'bold';
        }
    });
}

function startCheckingForHEvents() {
    let checkInterval;

    function checkForHEventElements() {
        if (document.querySelector('.fc-h-event')) {
            clearInterval(checkInterval);  // Stop the interval once .fc-h-event elements are detected
            highlightHolidays();
        }
    }

    checkInterval = setInterval(checkForHEventElements, 1000);
}

// Start the interval check for H-Event elements
startCheckingForHEvents();