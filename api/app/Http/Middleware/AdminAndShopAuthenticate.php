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
            if(\App\User::find(Auth::id())->isSuperAdmin()->exists())
                return $next($request);

            $isApps = $request->header('IsApps');
            if($isApps){
                $user = \App\User::find(Auth::id());
                if($user->userRole->count() && $user->userRole->first()->shop()->count() &&
                $user->userRole->first()->shop()->get()->first()->shop_key){
                    $request->headers->set('shopKey', $user->userRole->first()->shop()->get()->first()->shop_key);
                    return $next($request);
                }
            }


        }
        return response('Unauthorized.', 401);
    }
}
