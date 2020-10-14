<p>Hello  <?php echo $user["userContact"]["fname"] ;?>,</p>
<p>Your Username: <?php echo $user["username"] ;?></p>
<p>Password: <?php echo base64_decode($user["securitykey"]) ;?></p>
