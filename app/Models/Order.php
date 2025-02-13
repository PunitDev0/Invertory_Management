<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Order extends Model
{
    use HasFactory;

    // Specify the table name (optional if the table name is pluralized version of the model)
    // The table associated with the model
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
    ];


    // Define any relationships if needed, for example, to fetch the associated product and user
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getUpdatedAtAttribute($value)
    {
        return date('d M y - h:i A', strtotime($value));
    }

    public function getCreatedAtAttribute($value)
    {
        return date('d M y - h:i A', strtotime($value));
    }
}