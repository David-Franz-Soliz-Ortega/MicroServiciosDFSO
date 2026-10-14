<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Empleado;
use Illuminate\Support\Facades\DB;
use MongoDB\Driver\Manager;
use MongoDB\Driver\Command;
use MongoDB\Driver\Exception\ConnectionTimeoutException;


class EphemeralContainerTest extends TestCase
{
    private static string $containerName = 'mongo_ephemeral_test';
    private static int $port = 27019;
    private static bool $containerStarted = false;

  
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        // 1. Verificar si el daemon de Docker está activo y respondiendo
        exec('docker info 2>&1', $dockerCheck, $checkStatus);
        if ($checkStatus !== 0) {
            self::$containerStarted = false;
            return;
        }

        // 2. Limpiar de forma segura cualquier contenedor previo que haya quedado con el mismo nombre
        exec("docker rm -f " . self::$containerName . " 2>&1");

        // 3. Arrancar contenedor efímero con bandera --rm (se autodestruye al apagarse)
        $cmd = "docker run -d --rm --name " . self::$containerName . " -p " . self::$port . ":27017 mongo:latest";
        exec($cmd, $output, $returnVar);

        if ($returnVar === 0) {
            // 4. Sondeo (Health-Check): Esperar hasta que el motor de MongoDB responda ping
            $intentos = 0;
            $conectado = false;
            while ($intentos < 30 && !$conectado) {
                try {
                    $manager = new Manager("mongodb://127.0.0.1:" . self::$port, ['serverSelectionTimeoutMS' => 1500]);
                    $command = new Command(['ping' => 1]);
                    $manager->executeCommand('admin', $command);
                    $conectado = true;
                    // Margen de seguridad para estabilización de almacenamiento de MongoDB
                    sleep(2);
                } catch (\Throwable $e) {
                    usleep(500000); // 0.5 segundos entre intentos
                    $intentos++;
                }
            }

            // Solo marcamos como iniciado si efectivamente respondió al ping
            self::$containerStarted = $conectado;
        } else {
            self::$containerStarted = false;
        }
    }

    /**
     * Ciclo de vida: DESPUÉS de ejecutar la suite de pruebas.
     * Detiene el contenedor. Al tener la bandera --rm, Docker lo elimina por completo.
     */
    public static function tearDownAfterClass(): void
    {
        if (self::$containerStarted) {
            // Detener el contenedor efímero -> Docker lo destruye automáticamente
            exec("docker stop " . self::$containerName . " 2>&1");
        }

        parent::tearDownAfterClass();
    }

    /**
     * Prueba contra la base de datos real en el contenedor efímero.
     */
    public function test_persistencia_y_agregacion_en_contenedor_efimero(): void
    {
        if (!self::$containerStarted) {
            $this->markTestSkipped('Docker no está disponible o el contenedor efímero no pudo inicializarse.');
        }

        try {
            // Configurar la conexión de Laravel para que apunte dinámicamente al contenedor efímero
            config([
                'database.connections.mongodb.host' => '127.0.0.1',
                'database.connections.mongodb.port' => self::$port,
                'database.connections.mongodb.database' => 'db_efimera_test',
            ]);
            DB::purge('mongodb');

            // 1. Insertar datos reales en el contenedor efímero
            Empleado::create(['nombre' => 'Ana Efimera', 'puesto' => 'Arquitecto', 'salario' => 7000.0]);
            Empleado::create(['nombre' => 'Luis Efimero', 'puesto' => 'Arquitecto', 'salario' => 8000.0]);
            Empleado::create(['nombre' => 'Sofia Efimera', 'puesto' => 'QA', 'salario' => 4000.0]);

            // 2. Ejecutar consulta de agregación nativa en la base de datos efímera
            $resultado = Empleado::raw(function ($collection) {
                return $collection->aggregate([
                    [
                        '$group' => [
                            '_id' => '$puesto',
                            'salarioPromedio' => ['$avg' => '$salario'],
                            'total' => ['$sum' => 1]
                        ]
                    ],
                    ['$sort' => ['_id' => 1]]
                ]);
            })->toArray();

            // 3. Aserciones de verificación
            $this->assertCount(2, $resultado, 'Deben existir 2 puestos agrupados en la base efímera');

            $arquitectos = collect($resultado)->firstWhere('id', 'Arquitecto') ?? collect($resultado)->firstWhere('_id', 'Arquitecto');
            $this->assertNotNull($arquitectos);
            $this->assertEquals(7500.0, $arquitectos['salarioPromedio']); // (7000 + 8000) / 2
            $this->assertEquals(2, $arquitectos['total']);

        } catch (ConnectionTimeoutException $e) {
            $this->markTestSkipped('Tiempo de espera agotado al conectar con el contenedor efímero.');
        }
    }
}
