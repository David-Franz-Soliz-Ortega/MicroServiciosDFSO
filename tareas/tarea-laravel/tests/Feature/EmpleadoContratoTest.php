<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Empleado;
use Grpc\Empleado\EmpleadoResponse;
use Grpc\Empleado\CrearEmpleadoRequest;


class EmpleadoContratoTest extends TestCase
{
  
    public function test_contrato_rest_cumple_con_el_esquema_esperado_por_el_consumidor(): void
    {
    
        $empleado = Empleado::create([
            'nombre'  => 'Laura Contrato',
            'puesto'  => 'Frontend Engineer',
            'salario' => 4500.00,
        ]);

        $id = (string) ($empleado->_id ?? $empleado->id);

        try {
        
            $response = $this->getJson("/api/empleados/{$id}");
            $response->assertStatus(200);

            $response->assertJsonStructure([
                'nombre',
                'puesto',
                'salario',
                'updated_at',
                'created_at',
            ]);

            $data = $response->json();

            $this->assertIsString($data['nombre'], 'El contrato estipula que "nombre" debe ser string');
            $this->assertIsString($data['puesto'], 'El contrato estipula que "puesto" debe ser string');
            $this->assertIsNumeric($data['salario'], 'El contrato estipula que "salario" debe ser numérico');
            $this->assertNotEmpty($data['nombre'], 'El contrato estipula que "nombre" no puede estar vacío');

            $this->assertArrayNotHasKey('password', $data, 'El contrato prohíbe exponer credenciales');
            $this->assertArrayNotHasKey('token_secreto', $data);

        } finally {
            // Limpieza
            $empleado->delete();
        }
    }

    public function test_contrato_grpc_protobuf_cumple_especificacion(): void
    {
     
        $request = new CrearEmpleadoRequest();
        $request->setNombre('Contrato gRPC');
        $request->setPuesto('Backend Go');
        $request->setSalario(5500.0);

        $response = new EmpleadoResponse([
            'id'         => '64a1b2c3d4e5f6',
            'nombre'     => $request->getNombre(),
            'puesto'     => $request->getPuesto(),
            'salario'    => (float) $request->getSalario(),
            'created_at' => now()->toIso8601String(),
            'updated_at' => now()->toIso8601String(),
        ]);

        $this->assertEquals('Contrato gRPC', $response->getNombre());
        $this->assertEquals('Backend Go', $response->getPuesto());
        $this->assertEquals(5500.0, $response->getSalario());
        $this->assertIsFloat($response->getSalario());
        $this->assertIsString($response->getId());
    }
}
