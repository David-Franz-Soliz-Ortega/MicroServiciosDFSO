<?php
namespace Grpc\Empleado;

use Spiral\RoadRunner\GRPC\ContextInterface;

interface EmpleadoServiceInterface extends \Spiral\RoadRunner\GRPC\ServiceInterface 
{
    public const NAME = "grpc.empleado.EmpleadoService";

    #[\Spiral\RoadRunner\GRPC\Method(name: 'ListarEmpleados')]
    public function ListarEmpleados(ContextInterface $ctx, \Grpc\Empleado\PBEmpty $in): \Grpc\Empleado\EmpleadoListResponse;

    #[\Spiral\RoadRunner\GRPC\Method(name: 'ObtenerEmpleado')]
    public function ObtenerEmpleado(ContextInterface $ctx, \Grpc\Empleado\EmpleadoRequest $in): \Grpc\Empleado\EmpleadoResponse;

    #[\Spiral\RoadRunner\GRPC\Method(name: 'CrearEmpleado')]
    public function CrearEmpleado(ContextInterface $ctx, \Grpc\Empleado\CrearEmpleadoRequest $in): \Grpc\Empleado\EmpleadoResponse;

    #[\Spiral\RoadRunner\GRPC\Method(name: 'ActualizarEmpleado')]
    public function ActualizarEmpleado(ContextInterface $ctx, \Grpc\Empleado\ActualizarEmpleadoRequest $in): \Grpc\Empleado\EmpleadoResponse;

    #[\Spiral\RoadRunner\GRPC\Method(name: 'EliminarEmpleado')]
    public function EliminarEmpleado(ContextInterface $ctx, \Grpc\Empleado\EmpleadoRequest $in): \Grpc\Empleado\PBEmpty;
}