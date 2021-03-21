<?php
$apiUrl = 'https://agoranature.com/api/public';
$headers = apache_request_headers( ) ;
$shopKey = isset($headers["shopKey"]) ? $headers["shopKey"]  : '';

if($shopKey){

  $type = isset($headers["type"]) ? $headers["type"]  : '';
  $file = isset($_POST["file"]) ? $_POST["file"] : '';
  $action = isset($_POST["action"]) ? $_POST["action"] : '';
  if($file){
    switch($type){
      case 'product':
        $rFile = "{$apiUrl}/assets/shop/$shopKey/products/{$file}";
        $file_headers = @get_headers($rFile);
        if($file_headers && $file_headers[0] != 'HTTP/1.1 404 Not Found') {
          $newfile = "{$shopKey}";
          $created = false;
          if (!file_exists("{$newfile}/")) {
            $created = mkdir("{$newfile}", 0755);
          }else{
            $created = true;
          }

          if($created){
            $created = false;
            $newfile .= "/products";
            if (!file_exists("{$newfile}/")) {
              $created = mkdir("{$newfile}", 0755);
            }else{
              $created = true;
            }
            if($created){
              $newfile .= "/{$file}";
                if ($action == "delete" && file_exists("$newfile")) {
                  if(unlink($newfile)){
                    echo json_encode(array("success" => 1));
                  }
                }
              //if (!file_exists("$newfile")) {
                if ($action == "copy" && copy($rFile, $newfile) ) {
                  echo json_encode(array("success" => 1));
                }
              //}

            }

          }


        }
      break;
      case 'category':
        $rFile = "{$apiUrl}/assets/shop/$shopKey/category/{$file}";
        $file_headers = @get_headers($rFile);
        if($file_headers && $file_headers[0] != 'HTTP/1.1 404 Not Found') {
          $newfile = "/$shopKey";
          $created = false;
          if (!file_exists("{$newfile}/")) {
            $created = mkdir("{$newfile}", 0755);
          }
          if($created){
            $created = false;
            $newfile .= "/category";
            if (!file_exists("{$newfile}/")) {
              $created = mkdir("{$newfile}", 0755);
            }
            if($created){
              $newfile .= "/{$file}";
              if ($action == "delete" && file_exists("$newfile")) {
                if(unlink($newfile)){
                  echo json_encode(array("success" => 1));
                }
              }

              //if (!file_exists("$newfile")) {
                if ($action == "copy" &&  copy($rFile, $newfile) ) {
                  echo json_encode(array("success" => 1));
                }
              //}
            }

          }


        }
      break;
    }
  }
}


?>
