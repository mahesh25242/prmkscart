<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StateController extends Controller
{


    public function states(Request $request){
        $states = \App\State::where("country_id", $request->input("country_id", 0))->get();
        return response($states);
    }




}
