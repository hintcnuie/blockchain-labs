# Blockchain Lab 7 - Deploy Hyperledger on Bluemix

This lab and [lab 8](./lab8.md) will show you how to take your application and deploy it to IBM’s Bluemix cloud platform.  Once there, you can investigate other ways to interact with your Blockchain business network, including OpenWhisk and Node-RED.

The architecture of your application will include:
-	creating an instance of the Blockchain service on Bluemix and deploying your business network to it
-	deploying your Composer REST Server container to the IBM Container Service on Bluemix
-	deploying your Node.js/Express application to Cloud Foundry on Bluemix

<img src="./images/lab7-img1.png" alt="Lab 7 & 8 architecture" style="width: 400px;"/>

## Create a Blockchain service on Bluemix
Log in to your Bluemix account.  You might want to set up a separate ‘space’ in the Bluemix account for this tutorial.

Navigate to the Catalog and go to the Application Services section.  Click on the Blockchain service.  Note that (at the time of writing) there are three available Blockchain services on Bluemix:
-	a free Starter Plan (beta), based on Hyperledger Fabric v0.6 (we will use this one)
-	a free _vNext_ Plan (limited beta), based on Hyperledger Fabric v1.0
-	a chargeable High Security Plan, based on Hyperledger Fabric v0.6 – note that this actually runs on a Linux One mainframe.

![alt-text](./images/lab7-img2.png "Blockchain on Bluemix")

Select the Starter Plan (beta) and click _Create_.  Note that for IBM trial accounts you can only have one copy of this service running, so if you have already played with Blockchain on Bluemix, you may have to delete that instance first.

Open the newly-created service.  You will see on the left that you can access the Service Credentials.  We will need those in a moment.  First click the button to launch the dashboard.

![alt-text](./images/lab7-img3.png "Blockchain on Bluemix")

The dashboard gives you access to the operational properties of the dashboard.  In previous labs we have used `curl localhost:7050/chain` to do this; on Bluemix we have a visual environment.

The Network tab shows the URLs of the peers, and their current state.  It also shows the UUID of any deployed chaincode.

![alt-text](./images/lab7-img4.png "Blockchain on Bluemix")

The Blockchain tab shows the number of blocks, and allows you to view the contents of each.

![alt-text](./images/lab7-img5.png "Blockchain on Bluemix")

Now go back to the Service Credentials page (it will be on a separate browser tab).  Click on _View Credentials_ to see the URLs in more detail.  In here you will also find the user IDs and passwords for accessing the Blockchain.

![alt-text](./images/lab7-img6.png "Blockchain on Bluemix")

## Deploy the business network to your Blockchain on Bluemix
Previously we've used a local Hyperledger, with a local connection profile.  To connect to your new Blockchain instance you will need to supply a _Bluemix_ connection profile.  There is a sample _connection.json_ file in the _profiles/bluemix_ directory - edit it as follows:
-	the _membershipServicesURL_ variable should be the URL and port of the _ca_ object from your Bluemix service credentials.
-	the _peerURL_ variable should be the discovery host and port of one of the _peer_ objects (doesn’t matter which, but be consistent).
-	the _eventURL_ variable should be the event host and port of the same _peer_ object.
-	the _certificate_ should be a valid Bluemix certificate – the one provided should work fine, but if new ones are issued, they will be at [https://blockchain-certs.mybluemix.net/us.blockchain.ibm.com.cert].
-	the _keyValStore_ variable should match your `<HOME>` directory.

Copy that file to your connections profile location.  Don’t forget to also clean up any existing credential files.  From the _lab5_ directory:
```bash
$ mkdir /<HOME>/.composer-connection-profiles/bluemix
$ cp profiles/bluemix/connection.json /<HOME>/.composer-connection-profiles/bluemix
$ rm –rf /<HOME>/.composer-credentials/*
```

Navigate to the _business-network_ directory and use the Composer command line instructions to deploy the network.  We assume that the business network file (_*.bna_) was already built in the previous lab, if not, see there for the command to build it.  The enrollment ID and password are from the Bluemix service credentials, you will need to check there for the correct password for your Blockchain instance.
```bash
$ composer network deploy -a digital-property.bna -p bluemix -i admin -s a6dd02366e
```

The business network is deployed to your Blockchain instance on Bluemix (it may take a few minutes).  You can check that from the Blockchain dashboard – you will see 2 blocks – a ‘genesis’ block and the chaincode deployment block.

To test the business network, run the Composer REST Server.  Remember that you will have to provide the new _Bluemix_ connection profile, and the ID and password from the Bluemix service credentials.
```bash
$ composer-rest-server -n digital-property -p bluemix -i admin -s a6dd02366e -N never
```

When the REST server has started you can browse to http://localhost:3000/explorer and try out your business network on Bluemix.

Now proceed to [lab8](./lab8.md), where we will show you how to deploy the REST server and your application on Bluemix also.
