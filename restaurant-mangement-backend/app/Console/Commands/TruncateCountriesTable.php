<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TruncateCountriesTable extends Command
{
    protected $signature = 'truncate:countries';

    protected $description = 'Truncate the countries table';

    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('countries')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('Countries table truncated successfully.');
    }
}
// # php artisan truncate:countries
