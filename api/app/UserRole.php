<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class UserRole extends Model implements AuthenticatableContract, AuthorizableContract
{
    use HasApiTokens, Authenticatable, Authorizable, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'role_id', 'created_by', 'updated_by', 'deleted_by'
    ];


    protected static function boot()
    {
        parent::boot();

        static::created(function ($model) {
            if($model->role_id == 2){
                $firstName = strtolower($model->user->fname);
                $lastName = strtolower($model->user->lname);
                $url = Str::slug($firstName.$lastName);
                $i = 0;
                while(\App\User::whereUrl($url)->exists())
                {
                    $i++;
                    $url = Str::slug($firstName[0] . $lastName . Str::random(4));
                }

                $model->user->url = $url;
                $model->user->save();
            }


        });
    }


    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function role()
    {
        return $this->belongsTo('App\Role');
    }


}
