<?php

namespace App\Listeners;

use App\Events\OrderChangedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use LaravelFCM\Message\OptionsBuilder;
use LaravelFCM\Message\PayloadDataBuilder;
use LaravelFCM\Message\PayloadNotificationBuilder;
use FCM;


class OrderChangedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\ExampleEvent  $event
     * @return void
     */
    public function handle(OrderChangedEvent $event)
    {

        if($event->order && $event->order->web_push_token){

            $optionBuilder = new OptionsBuilder();
            $optionBuilder->setTimeToLive(60*20);

            $notificationBuilder = new PayloadNotificationBuilder("Hi {$event->order->shopCustomer->name}");

            if(!$event->order->sec_key){
                $event->order->sec_key =  sha1(time().'-'.$event->order->id);
                $event->order->save();
            }


            $notificationBuilder->setClickAction("shop/order/{$event->order->sec_key}");
            $notificationBuilder->setSound("default");
            $notificationBuilder->setBody("Your order #{$event->order->id} set as {$event->order->status_text}")
                                ->setBadge('1');

            $dataBuilder = new PayloadDataBuilder();
            $dataBuilder->addData(['a_data' => 'notofication']);

            $option = $optionBuilder->build();
            $notification = $notificationBuilder->build();
            $data = $dataBuilder->build();

            $token = $event->order->web_push_token;

            $downstreamResponse = FCM::sendTo($token, $option, $notification, $data);

            $downstreamResponse->numberSuccess();
            $downstreamResponse->numberFailure();
            $downstreamResponse->numberModification();


            // return Array - you must remove all this tokens in your database
            $delTokens = $downstreamResponse->tokensToDelete();
            if($delTokens && !empty($delTokens)){
                foreach($delTokens as $token){
                    if($token){
                        $orders= \App\ShopOrder::where("web_push_token", $token)->get();
                        if($orders){
                            foreach($orders as $order){
                                $orders->shopCustomer->web_push_token = '';
                                $order->web_push_token = '';
                                $order->save();
                            }
                        }
                    }
                }
            }

            // return Array (key : oldToken, value : new token - you must change the token in your database)
            $updateTokens = $downstreamResponse->tokensToModify();
            if($updateTokens && !empty($updateTokens)){
                foreach($updateTokens as $oldToken=>$token){
                    if($token){
                        $orders= \App\ShopOrder::where("web_push_token", $oldToken)->get();
                        if($orders){
                            foreach($orders as $order){
                                $orders->shopCustomer->web_push_token = $token;
                                $order->web_push_token = $token;
                                $order->save();
                            }
                        }
                    }
                }
            }
            // return Array - you should try to resend the message to the tokens in the array
            //$downstreamResponse->tokensToRetry();

            // return Array (key:token, value:error) - in production you should remove from your database the tokens
            //$downstreamResponse->tokensWithError();
        }
    }
}
