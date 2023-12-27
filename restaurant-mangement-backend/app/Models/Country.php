<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];
    protected $primaryKey = 'id';

    public function states()
    {
        return $this->hasMany(State::class);
    }

    public function restaurants()
    {
        return $this->hasMany(Restaurant::class);
    }
}
