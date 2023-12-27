<?php

namespace App\Models;

use App\ModelStates\Table\TableState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\ModelStates\HasStates;

class Table extends Model
{
    use HasFactory, softDeletes, HasStates;

    protected $fillable = [
        'number',
        'extra_details',
        'restaurant_id'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'state' => TableState::class
    ];

    public function changeStatusTo(string $newStatus)
    {
        if (! $this->state->canTransitionTo($newStatus)) {
            $newStatusLabel = (new $newStatus($this))->label();

            abort(
                417,
                'The status of the table cannot be changed to ' . $newStatusLabel . ' from the current status of ' . $this->state->label() . '.'
            );
        }

        $this->state->transitionTo($newStatus);

    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
