<?php

namespace App\Services;

use Illuminate\Support\Collection;

class EmpleadoMetricasService
{
    /**
     * Calcula la suma total de salarios (Nómina total).
     */
    public function calcularNominaTotal(array|Collection $empleados): float
    {
        return (float) collect($empleados)->sum('salario');
    }

    /**
     * Calcula el salario promedio general.
     */
    public function calcularSalarioPromedio(array|Collection $empleados): float
    {
        $coleccion = collect($empleados);

        if ($coleccion->isEmpty()) {
            return 0.0;
        }

        return (float) $coleccion->avg('salario');
    }

    /**
     * Realiza una agregación por puesto:
     * Retorna cantidad de empleados, total de sueldos y promedio por cada puesto.
     */
    public function agruparPorPuesto(array|Collection $empleados): array
    {
        return collect($empleados)
            ->groupBy('puesto')
            ->map(function ($grupo) {
                return [
                    'cantidad' => $grupo->count(),
                    'total_salarios' => (float) $grupo->sum('salario'),
                    'promedio_salario' => round((float) $grupo->avg('salario'), 2),
                ];
            })
            ->toArray();
    }

    /**
     * Obtiene el empleado con el salario más alto.
     */
    public function obtenerSalarioMaximo(array|Collection $empleados): ?array
    {
        $coleccion = collect($empleados);

        if ($coleccion->isEmpty()) {
            return null;
        }

        return (array) $coleccion->sortByDesc('salario')->first();
    }
}
