<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopProductVariant extends Model implements AuthenticatableContract, AuthorizableContract
{
    use HasApiTokens, Authenticatable, Authorizable, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shop_product_id',  'name', 'description', 'actual_price', 'price', 'sortorder',
        'status', 'is_primary', 'type', 'created_by', 'updated_by', 'deleted_by'
    ];

    public static function boot() {
        parent::boot();

        static::deleting(function($shopProductVariant) { // before delete() method call this
             $shopProductVariant->shopProductImage()->delete();
             // do the rest of the cleanup...
        });
    }



    public function getTypeAttribute($type)
    {
        return (($type) ? json_decode($type) : null);
    }

    public function user()
    {
        return $this->belongsTo('App\User', 'created_by');
    }

    public function shopProduct()
    {
        return $this->belongsTo('App\ShopProduct');
    }

    public function shopProductImage()
    {
        return $this->hasOne('App\ShopProductImage', 'shop_product_variant_id');
    }

    public function shopOrderItem()
    {
        return $this->hasMany('App\ShopOrderItem');
    }

}
