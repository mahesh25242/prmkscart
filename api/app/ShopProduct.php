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
        'shop_id', 'name', 'description', 'status', 'sortorder',
        'shop_product_category_id', 'created_by', 'updated_by', 'deleted_by',
    ];



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

    public function shopProductCategory()
    {
        return $this->belongsTo('App\ShopProductCategory');
    }


}
