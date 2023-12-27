<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuItem extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        'name',
        'description',
        'restaurant_id',
        'price',
        'image'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
