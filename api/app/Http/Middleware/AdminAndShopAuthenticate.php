<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use Cache;
use Carbon\Carbon;
class AdminAndShopAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $shopKey = $request->header('shopKey');
        if($shopKey){
            $exists = \App\User::whereHas("userRole.shop", function($q) use($shopKey){
                $q->where("shop_key", $shopKey);
            })->where("status", 1)->where("id", Auth::id())->exists();
            if($exists)
                return $next($request);
        }

        if (Auth::check() )
        {
            // $user = \App\User::find(Auth::id())->get()->first();

            // if($user->userRole->shop && $user->userRole->shop->first()->shop_key){
            //     $request->headers->set('shop_key', $user->userRole->shop->shop_key);
            //     return $next($request);
            // }

             if(\App\User::find(Auth::id())->isSuperAdmin()->exists())
                 return $next($request);
        }
        return response('Unauthorized.', 401);
    }
}
