<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Empleado extends Model
{
    protected $connection = 'mongodb';
    protected $fillable = ['nombre', 'puesto', 'salario'];
}
