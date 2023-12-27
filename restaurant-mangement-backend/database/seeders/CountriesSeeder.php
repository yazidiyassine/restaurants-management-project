<?php

namespace Database\Seeders;

use Flynsarmy\CsvSeeder\CsvSeeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CountriesSeeder extends CsvSeeder
{
    /**
     * Run the database seeds.
     *
     */
    # php artisan db:seed --class=CountriesSeeder
    public function __construct()
    {
        $this-> table = 'countries';
        $this-> filename = base_path() . '/database/seeders/csvs/countries.csv';
    }
    public function run(): void
    {
        DB::disableQueryLog();
        parent::run();
        Cache::forget('countries');
    }
}
