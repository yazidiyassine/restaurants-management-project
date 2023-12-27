<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TruncateStatesTable extends Command
{
    protected $signature = 'truncate:states';

    protected $description = 'Truncate the states table';

    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('states')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('States table truncated successfully.');
    }
}
// # php artisan truncate:states
