<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Image;
use Illuminate\Support\Facades\Storage;

class ShopProductCategoryController extends Controller
{
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

        $categories = \App\ShopProductCategory::where("shop_id", $shopId);
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
        }


        return response(['data' => $shopProductCategory, 'message' => 'Account created successfully!', 'status' => true]);
    }

    public function delete(Request $request){
       $shopCategory =  \App\ShopProductCategory::where('id', $request->input("id"))->delete();
       return response(['message' => 'successfully deleted!', 'status' => true]);
    }

}
