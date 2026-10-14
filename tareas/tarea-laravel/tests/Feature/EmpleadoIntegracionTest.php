<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Empleado;


class EmpleadoIntegracionTest extends TestCase
{

    public function test_endpoint_con_modelo_y_base_de_datos_real(): void
    {
        // 1. Arrange: Datos del nuevo empleado
        $datosEmpleado = [
            'nombre'  => 'Prueba Integracion',
            'puesto'  => 'Ingeniero QA',
            'salario' => 5200.50,
        ];

        // 2. Act (Pieza 1 + Pieza 2): Endpoint POST -> Controlador -> Base de datos
        $responsePost = $this->postJson('/api/empleados', $datosEmpleado);

        // Assert: El endpoint responde HTTP 201 Creado
        $responsePost->assertStatus(201);
        $dataPost = $responsePost->json();
        $this->assertNotEmpty($dataPost['_id'] ?? $dataPost['id'] ?? null);
        $empleadoId = (string) ($dataPost['_id'] ?? $dataPost['id']);

        // 3. Act (Verificar persistencia real en base de datos): Endpoint GET /api/empleados/{id}
        $responseGet = $this->getJson("/api/empleados/{$empleadoId}");

        // Assert: El endpoint recupera el registro exacto de la base de datos
        $responseGet->assertStatus(200);
        $responseGet->assertJsonFragment([
            'nombre'  => 'Prueba Integracion',
            'puesto'  => 'Ingeniero QA',
            'salario' => 5200.50,
        ]);

        // 4. Verificación directa en base de datos a nivel modelo
        $empleadoEnBd = Empleado::find($empleadoId);
        $this->assertNotNull($empleadoEnBd);
        $this->assertEquals('Ingeniero QA', $empleadoEnBd->puesto);

        // 5. Cleanup: Limpieza del registro de prueba
        $responseDelete = $this->deleteJson("/api/empleados/{$empleadoId}");
        $responseDelete->assertStatus(200);

        // Confirmar que ya no existe en la base de datos
        $this->assertNull(Empleado::find($empleadoId));
    }
}
