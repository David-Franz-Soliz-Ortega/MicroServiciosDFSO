<?php
namespace App\Services;

use Grpc\Empleado\EmpleadoServiceInterface;
use Grpc\Empleado\EmpleadoRequest;
use Grpc\Empleado\EmpleadoResponse;
use Spiral\RoadRunner\Grpc\ContextInterface;

class EmpleadoService implements EmpleadoServiceInterface 
{
    public function ObtenerEmpleado(ContextInterface $ctx, EmpleadoRequest $in): EmpleadoResponse 
    {
        // 1. Extraemos el ID que el cliente envió por gRPC
        $idBuscado = $in->getId();

        // 2. MOCK DATA: Simulamos una base de datos en memoria
        $baseDeDatosFalsa = [
            "1" => ["nombre" => "Maria Perez", "salario" => 7500.50],
            "2" => ["nombre" => "Juan Lopez", "salario" => 5200.00],
            "3" => ["nombre" => "Carlos Gomez", "salario" => 6100.00]
        ];

        // 3. Verificamos si el ID existe en nuestro array
        if (!array_key_exists($idBuscado, $baseDeDatosFalsa)) {
            throw new \Exception("Empleado no encontrado en el sistema");
        }

        $empleadoEncontrado = $baseDeDatosFalsa[$idBuscado];

        // 4. Retornamos el objeto binario de respuesta (Protobuf)
        return new EmpleadoResponse([
            'id' => $idBuscado,
            'nombre' => $empleadoEncontrado['nombre'],
            'salario' => $empleadoEncontrado['salario']
        ]);
    }
}