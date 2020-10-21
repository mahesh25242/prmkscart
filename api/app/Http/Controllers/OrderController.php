<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class OrderController extends Controller
{


    public function createOrder(Request $request){

        $validator = Validator::make($request->all(), [
            'name' => ['required'],
            'phone' => ['required'],
            'cart' => ['required'],
            'selectedLocation' => ['required'],
        ],[],[
            'selectedLocation' => 'Delivery Location',
        ]);

        if($validator->fails()){
            return response(['message' => 'Validation errors', 'errors' =>  $validator->errors(), 'status' => false], 422);
        }

        $shop = null;
        $shopKey = $request->header('shopKey');
        $shopKey = ( $shopKey ) ?  $shopKey  :$request->input("shop_key");
        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        }
        if($shop){
            $shopCustomer = \App\ShopCustomer::updateOrCreate(
                [
                    "name" => $request->input("name", ''),
                    "email" => $request->input("email", ''),
                    "phone" => $request->input("phone", ''),
                    "shop_id" => $shop->id,
                ],
                [
                    "name" => $request->input("name", ''),
                    "email" => $request->input("email", ''),
                    "phone" => $request->input("phone", ''),
                    "shop_id" => $shop->id,
                ]
            );
            if($shopCustomer->id){
                $shopDelivery = \App\ShopDelivery::find($request->input("selectedLocation.id", 0));
                $shopOrder = new \App\ShopOrder;
                $shopOrder->shop_id =  $shop->id;
                $shopOrder->shop_customer_id =  $shopCustomer->id;
                $shopOrder->delivery_chage =  ($shopDelivery) ? $shopDelivery->charge : 0;
                $shopOrder->address =  $request->input("address", '');
                $shopOrder->pin =  $request->input("pin", '');
                $shopOrder->note =  $request->input("note", '');
                $shopOrder->loc =  $request->input("loc", null);

                $shopOrder->total =  $request->input("grad_total", 0);
                $shopOrder->save();
                $totalPrice = 0;
                if($shopOrder->id){
                    $cart = $request->input("cart", null);
                    if(is_array($cart) && !empty($cart)){
                        foreach($cart as $crt){
                            if($crt["product"]["shop_product_selected_variant"]["id"]){
                                $shopProductVarient = \App\ShopProductVariant::find($crt["product"]["shop_product_selected_variant"]["id"]);
                                if($shopProductVarient->id){
                                    $shopOrderItem = new \App\ShopOrderItem;
                                    $shopOrderItem->shop_order_id = $shopOrder->id;
                                    $shopOrderItem->shop_product_variant_id = $crt["product"]["shop_product_selected_variant"]["id"];
                                    $shopOrderItem->qty = $crt["qty"];
                                    $shopOrderItem->price = $crt["qty"] * $shopProductVarient->price;
                                    $shopOrderItem->save();
                                    $totalPrice += $shopOrderItem->price;
                                }

                            }

                        }
                    }
                    $totalPrice += $shopOrder->delivery_chage;
                    $shopOrder->total =  $totalPrice;
                    $shopOrder->save();
                }else{
                    return response(['message' => 'sorry order cant\'t be created', 'status' => false], 422);
                }
            }else{
                return response(['message' => 'sorry customer can\t be added', 'status' => false], 422);
            }
        }else{
            return response(['message' => 'sorry shop is unavailable', 'status' => false], 422);
        }
        return response(['message' => 'successfully placed order', 'status' => 1]);
    }

    public function orders(Request $request){
        $perPage = 20;
        $shop = null;
        $shopKey = $request->header('shopKey');
        $shopKey = ( $shopKey ) ?  $shopKey  :$request->input("shop_key");
        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        }
        $orders = \App\ShopOrder::where("shop_id", $shop->id)->paginate($perPage);
        return response($orders);
    }



}
