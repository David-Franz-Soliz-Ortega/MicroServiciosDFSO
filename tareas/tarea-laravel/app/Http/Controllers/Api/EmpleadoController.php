<?php

namespace App\Http\Controllers\Api;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    description: "Demostración de API REST con Swagger y MongoDB",
    title: "API de Gestión de Empleados"
)]
class EmpleadoController extends Controller
{
    #[OA\Get(
        path: '/api/empleados',
        summary: 'Listar todos los empleados',
        tags: ['Empleados']
    )]
    #[OA\Response(response: 200, description: 'Operación exitosa')]
    public function index()
    {
        return response()->json(Empleado::all(), 200);
    }

    #[OA\Post(
        path: '/api/empleados',
        summary: 'Registrar un nuevo empleado',
        tags: ['Empleados']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['nombre', 'puesto', 'salario'],
            properties: [
                new OA\Property(property: 'nombre', type: 'string', example: 'María López'),
                new OA\Property(property: 'puesto', type: 'string', example: 'Desarrolladora React'),
                new OA\Property(property: 'salario', type: 'number', example: 6000.50)
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Empleado creado')]
    public function store(Request $request)
    {
        $empleado = Empleado::create($request->all());
        return response()->json($empleado, 201);
    }
}