<?php
require __DIR__ . '/vendor/autoload.php';
use App\Services\EmpleadoService;
use Spiral\RoadRunner\Worker;
use Spiral\RoadRunner\GRPC\Server;
$worker = Worker::create();
$server = new Server();
$server->registerService(\Grpc\Empleado\EmpleadoServiceInterface::class, new EmpleadoService());
$server->serve($worker);
