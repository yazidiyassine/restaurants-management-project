<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class LoginController extends Controller
{
    protected function respondWithToken($token, $user)
    {
        $token_status = $token ? 200 : 511; // Adjusted token status logic
        return response()->json([
            'access_token' => $token,
            'user' => $user,
        ], $token_status);
    }

    public function __invoke(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        try {
            $user = User::where('email', $credentials['email'])->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            $token = JWTAuth::fromUser($user);

            if (!$token) {
                return response()->json(['error' => 'Could not create token'], 500);
            }

        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        return $this->respondWithToken($token, $user);
    }
}
