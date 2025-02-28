<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Specify the table name (optional if the table name is pluralized version of the model)
    protected $table = 'userorders';

    // The attributes that are mass assignable
    protected $fillable = [
        'user_id',
        'user_name',
        'user_email',
        'user_phone',
        'user_address',
        'user_city',
        'user_zip',
        'paid_payment',
        'total_amount',
        'pending_payment',
        'products', // Store the products as a JSON field
        'delivered_date',
        'status',
    ];

    // Cast the 'products' field to an array
    protected $casts = [
        'products' => 'array',  // Automatically cast the 'products' field to an array
    ];

    // Define the relationship between Order and OrderpaymentLog
    public function paymentLogs()
    {
        return $this->hasMany(OrderpaymentLog::class, 'order_id');
    }
}
