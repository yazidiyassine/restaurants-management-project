<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#php artisan make:command TruncateTables
# php artisan truncate:tables
class TruncateTables extends Command
{
    protected $signature = 'truncate:tables';

    protected $description = 'Truncate all tables in the database';

    public function handle(): void
    {
        $tables = ['restaurants','countries', 'states', 'users', 'menu_items'];

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->info('All tables truncated successfully.');
    }
}
# php artisan truncate:tables
