import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

// Define a regex pattern to check YYYY-MM format
const YYYY_MM_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

// Extract start_date parameter from the current URL
function getCurrentURLStartDate() {
    const currentURL = new URL(window.location.href);
    return currentURL.searchParams.get('start_date');
}

// Check if a given date matches the expected YYYY-MM pattern
function isValidDatePattern(date) {
    return YYYY_MM_PATTERN.test(date);
}

// Return the initial date based on the start_date parameter
function getInitialDate(startDate) {
    if (isValidDatePattern(startDate)) {
        return new Date(startDate);
    }
    return new Date();
}

const initialDate = getInitialDate(getCurrentURLStartDate());

let num = 1;
while (num <= 12){
    let calendarElId = 'calendar' + String(num);
    let calendarEl = document.getElementById(calendarElId);

    let date = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
    date.setMonth(date.getMonth() + num);
    let yyyyMMdd = String(date.getFullYear()) + '-' + String(date.getMonth()).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

    let calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        initialDate: yyyyMMdd,
        contentHeight: "auto",
        locale: "ja",
        dayCellContent: function(e) {
            e.dayNumberText = e.dayNumberText.replace('日', '');
        },
        events: function (info, successCallback, failureCallback) {
            // Laravelのイベント取得処理の呼び出し
            axios
                .post("/schedule-get", {
                    client_id: document.getElementById('client_id').value,
                    start_date: info.start.valueOf(),
                    end_date: info.end.valueOf(),
                })
                .then((response) => {
                    // 追加したイベントを削除
                    calendar.removeAllEvents();
                    // カレンダーに読み込み
                    successCallback(response.data);
                    document.getElementsByClassName('title')[0].textContent = response.data[0].client + '様　施工予定表 ';
                    document.getElementById('memo').textContent = response.data[0].memo;
                    
                })
                .catch(() => {
                    // バリデーションエラーなど
                    // alert("登録に失敗しました");
                });
        },
    });
    calendar.render();
    num++;
}

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

let checkInterval;
function checkForHEventElements() {
    if (document.querySelector('.fc-h-event')) {
        clearInterval(checkInterval);  // Stop the interval once .fc-h-event elements are detected
        highlightHolidays();
    }
}

checkInterval = setInterval(checkForHEventElements, 1000);