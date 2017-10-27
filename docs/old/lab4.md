# Blockchain Lab 4 - Hyperledger Composer REST API

This lab builds on the last and shows how to deploy Composer's REST API Server to expose the contents of your Blockchain.

First, we’re going to start the REST API server, running on our local machine, and show how we can use that to access the business network model we deployed in the previous lab.

Second, we’re going to generate a simple web application, which will use Node.js and the Angular 2 framework.  This application will call the REST server we just set up to access the business network.

<img src="./images/lab3-img1.png" alt="Lab 3 & 4 architecture" style="width: 400px;"/>


> **Learning Point:** REST stands for REpresentational State Transfer and is a standard way of building an Application Programming Interface (API).  If you want to know more, see [here](http://www.restapitutorial.com/lessons/whatisrest.html).

## Installing Hyperledger Composer
Install Hyperledger Composer's Command Line Interface (CLI) and REST Server
```bash
$ npm install -g composer-cli
$ npm install -g composer-rest-server
```
> **NB:** if you're comfortable with _npm_ you'll recognise this as a global installation, and you might be tempted to run it with `sudo` - don't do that here, it will cause errors. It should install successfully with your normal user account.

## Setting up the API server
Hyperledger Composer is great for trying out business networks with models and transactions, but you need to expose your network to the outside world to make it useful.   To do that, we will start a REST API server, based on LoopBack.
> **Learning Point:** LoopBack is an open source framework for creating APIs based on an underlying data model.

First we need a connection profile to enable the REST server to connect to our Blockchain.  We previously pushed that into a container via the _docker-compose.yml_ file, but here we will be running the REST server directly on the local machine, so we need to set up the connection profile on the local machine.  Connection profiles live in a specific directory, _~/.composer-connection-profiles_. The tilde(~) is shorthand for 'home directory'.

In these commands, you need to replace `<HOME>` with your home directory
-	for Mac this is _/Users/<user-name>_, e.g. _/Users/ian_
-	for Windows this is _C:\Users\<user-name>_, e.g. _C:\Users\john_
-	for Ubuntu this is _/home/<user-name>_, e.g. _/home/fred_
```bash
$ mkdir /<HOME>/.composer-connection-profiles/hlfabric
$ atom /<HOME>/.composer-connection-profiles/hlfabric/connection.json
```

Type the following connection profile into the new file.  You need to modify the _keyValStore_ parameter with your <HOME> directory as above.

You also need to copy in the UUID of the chaincode container which was created when you deployed the business network.  You can get that from `docker ps` – it will be the container called something like _dev-vp0-xxxxxxxx_ where the _xxxxxxxx_ is 64 random hexadecimal characters.  It is those 64 characters which you need to copy and paste in here.
> **NB:** don't type in the _dev-vp0-_ part as well - this is a common mistake.

Note also that as we’re not running this in Docker, we can no longer use the container names to access the Blockchain containers (e.g. _grpc://vp0:7051_); we have to use _localhost_ here.
```json
{
    "type": "hlf",
    "keyValStore": "/<HOME>/.composer-credentials",
    "membershipServicesURL": "grpc://localhost:7054",
    "peerURL": "grpc://localhost:7051",
    "eventHubURL": "grpc://localhost:7053",
    "deployWaitTime": 300,
    "invokeWaitTime": 30,
    "networks": {
        "digitalproperty-network": "<container-name>"
    }
}
```
> **Learning Point:** Hyperledger doesn't know what you mean by _digitalproperty-network_. Composer uses the _networks_ part of the connection profile to translate between the business network name and the container UUID which is created when you deploy that business network.

Save that file, then run the REST server
```bash
$ composer-rest-server
```

Enter the responses as shown:

![alt-text](./images/lab4-img1.png "Composer REST Server")

Let the REST server start up (might take a few minutes).  You can now browse the API specification for your business model at http://localhost:3000/explorer.  

![alt-text](./images/lab4-img2.png "LoopBack Explorer")

Click on _GET /Person_ and _Try it out!_.  You should see the Person objects you created earlier.  You can also create new objects and execute transactions using the LoopBack Explorer.

## A note on credentials
Hyperledger issues a credential file to any process which logs in using an ID and password. That credential file is then stored in the _~/.composer-credentials_ directory. Subsequently, other login attempts can be made from that machine using the same ID, only if the credential file is still present.

Once a credential file has been issued, you cannot use that ID to log in from another machine. _Note that a container is considered to be a different machine from the local machine it is running on._

If you run into problems with IDs and credentials (especially if you get a ‘no rows in result set’ error), try deleting the credentials in _~/.composer-credentials_ and then running the applications again using a different ID.

## Generating a starter application
> **NB:** this section is optional, you don’t need to complete it to do the next lab.

You can use Yeoman to generate a basic application.  Yeoman is a code generator tool which can be used to ‘scaffold out’ an application for later development.  Hyperledger Composer has a generator package for Yeoman which builds a simple table-based app, based on the Angular 2 framework, using the model from the business network package.

Install Yeoman (and a few other pre-requisite packages)
```bash
$ npm install –g yo typings bower @angular/cli
```
Now install the Hyperledger Composer generator
```bash
$ npm install –g generator-hyperledger-composer
```
Run the Yeoman generator with
```bash
$ yo hyperledger-composer
```

![alt-text](./images/lab4-img3.png "Composer REST Server")

Enter the responses as shown above, a brief discussion follows:
-	we are creating an Angular 2 application.  This framework is used by many production apps, e.g. Netflix, weather.com and iStockPhoto.
-	we will connect the app to our existing business network running on Blockchain, and we need to provide the connection profile name, the business network name and our security credentials to do that.
-	The name of the app doesn’t matter (here we used the default _angular-app_), although this will be used for the directory which holds the generated files.
-	The description, author name and email are required, but the values are not important.
-	Yeoman can generate a REST server for us, but as we have one running already, we will use that – enter the address (http://localhost) and port (3000).
-	If you asked for no namespaces in your REST server, then make sure you tell Yeoman they are not used.

Yeoman will create a set of files in the _angular-app_ directory (or whatever you named the app) and will then build and install the app for you.  Once completed, switch into that directory, and run
```bash
$ npm start
```
You should be able to view your app at http://localhost:4200.

![alt-text](./images/lab4-img4.png "Composer REST Server")

Try adding an asset and prove to yourself that you can see that asset in the LoopBack Explorer, and the Hyperledger Composer.

Congratulations!  You have deployed a business network using Hyperledger Composer, built an API server to expose the network to the outside world, and generated a starter application.

## Cleaning up
You can clean up the working directory in the same way as for lab 2.  You should also remove any ‘dev’ container images from your local Docker repository.

Continue on to [lab 5](./lab5.md).
