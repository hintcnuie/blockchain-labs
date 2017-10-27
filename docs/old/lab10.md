# Blockchain Lab 10 - Responding to events with Node-RED

You can easily interact with your business model from Node-RED by using the HTTP nodes and making GET and POST calls.

However you can also use Node-RED to respond to events in your business model.  In this lab we will send an SMS message every time a property is marked as 'for sale'. We will use the Twilio service to do that.

## Install Node-RED and the additional nodes
If you haven't already, install Node-RED on your local machine. Then install the Hyperledger Composer and Twilio nodes.
```bash
$ sudo npm install -g --unsafe-perm node-red
$ sudo npm install -g node-red-contrib-hyperledger-composer
$ sudo npm install -g node-red-node-twilio
```
> **Learning Point:** using `sudo` allows us to install the Node-RED files globally, so they will be available to all of our projects.  You may have to enter your system password.

## Create an event in the business model
Assuming you're using the _digital-property_ model we created back in lab 5, you can update this to create an event.  Switch to the _business-network/models_ directory and update the _*.cto_ file to include the definition of our event at the bottom of the file:
```
event PropertyRegisteredForSale {
  o String data
}
```
> **NB:** if you're using Composer v0.8 or earlier, you'll need this format:
```
event PropertyRegisteredForSale identified by eventId {
  o String eventId
  o String data
}
```

Next, in the _business-network/lib_ directory, edit the _*.js_ file and update the _onRegisterPropertyForSale_ function to look like this:
```javascript
function onRegisterPropertyForSale(propertyForSale) {
    console.log('### onRegisterPropertyForSale ' + propertyForSale.toString());
    propertyForSale.title.forSale = true;
    propertyForSale.title.information += " - NOW FOR SALE!!";

    // create a new event
    var factory = getFactory();
    var event = factory.newEvent('net.biz.digitalPropertyNetwork', 'PropertyRegisteredForSale');

    // populate the event
    event.data = propertyForSale.title.information + ' is now for sale';

    // emit the event
    emit(event);

    return getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle').then(function(result) {
        return result.update(propertyForSale.title);
    }
    );
}
```

Now every time this transaction is executed, an event will be created with an explanatory message in _event.data_.

You will need to recreate the business network archive (_*.bna_) file and redeploy it to your Blockchain.  Remember to use the correct ID and password.
```bash
$ composer archive create -a digital-property.bna -t dir -n .
$ composer network update -a digital-property.bna -p bluemix -i admin -s a6dd02366e
```

You will also need to restart the Composer REST Server - either locally, or by restarting the container on Bluemix.

## Start Node-RED and set up the flow
Start Node-RED from any Terminal window
```bash
$ node-red
```
Then browse to http://localhost:1880. You should see the Hyperledger Composer nodes towards the bottom of the left hand panel.

Drag a _hyperledger-composer-in_ node on to the canvas. Double-click to configure it, fill in the details (the ones you used to access your Blockchain locally) and click _Done_.

![alt-text](./images/lab10-img1.png "Hyperledger Composer connection settings")

Click _Deploy_ to test the connection; after a few seconds the green _connected_ dot should appear.

Drag a _debug_ node on to the canvas, and configure it to show _msg.data_. Wire the two nodes together and deploy.

You can test it by executing a transaction in LoopBack explorer, or from your application by marking a property for sale. The message we created in the business network model will appear in the debug panel on the right.

![alt-text](./images/lab10-img2.png "Node-RED")

## Send an SMS in response to the events
To do this you will need to set up an account at https://www.twilio.com.  Trial accounts get one phone number free, and you will need to make a note of your _Account SID_ and _Authorisation Token_.

In Node-RED, drag a _Twilio_ node on to the canvas.  Configure it with _local credentials_ and enter the details from your Twilio account, plus your own mobile phone number to receive the SMS.

You will also need a _function_ node - the Twilio node expects the message to be in `msg.payload`, whereas the Hyperledger event has it in `msg.data`. The function node should do the mapping (`msg.payload = msg.data`).

![alt-text](./images/lab10-img3.png "Node-RED")

Wire the nodes together as shown, deploy, and execute another transaction.  If everything is working, you should get an SMS in a few seconds.

<img src="./images/lab10-img4.png" alt="SMS message" style="max-width: 30%;"/>

You've now learned how to detect and respond to events coming from your business network.  You can use Node-RED to trigger many different actions in response - send a tweet, start a business process, execute a transaction on another Blockchain, etc.
