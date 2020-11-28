<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Image;
use Illuminate\Support\Facades\Storage;

class ShopProductCategoryController extends Controller
{
    public function showCategories(Request $request){
        //event(new \App\Events\OrderChangedEvent(\App\ShopOrder::find(48)));
        $request->request->add(['status' => 1]);
        return $this->categories($request);
    }

    public function categories(Request $request){
        $shopKey = $request->header('shopKey');
        if($shopKey){
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
            $shopId = ($shop) ? $shop->id : 0;
        }else{
            $shopKey = $request->input("shop_key", '');
            $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
            $shopId = ($shop) ? $shop->id : 0;
        }

        $categories = \App\ShopProductCategory::withCount(["shopProduct"])->where("shop_id", $shopId);
        if($request->input("status", 0)){
            $categories->where("status", $request->input("status", 0));
        }
        return response($categories->get());
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

        $input["description"] = $request->input("description", '');
        $input["name"] = $request->input("name", '');
        $input["sortorder"] = $request->input("sortorder", '');
        $input["status"] = $request->input("status", '');
        $input["is_maticon"] = $request->input("is_maticon", 0);
        $input["is_maticon"] = ($input["is_maticon"]) ? $input["is_maticon"] : 0;
        if($input["is_maticon"] && $request->input("icon", null)){
            $input["icon"] =  $request->input("icon", null);
        }

        $input["url"] = \Illuminate\Support\Str::slug($input["name"], '-');


        $shopKey = $request->header('shopKey');


        if($request->input("id", 0)){
            $shopProductCategory = \App\ShopProductCategory::where('id', $request->input("id", 0))->update($input);
            $shopProductCategory =  \App\ShopProductCategory::find($request->input("id", 0));
        }else{
            if($shopKey){
                $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
                $input["shop_id"] = ($shop) ? $shop->id : 0;
            }else{
                $shopKey = $request->input("shop_key", 0);
                $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
                $input["shop_id"] = ($shop) ? $shop->id : 0;
            }
            $shopProductCategory = \App\ShopProductCategory::create($input);
        }

        $iconImage =  '';
        if ($request->hasFile('icon')) {
            $iconImage = sprintf("%s.%s",time(), $request->file('icon')->extension());
            $destinationPath = "assets/shop/".$shopProductCategory->shop->shop_key."/category";
            $request->file('icon')->move($destinationPath, $iconImage);


            if(!Storage::disk('public')->exists("shop/{$shopProductCategory->shop->shop_key}/category/index.html")){
                Storage::disk('public')->put("shop/{$shopProductCategory->shop->shop_key}/category/index.html", 'unauthorised access');
            }

            if(Storage::disk('public')->exists("shop/{$shopProductCategory->shop->shop_key}/category/{$shopProductCategory->icon}")){
                Storage::disk('public')->delete("shop/{$shopProductCategory->shop->shop_key}/category/{$shopProductCategory->icon}");
            }


            $img = Image::make($destinationPath.'/'.$iconImage)->resize(40, null, function ($constraint) {
                $constraint->aspectRatio();
            });
            $img->save($destinationPath.'/'.$iconImage, 60);

            $shopProductCategory->icon = $iconImage;

            $shopProductCategory->save();

            if($shopProductCategory->shop->shop_url){
                try{
                    $client = new \GuzzleHttp\Client(['headers' =>
                    [
                        'shopKey' => $shopProductCategory->shop->shop_key,
                        'type' => 'category'
                    ]
                    ]);
                    $res = $client->post("{$shopProductCategory->shop->shop_url}/copy-file.php", [
                        "form_params" => [
                            "file" => $iconImage,
                            "action" => "copy"
                        ]
                    ]);
                    $statusCode = $res->getStatusCode(); // 200
                    if($statusCode == 200){

                    }
                }catch(Exception $e) {

                }
            }

        }


        return response(['data' => $shopProductCategory, 'message' => 'Account created successfully!', 'status' => true]);
    }

    public function delete(Request $request){
       $shopKey = $request->header('shopKey');
       $shopKey = ($shopKey) ? $shopKey : $request->input("shop_key");
       $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
       $shopId = ($shop) ? $shop->id : 0;

       $shopCategory =  \App\ShopProductCategory::where('id', $request->input("id"))
       ->where("shop_id", $shopId)->delete();
       return response(['message' => 'successfully deleted!', 'status' => true]);
    }

    public function changeStatus(Request $request){
        $shopKey = $request->header('shopKey');
        $shopKey = ($shopKey) ? $shopKey : $request->input("shop_key");
        $shop = \App\Shop::where("shop_key", $shopKey)->get()->first();
        $shopId = ($shop) ? $shop->id : 0;

        $shopCategory =  \App\ShopProductCategory::where('id', $request->input("id"))
        ->where("shop_id", $shopId)->get()->first();
        $shopCategory->status = !$shopCategory->status;
        $shopCategory->save();
        return response(['message' => 'successfully changed status!', 'status' => true]);
     }

}
