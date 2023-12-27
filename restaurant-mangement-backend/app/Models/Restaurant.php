<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Restaurant extends Model
{
    use HasFactory;
    use softDeletes;

    #The SoftDeletes trait helps us implement the archive records feature.
    protected $fillable = [
        'user_id',
        'name',
        'address_line_1',
        'address_line_2',
        'pincode',
        'city',
        'ispromoting',
        'image',
        'state_id',
        'country_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function tables()
    {
        return $this->hasMany(Table::class);
    }
}
