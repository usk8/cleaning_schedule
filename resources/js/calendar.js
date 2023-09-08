import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

let d;

let url = new URL(window.location.href);

const pattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const url_start_date = url.searchParams.get('start_date');

if (pattern.test(url_start_date)) {
    let date = new Date(url_start_date);
    d = new Date(date.getTime());
} else {
    d = new Date();
}

let num = 1;
while (num <= 12){
    let calendarElId = 'calendar' + String(num);
    let calendarEl = document.getElementById(calendarElId);

    let date = new Date(d.getFullYear(), d.getMonth(), 1);
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
    const nextYear = year + 1;
    
    const fetchYearHolidays = async (targetYear) => {
        const response = await fetch(`https://holidays-jp.github.io/api/v1/${targetYear}/date.json`);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`No holidays data found for ${targetYear}. Skipping.`);
                return [];
            } else {
                console.error(`Failed to fetch holidays for ${targetYear}. Status: ${response.status}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }
        const holidaysData = await response.json();
        return Object.keys(holidaysData);
    };

    const holidaysThisYear = await fetchYearHolidays(year);
    const holidaysNextYear = await fetchYearHolidays(nextYear);

    return [...holidaysThisYear, ...holidaysNextYear];
}


async function highlightHolidays() {
    let currentYear;
    if (pattern.test(url_start_date)) {
        currentYear = new Date(url_start_date).getFullYear();
    } else {
        currentYear = new Date().getFullYear();
    }

    const holidays = await fetchHolidays(currentYear);

    // Note: We are selecting elements with the `data-date` attribute within `.fc-daygrid-day` class.
    const daygridDays = document.querySelectorAll('.fc-daygrid-day[data-date]:not(.fc-day-other)');

    daygridDays.forEach((daygrid) => {
        const date = daygrid.getAttribute('data-date');  // Getting the value of the data-date attribute
        const hasHEvent = !!daygrid.querySelector('.fc-daygrid-event-harness .fc-h-event');  // Using the nested selector to find .fc-h-event

        if (holidays.includes(date)) {
            const dayNumberElement = daygrid.querySelector('.fc-daygrid-day-number');
            dayNumberElement.style.color = 'red';
            if (hasHEvent) {
                dayNumberElement.style.fontWeight = 'bold';
            }
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