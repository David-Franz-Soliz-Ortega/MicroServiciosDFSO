<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\EmpleadoMetricasService;

class EmpleadoAgregacionesTest extends TestCase
{
    private EmpleadoMetricasService $servicio;
    private array $empleadosEjemplo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->servicio = new EmpleadoMetricasService();

        
        $this->empleadosEjemplo = [
            ['id' => '1', 'nombre' => 'Ana Gomez', 'puesto' => 'Desarrollador', 'salario' => 3000.0],
            ['id' => '2', 'nombre' => 'Carlos Lopez', 'puesto' => 'Desarrollador', 'salario' => 5000.0],
            ['id' => '3', 'nombre' => 'Lucia Mendez', 'puesto' => 'Disenador', 'salario' => 2000.0],
            ['id' => '4', 'nombre' => 'Marcos Ramos', 'puesto' => 'Gerente', 'salario' => 8000.0],
        ];
    }


    public function test_calcula_la_nomina_total_correctamente(): void
    {
      
        $total = $this->servicio->calcularNominaTotal($this->empleadosEjemplo);

        $this->assertEquals(18000.0, $total);
    }

   
    public function test_calcula_el_salario_promedio_general_correctamente(): void
    {
       
        $promedio = $this->servicio->calcularSalarioPromedio($this->empleadosEjemplo);

      
        $this->assertEquals(4500.0, $promedio);
    }


    public function test_agrupa_y_calcula_metricas_por_puesto_correctamente(): void
    {
     
        $grupos = $this->servicio->agruparPorPuesto($this->empleadosEjemplo);

      
        $this->assertCount(3, $grupos);

        $this->assertArrayHasKey('Desarrollador', $grupos);
        $this->assertEquals(2, $grupos['Desarrollador']['cantidad']);
        $this->assertEquals(8000.0, $grupos['Desarrollador']['total_salarios']);
        $this->assertEquals(4000.0, $grupos['Desarrollador']['promedio_salario']);

        $this->assertArrayHasKey('Gerente', $grupos);
        $this->assertEquals(1, $grupos['Gerente']['cantidad']);
        $this->assertEquals(8000.0, $grupos['Gerente']['total_salarios']);
    }

   
    public function test_identifica_el_empleado_con_salario_maximo(): void
    {
    
        $mejorPagado = $this->servicio->obtenerSalarioMaximo($this->empleadosEjemplo);

  
        $this->assertNotNull($mejorPagado);
        $this->assertEquals('Marcos Ramos', $mejorPagado['nombre']);
        $this->assertEquals(8000.0, $mejorPagado['salario']);
    }


    public function test_maneja_correctamente_conjuntos_vacios(): void
    {
        $this->assertEquals(0.0, $this->servicio->calcularNominaTotal([]));
        $this->assertEquals(0.0, $this->servicio->calcularSalarioPromedio([]));
        $this->assertEmpty($this->servicio->agruparPorPuesto([]));
        $this->assertNull($this->servicio->obtenerSalarioMaximo([]));
    }
}
