<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterValidation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RegisterController extends Controller
{
    public function create(RegisterValidation $request): JsonResponse
    {
        // Create a new user
        $user = User::create($request->validated());

        // Get the role from the request
        $roleName = $request->input('role');

        // Find the role
        $role = Role::where('name', $roleName)->first();

        // If the role exists, assign it to the user
        if ($role) {
            $user->assignRole($role);
        }

        return response()->json([
            'message' => 'User ' . $user->name . ' created successfully',
        ], 200);
    }

    public function all(): JsonResponse
    {
        return response()->json([
            'users' => User::all()
        ], 200
        );
    }

    public function show($id): JsonResponse
    {
        $user = User::find($id);
        return response()->json([
            'user' => $user
        ], 200);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);
        $user->update($request->all());
        return response()->json([
            'message' => 'User updated successfully',
            'user_id' => $user->id
        ], 200);
    }

    public function delete(int $id): JsonResponse
    {
        $user = User::find($id);
        $user->delete();
        return response()->json([
            'message' => 'User deleted successfully',
            'user_id' => $user->id
        ], 200);
    }
}
