import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

let num = 1;
while (num <= 12){
    let calendarElId = 'calendar' + String(num);
    let calendarEl = document.getElementById(calendarElId);

    let calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        contentHeight: "auto",
        locale: "ja",
        events: function (info, successCallback, failureCallback) {
            // Laravelのイベント取得処理の呼び出し
            axios
                .post("/schedule-get", {
                    start_date: info.start.valueOf(),
                    end_date: info.end.valueOf(),
                })
                .then((response) => {
                    // 追加したイベントを削除
                    calendar.removeAllEvents();
                    // カレンダーに読み込み
                    successCallback(response.data);
                })
                .catch(() => {
                    // バリデーションエラーなど
                    alert("登録に失敗しました");
                });
        },
    });
    calendar.render();
    num++;
}
