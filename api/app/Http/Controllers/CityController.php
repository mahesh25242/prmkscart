<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CityController extends Controller
{


    public function cities(Request $request){
        $cities = \App\City::where("state_id", $request->input("state_id", 0))->get();
        return response($cities);
    }




}
