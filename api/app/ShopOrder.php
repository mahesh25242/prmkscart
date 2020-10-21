<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopOrder extends Model implements AuthenticatableContract, AuthorizableContract
{
    use HasApiTokens, Authenticatable, Authorizable, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
         'shop_id', 'shop_customer_id', 'total', 'delivery_chage', 'address',
         'pin', 'note', 'loc', 'status'
    ];

    public function shop()
    {
        return $this->belongsTo('App\Shop');
    }

    public function shopCustomer()
    {
        return $this->belongsTo('App\ShopCustomer');
    }

}
