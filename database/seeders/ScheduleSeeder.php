<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('schedules')->insert([
            'start_date' => date('Y-m-d'),
            'end_date' => date('Y-m-d'),
            'event_name' => 'テスト名前',
        ]);
    }
}
