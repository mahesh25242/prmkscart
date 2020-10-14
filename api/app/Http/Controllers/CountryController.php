<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CountryController extends Controller
{


    public function countries(Request $request){
        $countries = \App\Country::all();
        return response($countries);
    }




}
