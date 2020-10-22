<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use Cache;
use Carbon\Carbon;
class ShopAccessMiddleWare
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
            $shop = \App\Shop::where("shop_key",$shopKey)->get()->first();

            if($shop->status)
                return $next($request);

            else
                return response('Shop was inactive.', 402);
        }else{
            return $next($request);
        }
    }
}
