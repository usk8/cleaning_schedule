<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScheduleController extends Controller
{
    /**
     * 詳細を表示
     *
     * @param  Request  $request
     */
    public function show(Request $request, $clientId)
    {
        return view('calendar', ['clientId' => $clientId]);
    }

    /**
     * イベントを取得
     *
     * @param  Request  $request
     */
    public function scheduleGet(Request $request)
    {
        // バリデーション
        $request->validate([
            'start_date' => 'required|integer',
            'end_date' => 'required|integer'
        ]);

        // カレンダー表示期間
        $start_date = date('Y-m-d', $request->input('start_date') / 1000);
        $end_date = date('Y-m-d', $request->input('end_date') / 1000);

        // 取得処理
        $sql = \DB::connection()
        ->table('herokuconnect__c')
        ->select(
            // FullCalendarの形式に合わせる
            'heroku_torihikisaki__c as client',
            'heroku_sekoubi__c as start',
            'memo__c as memo',
            DB::raw("'' as title")
        )
        // FullCalendarの表示範囲のみ表示
        ->where('id_heroku__c', '=', $request->input('client_id'))
        ->whereBetween('heroku_sekoubi__c', [$start_date, $end_date])
        ->get();

        return $sql;
    }
}
