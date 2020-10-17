<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopProductImage extends Model implements AuthenticatableContract, AuthorizableContract
{
    use HasApiTokens, Authenticatable, Authorizable, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shop_product_id', 'shop_product_variant_id', 'image', 'sortorder',
        'created_by', 'updated_by', 'deleted_by'
    ];






    public function user()
    {
        return $this->belongsTo('App\User', 'created_by');
    }

    public function shopProduct()
    {
        return $this->belongsTo('App\ShopProduct');
    }

    public function shopProductVariant()
    {
        return $this->belongsTo('App\ShopProductVariant');
    }

}
