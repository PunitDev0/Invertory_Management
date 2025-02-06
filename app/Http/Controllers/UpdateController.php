<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UpdateController extends Controller
{
    /**
     * Update user details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id  The ID of the user to update.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate the update request
        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'role'     => 'sometimes|string|max:255',
          
        ]);

        // Update user fields if they are provided in the request
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('role')) {
            $user->role = $request->role;
        }
        // Save updated user details
        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user,
        ], 200);
    }
}
