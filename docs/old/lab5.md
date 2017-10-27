# Blockchain Lab 5 - Set up a Hyperledger prototype environment

The previous lab showed how to create a business network (a model and its associated transactions) using Composer Playground, and then how to expose that using a REST API.

We’re now going to look at how to build a real-world prototype.  In this lab we will use Hyperledger Composer’s command line interface to speed development.

This lab will show you how to deploy the application on your local machine; the next lab will show you how to customise it.  Lab 7 will show you how to package the app and deploy it, along with your Blockchain and API server, to Bluemix.

Deploying locally is similar to the previous lab.  We provide an example application which is written in JavaScript using the Node.js and Express frameworks.

<img src="./images/lab5-img1.png" alt="Lab 5 architecture" style="width: 400px;"/>

## Download the application directory
If you haven’t already done so, fetch the example business network and application from GitHub as described in [lab 1](./lab1.md) – you’ll find them in the _lab5_ directory.

Open your editor and examine the contents.
```bash
$ cd ../lab5
$ atom .
```

There are a number of directories in this development folder:
-	_business-network_: the Hyperledger Composer business network files (model, transactions, permissions)
-	_rest-server_: the docker-compose file to deploy the Composer REST server as a container
-	_local-hyperledger_: the docker-compose file to deploy Hyperledger locally
-	_profiles_: Composer connection profiles to attach to Hyperledger fabrics running locally, and on Bluemix
-	_express-app_: a Node.js application which offers a web front-end to the business model
-	_admin_: PHP scripts to load sample data into Hyperledger

## Deploy Hyperledger locally
Edit the _connection.json_ file in the _profiles/local_ directory and adjust the _keyValStore_ variable to match your `<HOME>` directory.  Copy that file to your connections profile location.  From the _hyperledger-app_ directory:
```bash
$ mkdir /<HOME>/.composer-connection-profiles/local
$ cp profiles/local/connection.json /<HOME>/.composer-connection-profiles/local
```

Also, if not done previously, clean up any credential files
```bash
$ rm /<HOME>/.composer-credentials/*
```

Navigate to the _local-hyperledger_ directory and start the Hyperledger containers
```bash
$ docker-compose up -d
```

You've already done this in labs 1 and 3, should you should be an expert by now!

## Deploy the business network
Navigate to the _business-network_ directory and use the Composer command line instructions to build and deploy the network.

First, build the network file.  This instruction creates the _digital-property.bna_ file from the model, transaction and permission files in the local directory.
```bash
$ composer archive create --archiveFile digital-property.bna --sourceType dir --sourceName .
```
> **NB:** note the dot at the end of that last command - it means _current directory_.

Next, deploy that network file to the local Blockchain.  
```bash
$ composer network deploy --archiveFile digital-property.bna --connectionProfileName local --enrollId WebAppAdmin --enrollSecret DJY27pEnl16d
```
> **NB:** the enrollment ID and password are the defaults for the Hyperledger Docker container.

Note that under the covers, this deployment creates a chaincode container.  The _connection.json_ file you placed in the _composer-connections-profile/local_ directory has been updated to include the UUID of that container (check it with Atom to verify that), and you can see it with `docker ps`.

The deployment may take a few minutes.  You can verify that it has completed with
```bash
$ composer network list --businessNetworkName digital-property --connectionProfileName local --enrollId WebAppAdmin --enrollSecret DJY27pEnl16d
```

These Hyperledger Composer command line instructions do essentially the same thing as Hyperledger Composer Playground which we looked at in lab 3.  Having them as commands makes it easier to set up an automated and repeatable DevOps process.

## Start the REST server
This is the same as lab 4, so we’ll just use the command line option rather than typing in all the responses.  Open a new Terminal, as this is a long-running process.
```bash
$ composer-rest-server -p local -n digital-property -i WebAppAdmin -s DJY27pEnl16d -N never
```

## Load the sample data
You can pre-populate your Blockchain with some sample data.  In keeping with ’12-Factor’ guidelines (_XII: Run admin/management tasks as one-off processes_), we have set up a simple Python script to do that.

Navigate to the _admin_ directory and run it
```bash
$ python ./data-setup.py
```

## Start the application
Open a new Terminal and navigate to the _express-app_ directory.  Start the application with
```bash
$ npm install
$ npm start
```

You can browse to the application at http://localhost:8000.  Try adding new users and properties.

## Browse the application files
The example application is written in Node.js and uses the Express web application framework and the Twitter Bootstrap ‘look-and-feel’.  Open the _express-app_ directory in an editor and examine the different files.

- _app.js_ – this is where the application is set up.  Line 17 defines where the application should look for the REST server (remember we have it running locally at the moment).  At line 29 we define the high level routing – for example, if we browse to http://localhost:8000/people , that request will be sent to the _/routes/people_ module.

- _routes_ directory – the modules in here handle the logic behind the user interface.  Each module function generally handles one URL route.  This usually involved getting some data by calling a _model_ function, and then creating the HTML for the resulting page with the _res.render()_ function.

- _models_ directory – the modules in here handle the data, calling the APIs on the REST server.  There is often some enrichment of data, for example in the _propertyModel_ module, the owner name is added based on the owner ID.

- _views_ folder – the web pages are stored as templates using the Jade templating system.  These templates are called by the _res.render()_ functions in the _routes_ modules, and are converted in to HTML before being sent back to the web browser.

Continue to [lab 6](./lab6.md) to see how to customise this application for your own business model needs.
