<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ShopProductController extends Controller
{
    public function showProducts(Request $request){
        $request->request->add(['status' => 1]);
        return $this->products($request);
    }

    public function products(Request $request){
        $perPage = $request->input("pageSize", 20);
        $shopKey = $request->header('shopKey');
        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
            $shopId = ($shop) ? $shop->id : 0;
        }else{
            $shopKey = $request->input('shop_key');
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
            $shopId = ($shop) ? $shop->id : 0;
        }

        $products = \App\ShopProduct::with(["shopProductCategory", "shopProductPrimaryVariant.shopProductImage",
        "shopProductVariant.shopProductImage"])->where("shop_id", $shopId);

        if($request->input("status", 0)){
            $products =  $products->where("status", $request->input("status", 0));
        }

        if($request->input("shop_product_category_id", 0)){
            $products = $products->where("shop_product_category_id", $request->input("shop_product_category_id", 0));
        }
        if($request->input("cat_url", null)){
            $products = $products->whereHas("shopProductCategory", function($q) use($request){
                $q->where("url", $request->input("cat_url", null));
            });
        }

        if($request->input("q", null)){
            $q = $request->input("q", null);
            $products = $products->where("name", 'like', "%{$q}%");
            $products = $products->orwhereHas("shopProductCategory", function($qry) use($q){
                $qry->where("name", 'like', "%{$q}%");
            });
        }
        return response($products->orderBy("sortorder", 'ASC')->paginate($perPage ));
    }

    public function store(Request $request){

        $validationField = [
            'name' => ['required'],
            'status' => ['required'],
            'variants.*.name' => ['required', 'string'],
            'variants.*.price' => ['required', 'integer'],
        ];



        $validator = Validator::make($request->all(), $validationField, [], [
            'variants.*.name' => 'variant name',
            'variants.*.price' => 'variant price',
        ]);


        if($validator->fails()){
            return response(['message' => 'Validation errors', 'errors' =>  $validator->errors(), 'status' => false], 422);
        }

        $shop_product_category_id = 0;
        if( $request->input("shop_product_category_id", 0) && $request->input("shop_product_category_id", 0)!= 'null'){
            $shop_product_category_id = $request->input("shop_product_category_id", null);
            if($shop_product_category_id){
                $shop_product_category_id = json_decode($shop_product_category_id);
                $shop_product_category_id = $shop_product_category_id->id;
            }
        }
        $productIns = [
            "name" => $request->input("name", ''),
            "description" => $request->input("description", ''),
            "status" => $request->input("status", 1),
            "sortorder" => $request->input("sortorder", 1),
            "shop_product_category_id" => $shop_product_category_id,
            "url" => \Illuminate\Support\Str::slug($request->input("name", ''), '-')
        ];

        $shopKey = $request->header('shopKey');

        if($request->input("id", 0)){
            \App\ShopProduct::where('id', $request->input("id", 0))->update($productIns);
            $shopProduct = \App\ShopProduct::find($request->input("id", 0));
        }else{
            if($shopKey){
                $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
                $productIns["shop_id"] = ($shop) ? $shop->id : 0;
            }else{
                $shopKey = $request->input("shop_key");
                $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
                $productIns["shop_id"] = ($shop) ? $shop->id : 0;
            }
            $shopProduct = \App\ShopProduct::create($productIns);
        }

        $variants = $request->input("variants", null);
        if($shopProduct && $variants && is_array($variants) && !empty($variants)){
            $insVariantId = [];
            foreach($variants as $ind=>$variant){
                $shopProductVariant = \App\ShopProductVariant::updateOrCreate(
                    [
                     "shop_product_id" =>  $shopProduct->id,
                     "id" =>  $variant["id"],
                    ],
                    [
                    "shop_product_id" =>  $shopProduct->id,
                     "name" =>  $variant["name"],
                     "description" =>  $variant["description"],
                     "is_primary" =>  $variant["is_primary"],
                     "type" =>  $variant["type"],
                     "actual_price" =>  ($variant["price"] >= $variant["actual_price"]) ? 0 : $variant["actual_price"],
                     "price" =>  $variant["price"],
                     "sortorder" =>  $variant["sortorder"],
                     "status" =>  1,
                     "created_by" =>  Auth::id(),
                     "updated_by" =>  Auth::id(),
                    ]
                );
                $insVariantId[] = $shopProductVariant->id;

                $productImg = null;

                if ($request->hasFile("variants.{$ind}.image")) {
                    $uniqid = Str::random(9);
                    $productImg = sprintf("%s.%s",time().$uniqid, $request->file("variants.{$ind}.image")->extension());
                    $destinationPath = "assets/shop/".$shopProduct->shop->shop_key.'/products';
                    $request->file("variants.{$ind}.image")->move($destinationPath, $productImg);

                    // $img = Image::make($destinationPath.'/'.$productImg)->encode('webp');
                    // $img->save($destinationPath.pathinfo($productImg, PATHINFO_FILENAME).'.webp');

                    // $productImg = pathinfo($productImg, PATHINFO_FILENAME).'.webp';

                    if(Storage::disk('public')->exists(str_replace("assets/", "", $destinationPath)."/{$productImg}")){
                        Storage::disk('public')->delete(str_replace("assets/", "", $destinationPath)."/{$productImg}");
                    }

                    if(!Storage::disk('public')->exists("shop/index.html")){
                        Storage::disk('public')->put("shop/index.html", 'unauthorised access');
                    }

                    if(!Storage::disk('public')->exists("shop/{$shopProduct->shop->shop_key}/index.html")){
                        Storage::disk('public')->put("shop/{$shopProduct->shop->shop_key}/index.html", 'unauthorised access');
                    }

                    if(!Storage::disk('public')->exists("shop/{$shopProduct->shop->shop_key}/category/index.html")){
                        Storage::disk('public')->put("shop/{$shopProduct->shop->shop_key}/category/index.html", 'unauthorised access');
                    }

                    if(!Storage::disk('public')->exists("shop/{$shopProduct->shop->shop_key}/products/index.html")){
                        Storage::disk('public')->put("shop/{$shopProduct->shop->shop_key}/products/index.html", 'unauthorised access');
                    }

                    $img = Image::make($destinationPath.'/'.$productImg)->resize(350, null, function ($constraint) {
                        $constraint->aspectRatio();
                    });


                    $img->text($shopProduct->shop->name, 20, 20, function($font) {
                        $font->size(24);
                        $font->color(array(255, 255, 255, 0.5));

                    });


                    $img->save($destinationPath.'/'.$productImg, 60);



                    if($shopProduct->shop->shop_url){
                        try{
                            $client = new \GuzzleHttp\Client(['headers' =>
                            [
                                'shopKey' => $shopProduct->shop->shop_key,
                                'type' => 'product'
                            ]
                            ]);
                            $res = $client->post("{$shopProduct->shop->shop_url}/copy-file.php", [
                                "form_params" => [
                                    "file"=>$productImg,
                                    "action" => "copy"
                                ]
                            ]);
                            $statusCode = $res->getStatusCode(); // 200
                            if($statusCode == 200){
                                $copyresponse = $res->getBody();
                                $copyresponse = json_decode($copyresponse, true);
                                if(isset($copyresponse["success"]) && $copyresponse["success"]){
                                    Storage::disk('public')->delete("shop/{$shopProduct->shop->shop_key}/products/{$productImg}");
                                }
                            }

                        }catch(Exception $e) {

                        }



                    }

                }

                if($productImg){
                    $shopProductImage = \App\ShopProductImage::where("shop_product_id", $shopProduct->id)
                    ->where("shop_product_variant_id", $shopProductVariant->id)->get()->first();
                    if($shopProductImage){
                        if(Storage::disk('public')->exists("shop/{$shopProduct->shop->shop_key}/products/{$shopProductImage->image}")){
                            Storage::disk('public')->delete("shop/{$shopProduct->shop->shop_key}/products/{$shopProductImage->image}");
                            if($shopProduct->shop->shop_url){
                                try{
                                    $client = new \GuzzleHttp\Client(['headers' =>
                                    [
                                        'shopKey' => $shopProduct->shop->shop_key,
                                        'type' => 'product'
                                    ]
                                    ]);
                                    $res = $client->post("{$shopProduct->shop->shop_url}/copy-file.php", [
                                        "form_params" => [
                                            "file"=> $shopProductImage->image,
                                            "action" => "delete"
                                        ]
                                    ]);
                                    $statusCode = $res->getStatusCode(); // 200
                                    if($statusCode == 200){
                                        $copyresponse = $res->getBody();
                                        $copyresponse = json_decode($copyresponse, true);
                                        if(isset($copyresponse["success"]) && $copyresponse["success"]){
                                            Storage::disk('public')->delete("shop/{$shopProduct->shop->shop_key}/products/{$productImg}");
                                        }
                                    }

                                }catch(Exception $e) {

                                }



                            }
                        }
                    }


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

            \App\ShopProductVariant::whereNotIn("id", $insVariantId)->where("shop_product_id",  $shopProduct->id)->delete();

            if(!\App\ShopProductVariant::where("shop_product_id",  $shopProduct->id)->where("is_primary", 1)->exists()){
                $shopProductVariant = \App\ShopProductVariant::where("shop_product_id",  $shopProduct->id)->get()->first();
                $shopProductVariant->is_primary = 1;
                $shopProductVariant->save();
            }
        }

        return response(['data' => $shopProduct, 'message' => 'Account created successfully!', 'status' => true]);
    }

    public function delete(Request $request){
        $shopKey = $request->header('shopKey');
        $shopKey = ($shopKey) ? $shopKey : $request->input("shop_key");
        $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        $shopId = ($shop) ? $shop->id : 0;

        $shpProduct =  \App\ShopProduct::where('id', $request->input("id"))
        ->where('shop_id', $shopId)->delete();
        return response(['message' => 'successfully deleted!', 'status' => true]);
    }

    public function changeStatus(Request $request){
        $shopKey = $request->header('shopKey');
        $shopKey = ($shopKey) ? $shopKey : $request->input("shop_key");
        $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        $shopId = ($shop) ? $shop->id : 0;

        $shopProduct =  \App\ShopProduct::where('id', $request->input("id"))
        ->where("shop_id", $shopId)->get()->first();
        $shopProduct->status = !$shopProduct->status;
        $shopProduct->save();
        return response(['message' => 'successfully changed status!', 'status' => true]);
     }

    public function showProductDetails(Request $request){
        $shpProduct =  \App\ShopProduct::with(["shopProductCategory", "shopProductPrimaryVariant.shopProductImage",
        "shopProductVariant.shopProductImage"])->where("status", 1)
        ->where('url', $request->input("url"))->get()->first();
        return response($shpProduct);
    }

}
