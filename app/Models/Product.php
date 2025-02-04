<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Define the table name (if it's different from the plural form of the model name)
    protected $table = 'products';

    // Specify the columns that can be mass-assigned
    protected $fillable = [
        'productName',
        'companyName',
        'category_id',
        'owned_imported',
        'price',
        'stock_quantity',
        'description',
        'images',
    ];

    // Cast the 'images' column to an array (so it's automatically converted from JSON)
    protected $casts = [
        'images' => 'array',  // Automatically cast the 'images' column to an array
    ];
}
