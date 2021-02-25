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
         'pin', 'note', 'loc', 'status', 'shop_delivery_id',
         'delivery_at', 'web_push_token', 'sec_key'
    ];

    public static function boot() {
        parent::boot();

        static::created(function($shopOrder) {
            $shopOrder->sec_key =  sha1(time().'-'.$shopOrder->id);
            $shopOrder->save();
        });
    }


    protected $appends = array('status_text');

    public function getStatusTextAttribute()
    {
        switch($this->status){
            case 1:
                return 'Ordered';
            break;
            case 2:
                return 'Confirm';
            break;
            case 3:
                return 'Out For Delivery';
            break;
            case 4:
                return 'Delivered';
            break;
            case 5:
                return 'Canceled';
            break;

        }
    }

    public function getLocAttribute($loc)
    {
        return ($loc && !is_array($loc)) ? json_decode($loc) : $loc;
    }

    public function shop()
    {
        return $this->belongsTo('App\Shop');
    }

    public function shopCustomer()
    {
        return $this->belongsTo('App\ShopCustomer');
    }


    public function shopDelivery()
    {
        return $this->belongsTo('App\ShopDelivery');
    }


    public function shopOrderItem()
    {
        return $this->hasMany('App\ShopOrderItem');
    }

}
