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

    #[OA\Get(
        path: '/api/empleados/{id}',
        summary: 'Obtener un empleado por ID',
        tags: ['Empleados']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID del empleado',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Response(response: 200, description: 'Empleado encontrado')]
    #[OA\Response(response: 404, description: 'Empleado no encontrado')]
    public function show($id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        return response()->json($empleado, 200);
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

    #[OA\Put(
        path: '/api/empleados/{id}',
        summary: 'Actualizar los datos de un empleado',
        tags: ['Empleados']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID del empleado',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'nombre', type: 'string', example: 'María López'),
                new OA\Property(property: 'puesto', type: 'string', example: 'Líder Técnica'),
                new OA\Property(property: 'salario', type: 'number', example: 8500.00)
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Empleado actualizado con éxito')]
    #[OA\Response(response: 404, description: 'Empleado no encontrado')]
    public function update(Request $request, $id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        $empleado->update($request->all());
        return response()->json($empleado, 200);
    }

    #[OA\Delete(
        path: '/api/empleados/{id}',
        summary: 'Eliminar un empleado',
        tags: ['Empleados']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID del empleado a eliminar',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Response(response: 200, description: 'Empleado eliminado exitosamente')]
    #[OA\Response(response: 404, description: 'Empleado no encontrado')]
    public function destroy($id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        $empleado->delete();
        return response()->json(['message' => 'Empleado eliminado con éxito'], 200);
    }
}