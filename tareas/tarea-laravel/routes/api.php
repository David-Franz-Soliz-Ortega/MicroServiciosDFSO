<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmpleadoController;
use App\Http\Controllers\GrpcDemoController;

// REST / Swagger routes
Route::apiResource('empleados', EmpleadoController::class);

// gRPC Client routes
Route::apiResource('grpc/empleados', GrpcDemoController::class);