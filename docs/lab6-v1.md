# Blockchain Lab 6 - Prototype your own Hyperledger solution

At this stage you have all the information you need to build your own business network and create an application to work with it.

Feel free to use the example application provided and edit the files in the _business-network_, _express-app_ and _admin_ directories.  If you have experience with the Angular2 framework, you could use the Yeoman generator we discussed in lab 4 instead.

The best way to start is to 'fork' the project in GitHub, then 'clone' that copy to your local machine, as shown at the start of [lab 1](./lab1-v1.md).  Then modify the contents of the _lab5_ directory.

## Create your own business network
Edit the files in the _business-network_ directory to match your own business model.  Use the existing files as a template.

> **Learning Point:** to find out more about the modelling language used by Hyperledger Composer, click [here](https://hyperledger.github.io/composer/reference/cto_language.html).

The following table gives more details on which files to edit.

| File	| Changes required
| --- | ---
| business-network/models/ net.biz.digitalPropertyNetwork.cto | This is where you define your business model, the assets and their attributes. You can change the file and namespace names, but you need to be consistent.
| business-network/ lib/DigitalLandTitle.js	| This is the Javascript which defines the transactional behaviour of your business network, i.e. the ‘smart contract’. Any transaction functions must reflect the assets and attributes defined in the model.
| business-network/ package.json	| If you change the name of your business network you must reflect that here.
| business-network/ permissions.acl	| You can change these permissions to restrict what individual users can do, but for this exercise it’s probably best to leave them as is.  Again, you need to reflect any naming changes here.
| business-network/ queries.qry	| This is where you define any complex queries, as discussed in lab 4.

> **NB:** the _@param_ and _@return_ values in the _DigitalLandTitle.js_ file (lines 22 & 23) are not comments, even though they might look like they are - they are decorators, and are an important part of the modeling language spec. You need to update them in line with the code.

When you're happy with your business network model, bundle it into an archive file (_*.bna_) and deploy to your Blockchain:
```bash
composer archive create -a <network-name>.bna -t dir -n .
composer network deploy -a <network-name>.bna -p hlfv1 -i PeerAdmin -s anything
```

If you want to subsequently modify your model and redeploy, use this command:
```bash
composer network update -a <network-name>.bna -p hlfv1 -i PeerAdmin -s anything
```

Once your network is successfully deployed, start the REST server:
```bash
composer-rest-server -n <network-name> -p hlfv1 -i PeerAdmin -s anything -N never
```

You're now ready to modify and deploy your application.

## Create your own application
When you're prototyping an application, you're not restricted to the technologies used here.  Now that you have a REST API server, you can use any technology you're comfortable with, for example:
- Javascript and Node.js
- Node-RED
- Cloud Functions
- mobile apps
- other languages, such as Ruby, PHP or Python
- IBM middleware such as IBM Integration Bus, or [IBM Business Process Manager](https://www.ibm.com/developerworks/library/mw-1705-auberger-bluemix/1705-auberger.htmlIBM )

In this tutorial we will be modifying an existing Node.js application, using the Express framework. We created this application using the Express code generator we covered in the previous lab, then added some modifications as outlined [here](https://github.com/idpattison/generator-idp-composer-express).

You can either modify the sample application, or you can use the generator to build an application specific to your own business network model.

The following table gives more details on which files to edit in order to get the application working with your model. If you choose to use the generator, most of this setup is done for you.

| File	| Changes required
| --- | ---
| express-app/ models/*	| The functions in here handle API calls to the Composer REST server.  Using the examples, create model files which reflect your own business network model.
| express-app/public/ stylesheets/style.css	| The sample app uses Twitter’s Bootstrap for look-and-feel; you can change this if you’re confident with CSS.
| express-app/ routes/*	| These files define how HTTP requests are handled.  This usually involves calling a model function and passing the result to be rendered by a view.  It’s good practice to group similar routes into files to make your code more readable.
| express-app/views/*	| Each browser view is defined in a separate view file.  We’re using the Jade template engine which makes the HTML more obvious.  You can also pass variables in from the _res.render()_ functions in the router files.
| express-app/app.js	| This is the main application file, which sets up the environment and starts the HTTP server.  You can set the template engine (line 14) and the API path (line 17).  The most important thing you need to do is to map the URL requests to the appropriate route files (line 29-34).
| express-app/ package.json	| The NPM package file for your app.
| express-app/ bin/www	| This is mainly standard code, but you can set the port number in here at line 15.
| admin/data-setup.py	| This file loads your sample data, so it needs to match your business model.

## Create and load your sample data
You can pre-populate your Blockchain with some sample data - edit the file in the _admin_ directory, then from that directory, run
```bash
python ./data-setup.py
```

## Start the application
Open a new Terminal and navigate to the _express-app_ directory.  Start the application with
```bash
npm install
npm start
```
You can browse to the application at http://localhost:8000.

Congratulations! You've created a customer-specific Blockchain application on your local machine.

As a next step, you can deploy your Blockchain, REST server and application to Bluemix.  [Lab 7](./lab7-v1.md) shows you how to do that.
