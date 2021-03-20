<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Image;

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

        $country_id = ($request->input("country_id", null)) ? json_decode($request->input("country_id", null), true) : '' ;
        $state_id = ($request->input("state_id", null)) ? json_decode($request->input("state_id", null), true) : '' ;
        $city_id = ($request->input("city_id", null)) ? json_decode($request->input("city_id", null), true) : '' ;

        $input["shop_category_id"] = $request->input("shop_category_id.id", 0);
        $input["country_id"] = $country_id["id"] ?? null;
        $input["state_id"] = $state_id["id"] ?? null;
        $input["city_id"] = $city_id["id"] ?? null;
        $input["shop_url"] = $request->input("shop_url", '');
        $input["shop_url"] = ($input["shop_url"]) ? trim($input["shop_url"]) : '';
        $input["shop_url"] = ($input["shop_url"]) ? rtrim($input["shop_url"], "/") : '';



        unset($input["logo"]);
        unset($input["favicon"]);


        if($request->input("id", 0)){
            $shop = \App\Shop::where('id', $request->input("id", 0))->update($input);
            $shop =  \App\Shop::find( $request->input("id", 0));
        }else{
            $input["shop_key"] = sha1(time());
            $shop = \App\Shop::create($input);
        }

        if ($request->hasFile('favicon')) {
            $destinationPath = "assets/shop/{$shop->shop_key}/general";
            $request->file('favicon')->move($destinationPath, "favicon.ico");
            $shop->favicon = 'favicon.ico';
            $shop->save();
        }

        if ($request->hasFile('logo')) {
            $logoName = sprintf("%s.%s",time(), $request->file('logo')->extension());
            $destinationPath = "assets/shop/{$shop->shop_key}/general";
            $request->file('logo')->move($destinationPath, $logoName);

            $png = Image::make($destinationPath.'/'.$logoName)->encode('png');
            $png->save($destinationPath.'/logo.png');


            $png = Image::make($destinationPath.'/logo.png')->resize(72, 72);
            $png->save($destinationPath.'/icon-72x72.png');

            $png = Image::make($destinationPath.'/logo.png')->resize(96, 96);
            $png->save($destinationPath.'/icon-96x96.png');

            $png = Image::make($destinationPath.'/logo.png')->resize(128, 128);
            $png->save($destinationPath.'/icon-128x128.png');

            $png = Image::make($destinationPath.'/logo.png')->resize(144, 144);
            $png->save($destinationPath.'/icon-144x144.png');

            $png = Image::make($destinationPath.'/logo.png')->resize(152, 152);
            $png->save($destinationPath.'/icon-152x152.png');

            $png = Image::make($destinationPath.'/logo.png')->resize(192, 192);
            $png->save($destinationPath.'/icon-192x192.png');

            $png = Image::make($destinationPath.'/logo.png')->resize(384, 384);
            $png->save($destinationPath.'/icon-384x384.png');

            $png = Image::make($destinationPath.'/logo.png')->resize(512, 512);
            $png->save($destinationPath.'/icon-512x512.png');


            Storage::disk('public')->delete(str_replace("assets/", "", $destinationPath).'/'.$logoName);
            $shop->logo = 'logo.png';
            $shop->save();
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

    public function generateSite(Request $request){
        $files = Storage::allFiles("shopSite");
        $shopKey = $request->input("shop_key", '3d9f5a8eec71764c7c2df5a56496c8a1320dd921');
        $shop =  \App\Shop::where("shop_key", $shopKey)->get()->first();

        $toBasePath = 'shop/'.$shopKey.'/www';

        $replacer["shopSite/index.html"] = [
            "CART_SITE_PATH" => $shop->base_path ??  '/',
            "CART_FAVICON_ICO" => $shop->favicon ?? 'favicon.ico',
            "CART_THEME_COLOR" => $shop->theme_color ?? '#1976d2',
            "CART_SHOP_KEY" => $shopKey,
            "CART_SHOP_NAME" => $shop->name,
        ];

        $replacer["shopSite/manifest.webmanifest"] = [
            "CART_BACKGROUND_COLOR" => $shop->bg_color ?? '#fafafa',
            "CART_SHOP_NAME" =>  $shop->name,
            "CART_SHOP_SHORT_NAME" =>  $shop->short_name ?? $shop->name,
            "CART_THEME_COLOR" => $shop->name ?? '#1976d2'
        ];
        $replacer["shopSite/ngsw.json"] = [
            "CART_SITE_PATH" => $shop->base_path ??  '/',
        ];

        $customFiles = [
            "favicon.ico"=>"favicon",
            "logo.png"=>"logo",
            "icon-72x72.png"=>"icons",
            "icon-96x96.png"=>"icons",
            "icon-128x128.png"=>"icons",
            "icon-144x144.png"=>"icons",
            "icon-152x152.png"=>"icons",
            "icon-192x192.png"=>"icons",
            "icon-384x384.png"=>"icons",
            "icon-512x512.png"=>"icons",
        ];
        foreach($files as $file){
            $toFile = str_replace("shopSite/", "", $file);


            Storage::disk('public')->delete("{$toBasePath}/{$toFile}");
            if(isset($replacer[$file])){
                $html =  Storage::get($file);
                foreach($replacer[$file] as $key => $val){
                    $html = str_replace($key, $val, $html);
                }
                Storage::disk('public')->put("{$toBasePath}/{$toFile}", $html);
            }else{
                Storage::disk('public')->writeStream("{$toBasePath}/{$toFile}", Storage::readStream($file));
            }
         }

         foreach($customFiles as $key => $file){
            if(($shop->{$file})){
                $filePath = "shop/{$shopKey}/general/{$key}";
                if(Storage::disk('public')->exists($filePath)){
                    if(Storage::disk('public')->exists("{$toBasePath}/{$key}")){
                        Storage::disk('public')->delete("{$toBasePath}/{$key}");
                    }
                    Storage::disk('public')->writeStream("{$toBasePath}/{$key}", Storage::disk('public')->readStream($filePath));
                }
            }else{
                $filePath = "shop/{$shopKey}/general/{$key}";
                if(Storage::disk('public')->exists($filePath)){
                    if(Storage::disk('public')->exists("{$toBasePath}/assets/icons/{$key}")){
                        Storage::disk('public')->delete("{$toBasePath}/assets/icons/{$key}");
                    }
                    Storage::disk('public')->writeStream("{$toBasePath}/assets/icons/{$key}", Storage::disk('public')->readStream($filePath));
                }
            }
         }
         return response(['message' => 'successfully generated',  'status' => true]);
    }

    public function downloadSite(Request $request){
        $toBasePath = 'assets/shop/'.$request->input("shop_key", '3d9f5a8eec71764c7c2df5a56496c8a1320dd921').'/www';

        $zip_file = 'assets/shop/'.$request->input("shop_key", '3d9f5a8eec71764c7c2df5a56496c8a1320dd921').'www.zip';
        $zip = new \ZipArchive();
        $zip->open($zip_file, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        $path = public_path($toBasePath);
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));
        foreach ($files as $name => $file)
        {
            // We're skipping all subfolders
            if (!$file->isDir()) {
                $filePath     = $file->getRealPath();

                // extracting filename with substr/strlen
                $relativePath = substr($filePath, strlen($path) + 1);

                $zip->addFile($filePath, $relativePath);
            }
        }
        $zip->close();
        return response()->download($zip_file)->deleteFileAfterSend(true);
    }
}
