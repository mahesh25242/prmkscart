<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class ShopDeliveryController extends Controller
{


    public function deliveries(Request $request){

        $shopKey = $request->header('shopKey');
        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
            $shopId = ($shop) ? $shop->id : 0;
        }else{
            $shopKey = $request->input('shop_key');
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
            $shopId = ($shop) ? $shop->id : 0;
        }

        $deliveries = \App\ShopDelivery::where("shop_id", $shopId)->orderBy("sortorder", "ASC")->get();
        return response($deliveries);
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => ['required'],
            'charge' => ['required'],
        ]);

        if($validator->fails()){
            return response(['message' => 'Validation errors', 'errors' =>  $validator->errors(), 'status' => false], 422);
        }

        $shopKey = $request->header('shopKey');

        $deliveryInput = [
            "name" => $request->input("name", ''),
            "description" => $request->input("description", ''),
            "charge" => $request->input("charge", 0),
            "sortorder" => $request->input("sortorder", 0),
            "min_amount" => ($request->input("min_amount", 0) ? $request->input("min_amount", 0) : 0) ,
            "need_cust_loc" => $request->input("need_cust_loc", 0),
            "map_url" => $request->input("map_url", ''),
            "address" => $request->input("address", ''),
        ];
        if($request->input("id", 0)){
            \App\ShopDelivery::where('id', $request->input("id", 0))->update($deliveryInput);
            $shopDelivery = \App\ShopDelivery::find($request->input("id", 0));
        }else{
            if($shopKey){
                $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
                $deliveryInput["shop_id"] = ($shop) ? $shop->id : 0;
            }else{
                $shopKey = $request->input("shop_key");
                $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
                $deliveryInput["shop_id"] = ($shop) ? $shop->id : 0;
            }
            $shopDelivery = \App\ShopDelivery::create($deliveryInput);
        }
        return response(['data' => $shopDelivery, 'message' => 'successfully saved!', 'status' => true]);
    }

    public function delete(Request $request){
        $id = $request->input("id", 0);
        if($id){
            $shopDelivery = \App\ShopDelivery::where("id", $id)->delete();
        }
        return response(['message' => 'successfully deleted!', 'status' => true]);
    }




}
