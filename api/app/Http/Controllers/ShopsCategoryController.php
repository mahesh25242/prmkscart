<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
class ShopsCategoryController extends Controller
{
    public function categories(Request $request){
        $categories = \App\ShopCategory::get();
        return response($categories);
    }

    public function store(Request $request){

        $validationField = [
            'name' => ['required'],
            'status' => ['required'],
        ];



        $validator = Validator::make($request->all(), $validationField);


        if($validator->fails()){
            return response(['message' => 'Validation errors', 'errors' =>  $validator->errors(), 'status' => false], 422);
        }
        $input = $request->all();
        if($request->input("id", 0)){
            $shopCategory = \App\ShopCategory::where('id', $request->input("id", 0))->update($input);
        }else{
            $shopCategory = \App\ShopCategory::create($input);
        }


        return response(['data' => $shopCategory, 'message' => 'Account created successfully!', 'status' => true]);
    }

    public function delete(Request $request, $id=0){
       $shopCategory =  \App\ShopCategory::where('id', $id)->delete();
       return response(['message' => 'successfully deleted!', 'status' => true]);
    }

}
