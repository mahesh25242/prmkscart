<?php
namespace App\Mail;
use Illuminate\Mail\Mailable;
use App\User;
class RetrievePassword extends Mailable
{
    /**
     * Build the message.
     *
     * @return $this
     */
    public $user;
    public function __construct(User $user)
    {
        $this->user = $user;
    }



    public function build()
    {
       $user =  (array) $this->user;
        return $this->view('email/retrievePassword', $user);
    }
}
