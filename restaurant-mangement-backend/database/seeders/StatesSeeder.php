<?php

namespace Database\Seeders;

use Flynsarmy\CsvSeeder\CsvSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatesSeeder extends CsvSeeder
{
    /**
     * Run the database seeds.
     */
    public function __construct()
    {
        $this-> table = 'states';
        $this-> filename = base_path() . '/database/seeders/csvs/states.csv';
    }
    public function run(): void
    {
        DB::disableQueryLog();
        parent::run();
        Cache::forget('states');
    }
}
# q: how to run this seeder?
# a: php artisan db:seed --class=StatesSeeder
