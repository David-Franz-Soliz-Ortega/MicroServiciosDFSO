<?php
namespace App\Services;

use Grpc\Empleado\EmpleadoServiceInterface;
use Grpc\Empleado\EmpleadoRequest;
use Grpc\Empleado\EmpleadoResponse;
use Grpc\Empleado\EmpleadoListResponse;
use Grpc\Empleado\CrearEmpleadoRequest;
use Grpc\Empleado\ActualizarEmpleadoRequest;
use Grpc\Empleado\PBEmpty;
use Spiral\RoadRunner\GRPC\ContextInterface;
use App\Models\Empleado;

class EmpleadoService implements EmpleadoServiceInterface 
{
    public function ListarEmpleados(ContextInterface $ctx, PBEmpty $in): EmpleadoListResponse
    {
        $empleados = Empleado::all();
        $response = new EmpleadoListResponse();
        
        $lista = [];
        foreach ($empleados as $emp) {
            $lista[] = new EmpleadoResponse([
                'id' => (string) $emp->_id,
                'nombre' => $emp->nombre,
                'puesto' => $emp->puesto,
                'salario' => (float) $emp->salario,
                'created_at' => (string) $emp->created_at,
                'updated_at' => (string) $emp->updated_at
            ]);
        }
        
        $response->setEmpleados($lista);
        return $response;
    }

    public function ObtenerEmpleado(ContextInterface $ctx, EmpleadoRequest $in): EmpleadoResponse 
    {
        $empleado = Empleado::find($in->getId());

        if (!$empleado) {
            throw new \Exception("Empleado no encontrado");
        }

        return new EmpleadoResponse([
            'id' => (string) $empleado->_id,
            'nombre' => $empleado->nombre,
            'puesto' => $empleado->puesto,
            'salario' => (float) $empleado->salario,
            'created_at' => (string) $empleado->created_at,
            'updated_at' => (string) $empleado->updated_at
        ]);
    }

    public function CrearEmpleado(ContextInterface $ctx, CrearEmpleadoRequest $in): EmpleadoResponse
    {
        $empleado = Empleado::create([
            'nombre' => $in->getNombre(),
            'puesto' => $in->getPuesto(),
            'salario' => $in->getSalario()
        ]);

        return new EmpleadoResponse([
            'id' => (string) $empleado->_id,
            'nombre' => $empleado->nombre,
            'puesto' => $empleado->puesto,
            'salario' => (float) $empleado->salario,
            'created_at' => (string) $empleado->created_at,
            'updated_at' => (string) $empleado->updated_at
        ]);
    }

    public function ActualizarEmpleado(ContextInterface $ctx, ActualizarEmpleadoRequest $in): EmpleadoResponse
    {
        $empleado = Empleado::find($in->getId());

        if (!$empleado) {
            throw new \Exception("Empleado no encontrado");
        }

        $empleado->update([
            'nombre' => $in->getNombre(),
            'puesto' => $in->getPuesto(),
            'salario' => $in->getSalario()
        ]);

        return new EmpleadoResponse([
            'id' => (string) $empleado->_id,
            'nombre' => $empleado->nombre,
            'puesto' => $empleado->puesto,
            'salario' => (float) $empleado->salario,
            'created_at' => (string) $empleado->created_at,
            'updated_at' => (string) $empleado->updated_at
        ]);
    }

    public function EliminarEmpleado(ContextInterface $ctx, EmpleadoRequest $in): PBEmpty
    {
        $empleado = Empleado::find($in->getId());

        if ($empleado) {
            $empleado->delete();
        }

        return new PBEmpty();
    }
}