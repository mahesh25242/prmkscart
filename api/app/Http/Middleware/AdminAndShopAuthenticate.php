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
            })->where("id", Auth::id())->exists();
            if($exists)
                return $next($request);
        }
        if (Auth::check() )
        {
             if(\App\User::has("isSuperAdmin")->find(Auth::id())->exists())
                 return $next($request);
        }
        return response('Unauthorized.', 401);
    }
}
