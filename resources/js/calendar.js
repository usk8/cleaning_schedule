import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

let num = 1;
while (num <= 12){
    let calendarElId = 'calendar' + String(num);
    let calendarEl = document.getElementById(calendarElId);

    let d = new Date();
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
