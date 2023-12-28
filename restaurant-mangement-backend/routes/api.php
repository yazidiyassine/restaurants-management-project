<?php

use App\Http\Controllers\CountryController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MenuItemsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\TableStatusController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/login', function () {
    return "Unauthenticated";
})->name('login');

Route::post('/register', [RegisterController::class, 'create']);
Route::post('/login', LoginController::class);


Route::get('/all-restaurants', [RestaurantController::class, 'all']);
Route::get('/get-restaurant-info/{restaurantId}', [RestaurantController::class, 'getInfo']);
Route::get('/list-menu-items', [MenuItemsController::class, 'listMenuItems']);



Route::middleware(['auth'])->group(function () {
    Route::post('/update/{id}', [RegisterController::class, 'update']);

    Route::middleware(['admin_or_manager'])->group(function (){
        Route::middleware('restaurant_required_ownership')->group(function () {
            Route::prefix('menu_items')->group(function () {
                Route::post('/add', [MenuItemsController::class, 'store']);
                Route::post('/update/{menuItem_id}', [MenuItemsController::class, 'update'])->name('update_menu_item');
                Route::delete('/archive/{menuItem_id}', [MenuItemsController::class, 'archive']);
            });


            Route::prefix('tables')->group(function () {
                Route::post('/add', [TableController::class, 'store']);
                Route::post('/update/{table_id}', [TableController::class, 'update']);
                Route::delete('/archive/{table_id}', [TableController::class, 'archive']);

                Route::post('/mark-as-non-operational/{tableId}', [TableStatusController::class, 'markAsNonOperational']);
                Route::post('/mark-as-available/{tableId}', [TableStatusController::class, 'markAsAvailable']);
                Route::post('/mark-as-reserved/{tableId}', [TableStatusController::class, 'markAsReserved']);
                Route::post('/mark-as-occupied/{tableId}', [TableStatusController::class, 'markAsOccupied']);
            });

        });


        Route::prefix('restaurants')->group(function () {
            Route::post('/add', [RestaurantController::class, 'store']);
            Route::post('/update/{restaurant_id}', [RestaurantController::class, 'update']);
            Route::delete('/archive/{restaurant_id}', [RestaurantController::class, 'archive']);
        });
        Route::middleware(['admin'])->group(function () {
            Route::prefix('users')->group(function () {
                Route::post('/update/{id}', [RegisterController::class, 'update']);
                Route::delete('/archive/{id}', [RegisterController::class, 'delete']);
                Route::get('/all', [RegisterController::class, 'all']);
                Route::post('/add-state', [StateController::class, 'create']);
                Route::post('/add-country', [CountryController::class, 'create']);
            });
        });
    });


   /* Route::middleware(['customer'])->group(function () {
        Route::prefix('orders')->group(function () {
            Route::get('/list', [OrderController::class, 'list']);
            Route::get('/details/{orderId}', [OrderController::class, 'details']);
            Route::post('/book-a-table/{tableId}', [OrderController::class, 'bookATable']);
            Route::post('/complete/{orderId}', [OrderController::class, 'complete']);
        });

        Route::prefix('order-items')->group(function () {
            Route::post('/add/{orderId}', [OrderItemController::class, 'add']);
            Route::post('/change-quantity/{orderId}', [OrderItemController::class, 'changeQuantity']);
            Route::post('/remove/{orderId}', [OrderItemController::class, 'remove']);
        });
        Route::get('/all-user-orders', [OrderController::class, 'allUserOrders']);

    });*/

    Route::get('/all-user-orders', [OrderController::class, 'allUserOrders']);
    Route::get('/get-countries', [CountryController::class, 'get']);
    Route::get('/get-states', [StateController::class, 'list']);
    Route::get('/get-country/{id}', [CountryController::class, 'show']);
    Route::get('/get/{restaurantId}', [RestaurantController::class, 'show']);



    Route::prefix('tables')->group(function () {
        Route::get('/list', [TableController::class, 'list']);
        Route::get('/list/{restaurant_id}', [TableController::class, 'show']);
    });
    Route::middleware(['restaurant_required'])->group(function (){
        Route::prefix('orders')->group(function () {
            Route::post('/book-a-table/{tableId}', [OrderController::class, 'bookATable']);
            Route::get('/details/{orderId}', [OrderController::class, 'details']);
            Route::get('/list-open', [OrderController::class, 'listOpen']);
            Route::get('/list-completed', [OrderController::class, 'listCompleted']);
            Route::post('/complete/{orderId}', [OrderController::class, 'complete']);
            Route::get('/list', [OrderController::class, 'list']);
        });
        Route::prefix('order-items')->group(function () {
            Route::post('/add/{orderId}', [OrderItemController::class, 'add']);
            Route::get('/list/{orderId}', [OrderItemController::class, 'list']);
            Route::post('/remove/{orderId}', [OrderItemController::class, 'remove']);
            Route::post('/change-quantity/{orderId}', [OrderItemController::class, 'changeQuantity']);
        });
    });




    Route::prefix('menu_items')->group(function () {
        Route::get("/list/{id}", [MenuItemsController::class, "listItems"]);
        Route::get('/list', [MenuItemsController::class, 'list']);
    });

    Route::prefix('restaurants')->group(function () {
        Route::get('/list', [RestaurantController::class, 'list']);
        Route::get('/get/{restaurantId}', [RestaurantController::class, 'show']);
    });
});

