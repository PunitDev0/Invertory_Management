<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Login method
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to find the user based on the email
        $user = User::where('email', $validated['email'])->first();

        // Check if the user exists and the password matches
        if ($user && $user->password === $validated['password']) {
            Auth::login($user);

           // Return a success response, but no redirect here
        return response()->json([
            'message' => 'Login successful',
            'redirect' => '/dashboard', // Provide the redirect URL
        ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    
    // Register method
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,user,manager',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password), // Hash the password
        ]);

        // Automatically log in the newly created user
        Auth::login($user);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    // Logout method
    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    // Google login (placeholder for integration with a service like Laravel Socialite)
    public function loginWithGoogle(Request $request)
    {
        // This should handle login via Google OAuth, you can use Laravel Socialite to help with this.
    }
}
