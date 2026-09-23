<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmpleadoController;

Route::apiResource('empleados', EmpleadoController::class);