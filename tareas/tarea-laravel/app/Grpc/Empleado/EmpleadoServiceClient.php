<?php
namespace Grpc\Empleado;

class EmpleadoServiceClient extends \Grpc\BaseStub {

    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    public function ListarEmpleados(\Grpc\Empleado\PBEmpty $argument, $metadata = [], $options = []) {
        return $this->_simpleRequest('/grpc.empleado.EmpleadoService/ListarEmpleados',
        $argument,
        ['\Grpc\Empleado\EmpleadoListResponse', 'decode'],
        $metadata, $options);
    }

    public function ObtenerEmpleado(\Grpc\Empleado\EmpleadoRequest $argument, $metadata = [], $options = []) {
        return $this->_simpleRequest('/grpc.empleado.EmpleadoService/ObtenerEmpleado',
        $argument,
        ['\Grpc\Empleado\EmpleadoResponse', 'decode'],
        $metadata, $options);
    }

    public function CrearEmpleado(\Grpc\Empleado\CrearEmpleadoRequest $argument, $metadata = [], $options = []) {
        return $this->_simpleRequest('/grpc.empleado.EmpleadoService/CrearEmpleado',
        $argument,
        ['\Grpc\Empleado\EmpleadoResponse', 'decode'],
        $metadata, $options);
    }

    public function ActualizarEmpleado(\Grpc\Empleado\ActualizarEmpleadoRequest $argument, $metadata = [], $options = []) {
        return $this->_simpleRequest('/grpc.empleado.EmpleadoService/ActualizarEmpleado',
        $argument,
        ['\Grpc\Empleado\EmpleadoResponse', 'decode'],
        $metadata, $options);
    }

    public function EliminarEmpleado(\Grpc\Empleado\EmpleadoRequest $argument, $metadata = [], $options = []) {
        return $this->_simpleRequest('/grpc.empleado.EmpleadoService/EliminarEmpleado',
        $argument,
        ['\Grpc\Empleado\PBEmpty', 'decode'],
        $metadata, $options);
    }
}
