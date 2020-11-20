<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class ShopsController extends Controller
{


    public function shops(Request $request){
        $shops = \App\Shop::get();
        return response($shops);
    }


    public function store(Request $request){

        $validator = Validator::make($request->all(), [
            'name' => ['required'],
            'status' => ['required'],
            'country_id' => 'required'
        ],[],[
            'country_id' => 'country',
        ]);




        if($validator->fails()){
            return response(['message' => 'Validation errors', 'errors' =>  $validator->errors(), 'status' => false], 422);
        }
        $input = $request->all();
        $input["shop_category_id"] = $request->input("shop_category_id.id", 0);
        $input["country_id"] = $request->input("country_id.id", 0);
        $input["state_id"] = $request->input("state_id.id", 0);
        $input["city_id"] = $request->input("city_id.id", 0);
        $input["shop_url"] = $request->input("shop_url", '');
        $input["shop_url"] = ($input["shop_url"]) ? $input["shop_url"] : '';

        if($request->input("id", 0)){
            $shop = \App\Shop::where('id', $request->input("id", 0))->update($input);
        }else{
            $input["shop_key"] = sha1(time());
            $shop = \App\Shop::create($input);
        }


        return response(['data' => $shop, 'message' => 'Account created successfully!', 'status' => true]);
    }

    public function delete(Request $request, $id=0){
       $shop =  \App\Shop::where('id', $id)->delete();
       return response(['message' => 'successfully deleted!', 'status' => true]);
    }

    public function getAShop(Request $request, $id=0){
       $shop =  \App\Shop::with(["country", "state",
       "city", "shopCategory", "userRole"=> function($q){
           $q->with(["user"])->where("role_id", 2);
       }])->where("shop_key", $id)->get()->first();
       return response($shop);
    }

    public function shopDetails(Request $request){
        $shopKey = $request->header('shopKey');

        $shopKey = ($shopKey) ? $shopKey : $request->input("shop_key");

        if($shopKey){
            $shop = \App\Shop::with(["country", "state", "city", "shopDelivery"])->where("shop_key", $shopKey)->get()->first();
            return response($shop);
        }else{
            return response(['message' => 'No data found!', 'status' => false]);
        }
    }

    public function updateDetails(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => ['required'],
            'phone' => ['required'],
            "country_id" => ["required"]
        ],[],[
            "country_id" => "country name"
        ]);

        if($validator->fails()){
            return response(['message' => 'Validation errors', 'errors' =>  $validator->errors(), 'status' => false], 422);
        }
        $phone = $request->input("phone", '');
        $phone = $request->input("country_id.phonecode", '91').$phone;
        $shopInput = [
            "name" => $request->input("name", ''),
            "phone" => $phone,
            "address" => $request->input("address", ''),
            "pin" => $request->input("pin", ''),
            "country_id" => $request->input("country_id.id", 0),
            "state_id" => $request->input("state_id.id", 0),
            "city_id" => $request->input("city_id.id", 0),
        ];
        $shopKey = $request->header('shopKey');
        $shopKey = ($shopKey) ? $shopKey : $request->input("shop_key",'');

        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        }else{
            $shopKey = $request->input("shop_key");
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        }

        \App\Shop::where('id', $shop->id)->update($shopInput);
        return response(['message' => 'successfully saved',  'status' => true]);
    }

    public function adminHomeStat(Request $request){

        $shopKey = $request->header('shopKey');
        $shopKey = ($shopKey) ? $shopKey : $request->input("shop_key",'');

        $shop = null;
        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        }else{
            $shopKey = $request->input("shop_key");
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        }
        $stat = [
            "products" => \App\ShopProduct::where("shop_id", $shop->id)->count(),
            "active_products" => \App\ShopProduct::where("shop_id", $shop->id)->where("status", 1)->count(),
            "categories" => \App\ShopProductCategory::where("shop_id", $shop->id)->count(),
            "active_categories" => \App\ShopProductCategory::where("shop_id", $shop->id)->where("status", 1)->count(),
            "orders" => \App\ShopOrder::where("shop_id", $shop->id)->count(),
            "cancelled" => \App\ShopOrder::where("shop_id", $shop->id)->where("status", 5)->count(),
            "delivered" => \App\ShopOrder::where("shop_id", $shop->id)->where("status", 4)->count(),
            "latest_orders" => \App\ShopOrder::with(["shopCustomer", 'shopDelivery'])->where("shop_id", $shop->id)->orderBy("id", "DESC")->take(10)->get(),
            "delivery_locations" => \App\ShopDelivery::where("shop_id", $shop->id)->count(),
        ];

        return response($stat);
    }
}
