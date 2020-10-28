<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopProduct extends Model implements AuthenticatableContract, AuthorizableContract
{
    use HasApiTokens, Authenticatable, Authorizable, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shop_id', 'name', 'description', 'url', 'status', 'sortorder',
        'shop_product_category_id', 'created_by', 'updated_by', 'deleted_by'
    ];


    public static function boot() {
        parent::boot();

        static::deleting(function($shopProduct) { // before delete() method call this
             $shopProduct->shopProductImage()->delete();
             $shopProduct->shopProductVariant()->delete();
             // do the rest of the cleanup...
        });
    }

    protected $appends = array('status_text');

    public function getStatusTextAttribute()
    {
        return (($this->status) ? 'Active' : 'In-Active');
    }



    public function user()
    {
        return $this->belongsTo('App\User', 'created_by');
    }

    public function shop()
    {
        return $this->belongsTo('App\Shop');
    }

    public function shopProductImage()
    {
        return $this->hasMany('App\ShopProductImage');
    }

    public function shopProductVariant()
    {
        return $this->hasMany('App\ShopProductVariant');
    }

    public function shopProductPrimaryVariant()
    {
        return $this->hasOne('App\ShopProductVariant')->where("is_primary", 1);
    }

    public function shopProductCategory()
    {
        return $this->belongsTo('App\ShopProductCategory');
    }


}
