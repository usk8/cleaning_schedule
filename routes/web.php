<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScheduleController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('errors.404');
});

Route::get('/{clientId}', [ScheduleController::class, 'show']);

Route::post('/schedule-get', [ScheduleController::class, 'scheduleGet'])->name('schedule-get');
