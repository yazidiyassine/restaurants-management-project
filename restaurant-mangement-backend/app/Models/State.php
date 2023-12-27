<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country_id'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'country_id'
    ];

    protected $primaryKey = 'id';

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function restaurants()
    {
        return $this->hasMany(Restaurant::class);
    }
}
