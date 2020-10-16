<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
class ShopProductCategoryController extends Controller
{
    public function categories(Request $request){
        $shopKey = $request->header('shopKey');
        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
            $shopId = ($shop) ? $shop->id : 0;
        }else{
            $shopId = $request->input("id", 0);
        }
        $categories = \App\ShopProductCategory::where("shop_id", $shopId)->get();
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

        $shopKey = $request->header('shopKey');


        if($request->input("id", 0)){
            $shopCategory = \App\ShopProductCategory::where('id', $request->input("id", 0))->update($input);
        }else{
            if($shopKey){
                $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
                $input["shop_id"] = ($shop) ? $shop->id : 0;
            }else{
                $input["shop_id"] = $request->input("shop_id", 0);
            }
            $shopCategory = \App\ShopProductCategory::create($input);
        }


        return response(['data' => $shopCategory, 'message' => 'Account created successfully!', 'status' => true]);
    }

    public function delete(Request $request){
       $shopCategory =  \App\ShopProductCategory::where('id', $request->input("id"))->delete();
       return response(['message' => 'successfully deleted!', 'status' => true]);
    }

}
