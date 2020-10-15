<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shop extends Model implements AuthenticatableContract, AuthorizableContract
{
    use HasApiTokens, Authenticatable, Authorizable, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'phone', 'address', 'country_id',
        'state_id', 'city_id', 'pin', 'local', 'map',
        'shop_key', 'status', 'shop_category_id',
         'created_by', 'updated_by', 'deleted_by'
    ];

    protected $appends = array('status_text');

    public function getStatusTextAttribute()
    {
        return (($this->status) ? 'Active' : 'In-Active');
    }


    public function country()
    {
        return $this->belongsTo('App\Country');
    }

    public function state()
    {
        return $this->belongsTo('App\State');
    }

    public function city()
    {
        return $this->belongsTo('App\City');
    }

    public function user()
    {
        return $this->belongsTo('App\User', 'created_by');
    }



    public function shopProduct()
    {
        return $this->hasMany('App\ShopProduct');
    }

    public function shopProductCategory()
    {
        return $this->hasMany('App\ShopProductCategory');
    }

    public function userRole()
    {
        return $this->hasOne('App\UserRole');
    }

    public function shopCategory()
    {
        return $this->belongsTo('App\ShopCategory');
    }



}
