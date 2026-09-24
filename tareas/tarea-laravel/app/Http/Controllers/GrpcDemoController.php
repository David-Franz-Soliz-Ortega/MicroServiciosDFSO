<?php

namespace App\Http\Controllers;

use Grpc\Empleado\EmpleadoServiceClient;
use Grpc\Empleado\EmpleadoRequest;
use Grpc\Empleado\PBEmpty;
use Grpc\Empleado\CrearEmpleadoRequest;
use Grpc\Empleado\ActualizarEmpleadoRequest;
use Grpc\ChannelCredentials;
use Illuminate\Http\Request;

class GrpcDemoController extends Controller
{
    private $cliente;

    public function __construct()
    {
        $this->cliente = new EmpleadoServiceClient('127.0.0.1:9001', [
            'credentials' => ChannelCredentials::createInsecure(),
        ]);
    }

    public function index()
    {
        $empty = new PBEmpty();
        list($listResponse, $status) = $this->cliente->ListarEmpleados($empty)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => 'Falló el microservicio en ListarEmpleados'], 500);
        }

        $empleados = [];
        foreach ($listResponse->getEmpleados() as $emp) {
            $empleados[] = [
                'id' => $emp->getId(),
                'nombre' => $emp->getNombre(),
                'puesto' => $emp->getPuesto(),
                'salario' => $emp->getSalario()
            ];
        }

        return response()->json($empleados);
    }

    public function show($id)
    {
        $req = new EmpleadoRequest();
        $req->setId($id);
        list($response, $status) = $this->cliente->ObtenerEmpleado($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => 'Empleado no encontrado por gRPC'], 404);
        }

        return response()->json([
            'id' => $response->getId(),
            'nombre' => $response->getNombre(),
            'puesto' => $response->getPuesto(),
            'salario' => $response->getSalario()
        ]);
    }

    public function store(Request $request)
    {
        $req = new CrearEmpleadoRequest();
        $req->setNombre($request->input('nombre', ''));
        $req->setPuesto($request->input('puesto', ''));
        $req->setSalario((float) $request->input('salario', 0));

        list($response, $status) = $this->cliente->CrearEmpleado($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => 'No se pudo crear empleado por gRPC'], 500);
        }

        return response()->json([
            'id' => $response->getId(),
            'nombre' => $response->getNombre(),
            'puesto' => $response->getPuesto(),
            'salario' => $response->getSalario()
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $req = new ActualizarEmpleadoRequest();
        $req->setId($id);
        $req->setNombre($request->input('nombre', ''));
        $req->setPuesto($request->input('puesto', ''));
        $req->setSalario((float) $request->input('salario', 0));

        list($response, $status) = $this->cliente->ActualizarEmpleado($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => 'No se pudo actualizar empleado por gRPC'], 500);
        }

        return response()->json([
            'id' => $response->getId(),
            'nombre' => $response->getNombre(),
            'puesto' => $response->getPuesto(),
            'salario' => $response->getSalario()
        ]);
    }

    public function destroy($id)
    {
        $req = new EmpleadoRequest();
        $req->setId($id);

        list($response, $status) = $this->cliente->EliminarEmpleado($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => 'No se pudo eliminar empleado por gRPC'], 500);
        }

        return response()->json(['message' => 'Empleado eliminado con éxito por gRPC']);
    }
}