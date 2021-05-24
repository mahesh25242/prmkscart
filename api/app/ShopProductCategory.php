<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopProductCategory extends Model implements AuthenticatableContract, AuthorizableContract
{
    use HasApiTokens, Authenticatable, Authorizable, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shop_id', 'name', 'description', 'icon', 'url', 'status', 'sortorder',
        'created_by', 'updated_by', 'deleted_by', 'is_maticon'
    ];

    protected $casts = [
        'status' => 'boolean',
        'shop_id' => 'integer',
        'sortorder' => 'integer',
        'is_maticon' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
        'deleted_by' => 'integer'
    ];

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

    public function shopProduct()
    {
        return $this->hasMany('App\ShopProduct');
    }

}
