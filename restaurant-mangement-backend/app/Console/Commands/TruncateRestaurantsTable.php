<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TruncateRestaurantsTable extends Command
{
    protected $signature = 'truncate:restaurants';

    protected $description = 'Truncate the restaurants table';

    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('restaurants')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('Restaurants table truncated successfully.');
    }
}
# php artisan truncate:restaurants
