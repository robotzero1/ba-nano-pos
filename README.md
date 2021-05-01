Ba-Nano-Pos is a point of sale concept for processing Banano cryptocurrency payments on a handheld device. It uses a two step payment process - first looking for a pending transaction on the blockchain which is then confirmed after a visual account check.

Each time a button is pressed a QRcode is created containing the payment address and total price.

![image](https://user-images.githubusercontent.com/60509953/116793542-a6e26200-aac7-11eb-9f64-83c48133876d.png)

The customer scans the QRCode using their mobile phone and confirms with a PIN.

While this is happening the code on the retailers device is checking the network for payments that have been made for this amount to the retailers account. It makes 3 attempts with a 15 second gap.

If it finds a payment with a matching amount it shows the monkey associated with that payment at the bottom of the screen.

![image](https://user-images.githubusercontent.com/60509953/116793567-c6798a80-aac7-11eb-9661-ca3fbe26657f.png)

The retailer presses the monkey matching the monkey shown in tthe customer's wallet.

![image](https://user-images.githubusercontent.com/60509953/116793642-30922f80-aac8-11eb-87b2-117593529d55.png)

This is then shown larger on the screen for a final visual check.

![image](https://user-images.githubusercontent.com/60509953/116793582-d72a0080-aac7-11eb-8ed5-f3ccaf9b2921.png)

Pressing this monkey confirms the transaction.

![image](https://user-images.githubusercontent.com/60509953/116793607-f163de80-aac7-11eb-8127-49510a300b48.png)


\
SERVER

I used a Node.JS installation to process the payments. I did this because I didn't want the seed to be stored on the local device. It could be stored locally with the user entering a password to decrypt it each time.

To keep things simple I used a cPanel install on a shared server following these instructions
https://www.a2hosting.com/kb/cpanel/cpanel-software/create-application-with-nodejs-selector

Also, these instructions might be useful especially the part about using environmental variables to avoid storing the seed in the code.
https://blog.cpanel.com/how-to-host-a-node-js-application-with-cpanel/

Add https://www.npmjs.com/package/@bananocoin/bananojs to the server install

\
CREDITS

Client and server use https://github.com/BananoCoin/bananojs library  
Banano website https://banano.cc/  
Monkey generation https://monkey.banano.cc/  
Sweet icons designed by Freepik from Flaticon https://www.flaticon.com/packs/desserts-and-candies-19  

\
VIDEO DEMONSTRATION

https://streamable.com/gxnxtg  
