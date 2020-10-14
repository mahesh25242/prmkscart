<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;
use Exception;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class SiteMaintenanceMiddleware
{
    protected $jwt;
    public function __construct(JWTAuth $jwt)
    {
        $this->jwt = $jwt;
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
    //     $site_down = \App\Setting::where('setname', "site_down")->get()->first();
    //   //  $site_downTxt = \App\Setting::where('setname', "landing_page")->get()->first();


    //     if($site_down && $site_down->setvalue == "1" && Auth::user() && Auth::user()->user_type !==1 && !Auth::user()->block_user){
    //        // $this->jwt->invalidate($this->jwt->getToken());
    //         //return $next($request);
    //         return response()->json([
    //             'message' => 'site under maintance',
    //             'code' => 'login_restricted'], 410);
    //     }else{
    //         return $next($request);
    //     }
        return $next($request);
    }
}
