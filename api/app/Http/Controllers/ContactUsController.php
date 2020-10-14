<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class ContactUsController extends Controller
{


    public function sentContact(Request $request){
        $recaptcha = new \ReCaptcha\ReCaptcha(env("RECAPTCHA_SECRET"));
        $resp = $recaptcha->setExpectedAction("SignUp")
                        //->setExpectedHostname(env("APP_URL"))
                        ->verify($request->input('recaptcha'), $request->ip());
        if (!$resp->isSuccess()) {
           return response($resp->getErrorCodes());
        }
        $validator = Validator::make($request->all(), [
            'name' => ['required'],
            'email' => ['required', 'email'],
            'comment' => ['required'],
            'phone' => ['required']
        ]);


        if($validator->fails()){
            return response(['message' => 'Validation errors', 'errors' =>  $validator->errors(), 'status' => false], 422);
        }

        $contact = new \App\Contact;
        $contact->name = $request->input("name", '');
        $contact->email = $request->input("email", '');
        $contact->phone = $request->input("phone", '');
        $contact->comment = $request->input("comment", '');
        if(Auth::id()){
            $contact->created_by = Auth::id();
        }

        $contact->save();
        return response(['message' => sprintf("Hey %s! thank you for contacting us!", $request->input("name", "")), 'status' => true]);
    }




}
