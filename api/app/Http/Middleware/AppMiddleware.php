<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use Cache;
use Carbon\Carbon;
class AppMiddleware
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
        $isApps = $request->header('IsApps');
        if(!$shopKey && $isApps && Auth::check()){

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
        return $next($request);

    }
}
