<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
class ShopProductController extends Controller
{
    public function products(Request $request){
        $shopKey = $request->header('shopKey');
        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
            $shopId = ($shop) ? $shop->id : 0;
        }else{
            $shopId = $request->input("id", 0);
        }
        $categories = \App\ShopProduct::with(["shopProductCategory", "shopProductVariant.shopProductImage"])->where("shop_id", $shopId)->get();
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

        $shop_product_category_id = 0;
        if( $request->input("shop_product_category_id", 0) && $request->input("shop_product_category_id", 0)!= 'null'){
            $shop_product_category_id = $request->input("shop_product_category_id", 0);
        }
        $productIns = [
            "name" => $request->input("name", ''),
            "description" => $request->input("description", ''),
            "status" => $request->input("status", 1),
            "sortorder" => $request->input("sortorder", 1),
            "shop_product_category_id" => 0,
        ];

        $shopKey = $request->header('shopKey');

        if($request->input("id", 0)){
            $shopProduct = \App\ShopProduct::where('id', $request->input("id", 0))->update($productIns);
        }else{
            if($shopKey){
                $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
                $productIns["shop_id"] = ($shop) ? $shop->id : 0;
            }else{
                $productIns["shop_id"] = $request->input("shop_id", 0);
            }
            $shopProduct = \App\ShopProduct::create($productIns);
        }

        $variants = $request->input("variants", null);
        if($variants && is_array($variants) && !empty($variants)){
            foreach($variants as $ind=>$variant){
                $shopProductVariant = \App\ShopProductVariant::updateOrCreate(
                    [
                     "shop_product_id" =>  $shopProduct->id,
                     "name" =>  $variant["name"],
                     "actual_price" =>  $variant["actual_price"],
                     "price" =>  $variant["price"],
                    ],
                    [
                    "shop_product_id" =>  $shopProduct->id,
                     "name" =>  $variant["name"],
                     "actual_price" =>  $variant["actual_price"],
                     "price" =>  $variant["price"],
                     "sortorder" =>  $variant["sortorder"],
                     "status" =>  1,
                     "created_by" =>  Auth::id(),
                     "updated_by" =>  Auth::id(),
                    ]
                );
                $productImg = null;
                if ($request->hasFile("variants.{$ind}.image")) {
                    $productImg = sprintf("%s.%s",time(), $request->file("variants.{$ind}.image")->extension());
                    $destinationPath = "assets/shop/".$productIns["shop_id"].'/products';
                    $request->file("variants.{$ind}.image")->move($destinationPath, $productImg);

                }
                if($productImg){
                    \App\ShopProductImage::updateOrCreate(
                        [
                         "shop_product_id" =>  $shopProduct->id,
                         "shop_product_variant_id" =>  $shopProductVariant->id
                        ],
                        [
                            "shop_product_id" =>  $shopProduct->id,
                            "shop_product_variant_id" =>  $shopProductVariant->id,
                            "image" =>  $productImg,
                            "sortorder" =>  1,
                            "created_by" =>  Auth::id(),
                            "updated_by" =>  Auth::id()
                        ]
                    );
                }

            }
        }

        return response(['data' => $shopProduct, 'message' => 'Account created successfully!', 'status' => true]);
    }

    public function delete(Request $request){
       $shopCategory =  \App\ShopProduct::where('id', $request->input("id"))->delete();
       return response(['message' => 'successfully deleted!', 'status' => true]);
    }

}
