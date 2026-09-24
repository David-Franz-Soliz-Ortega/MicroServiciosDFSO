<?php
require __DIR__ . '/vendor/autoload.php';

// BOOTSTRAP LARAVEL
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\EmpleadoService;
use Spiral\RoadRunner\Worker;
use Spiral\RoadRunner\GRPC\Server;

$worker = Worker::create();
$server = new Server();
$server->registerService(\Grpc\Empleado\EmpleadoServiceInterface::class, new EmpleadoService());
$server->serve($worker);

