<?php

namespace App\Http\Controllers;

use Grpc\Empleado\EmpleadoServiceClient;
use Grpc\Empleado\EmpleadoRequest;
use Grpc\ChannelCredentials;

class GrpcDemoController extends Controller
{
    public function consultarMicroservicio()
    {
        // 1. Nos conectamos al microservicio gRPC (por HTTP/2)
        $cliente = new EmpleadoServiceClient('localhost:50051', [
            'credentials' => ChannelCredentials::createInsecure(),
        ]);

        // 2. Preparamos el mensaje de petición (usando clases generadas, no arrays)
        $request = new EmpleadoRequest();
        $request->setId("12345abcde");

        // 3. Hacemos la llamada remota (RPC)
        list($response, $status) = $cliente->ObtenerEmpleado($request)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => 'Falló el microservicio'], 500);
        }

        // 4. Retornamos los datos tipados
        return response()->json([
            'nombre' => $response->getNombre(),
            'salario' => $response->getSalario()
        ]);
    }
}