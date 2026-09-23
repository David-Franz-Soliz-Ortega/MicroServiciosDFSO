<?php
namespace Grpc\Empleado;

use Spiral\RoadRunner\GRPC\ContextInterface;

interface EmpleadoServiceInterface extends \Spiral\RoadRunner\GRPC\ServiceInterface 
{
    public const NAME = "grpc.empleado.EmpleadoService";

    #[\Spiral\RoadRunner\GRPC\Method(name: 'ObtenerEmpleado')]
    public function ObtenerEmpleado(ContextInterface $ctx, \Grpc\Empleado\EmpleadoRequest $in): \Grpc\Empleado\EmpleadoResponse;
}