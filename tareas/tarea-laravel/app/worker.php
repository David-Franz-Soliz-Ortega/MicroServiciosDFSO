<?php
require __DIR__ . '/vendor/autoload.php';

use Spiral\RoadRunner\Worker;
use Spiral\RoadRunner\GRPC\Server;
use Spiral\RoadRunner\GRPC\Invoker;
use Spiral\RoadRunner\GRPC\ContextInterface;

// ====================================================================
// 1. EL CONTRATO
// ====================================================================
interface DefensaServiceInterface extends \Spiral\RoadRunner\GRPC\ServiceInterface 
{
    public const NAME = "grpc.empleado.EmpleadoService";

    // ESTA ES LA ETIQUETA MÁGICA QUE FALTABA (Conecta Postman con PHP)
    #[\Spiral\RoadRunner\GRPC\Method(name: 'ObtenerEmpleado')]
    public function ObtenerEmpleado(ContextInterface $ctx, \Grpc\Empleado\EmpleadoRequest $in): \Grpc\Empleado\EmpleadoResponse;
}

// ====================================================================
// 2. EL SERVICIO (Datos fijos)
// ====================================================================
class DefensaService implements DefensaServiceInterface 
{
    public function ObtenerEmpleado(ContextInterface $ctx, \Grpc\Empleado\EmpleadoRequest $in): \Grpc\Empleado\EmpleadoResponse 
    {
        $id = $in->getId();
        
        $datos = [
            "1" => ["nombre" => "Maria Perez", "salario" => 7500.50],
            "2" => ["nombre" => "Juan Lopez", "salario" => 5200.00],
            "3" => ["nombre" => "Carlos Gomez", "salario" => 6100.00]
        ];

        if (!isset($datos[$id])) {
            throw new \Exception("Empleado no encontrado");
        }

        return new \Grpc\Empleado\EmpleadoResponse([
            'id' => (string) $id,
            'nombre' => $datos[$id]['nombre'],
            'salario' => (float) $datos[$id]['salario']
        ]);
    }
}

// ====================================================================
// 3. INICIO DEL SERVIDOR
// ====================================================================
$worker = Worker::create();
$server = new Server(new Invoker());
$server->registerService(DefensaServiceInterface::class, new DefensaService());
$server->serve($worker);