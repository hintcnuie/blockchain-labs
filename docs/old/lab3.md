# Blockchain Lab 3 - Hyperledger Composer Playground

The previous lab showed that deploying and invoking chaincode directly on a Blockchain is a complex process which involves working directly with the Hyperledger peers using `docker exec`.  This lab looks at Hyperledger Composer, which abstracts away the detailed implementation and allows you to focus on a business model and network.

First, we’re going to set up three Docker containers – the peer node and membership services node from the previous lab, plus a third container running Hyperledger Composer.  This will be accessed from a browser, and will be used to define and deploy a business network to the Hyperledger Blockchain.

In the next lab we will set up a REST API server and a UI app, both running on our local machine, and show how we can use those to access the business network model that we will deploy here.

<img src="./images/lab3-img1.png" alt="Lab 3 & 4 architecture" style="width: 400px;"/>


## Set up Hyperledger Composer
Switch to the _lab3_ directory.  In there you’ll find another _docker-compose.yml_ file.

Open that file – again, if you’re using Atom you can do this with
```bash
$ atom docker-compose.yml
```
You’ll notice that this is the same file as we used in lab 1, but with an additional container (_composer_) added.  These are the additional lines:

![alt-text](./images/lab3-img2.png "Docker Compose file")

This will, when we run `docker-compose up`, create a third container which will run a copy of Hyperledger Composer.  Some things to note:
-	We’ve exposed port 8080, so we can run Composer via a web interface
-	In the _links_ section we reference the other two containers, _vp0_ and _membersrvc_ – this allows Composer to access the Hyperledger blockchain
-	We have provided a connection profile to tell composer exactly how to access our Blockchain.

> **Learning Point:** connection profiles are stored in the _~/.composer-connection-profiles/_ directory on your local machine.  However, as we're running Composer in a container, it will be stored in the that directory _**on the container**_. This can cause confusion, so always bear in mind where you are connecting to Hyperledger from - local machine or container.

Start all three containers with
```bash
$ docker-compose up –d
```
If you run `docker ps` you will see that we do now have three containers running.

Open a web browser and navigate to http://localhost:8080.  Click through the splash screen and you should see the main Hyperledger Composer Playground window

![alt-text](./images/lab3-img3.png "Hyperledger Composer Playground")

## Deploy a business network
Composer is pre-populated with the _basic-sample-network_ – this is the ‘Hello World’ of business models.  There are three files, which you can access in the left sidebar:
-	the Model file (_lib/org.acme.sample.cto_) which defines the participants, assets and transactions, and the relationships between them
-	the Script file (_lib/logic.js_) which defines the transactions in JavaScript
-	the Access Control file (_permissions.acl_) which defines who can do what in the business network

We are going to replace this basic network with a slightly more interesting one.  Click on _Import/Replace_ in the lower left, then from the list that appears, select _digitalproperty-network_ and click _Deploy_.
> **NB:** you may get rate-limit error messages from GitHub, especially if you're doing this lab with other people.  In that case, you can drag the _digitalproperty-network.bna_ file from the _lab3_ directory onto Composer Playground - where it says 'Drop here to upload'.

This business network allows us to record details about people, properties (land titles) and property sales agreements, and allows us to invoke one transaction – _RegisterPropertyForSale_.   Examine the Model and Script files and familiarize yourself with the details of our business network.

We have deployed the business network into the web browser, but we still need to deploy it to our Blockchain.  Click the globe icon in the top right, then select the _hlfabric_ profile in the left sidebar (recall that we set this connection profile up the Docker Compose file).  Click _Use this profile_.

![alt-text](./images/lab3-img4.png "Hyperledger Composer Playground")


In the _Connect with an Identity_ pop-up, make sure that _admin_ is selected (again, this was set up earlier) and click _Connect_.

You will get a message saying _Please wait, deploying business network_.  It could take several minutes to deploy.

When deployment has completed, run `docker ps` – this will show that a new container has been created to run the business network’s chaincode.  Also run `curl localhost:7050/chain` – this will show that a block has been added to the chain.

## Entering data into the business network
In Composer Playground, click on the _Test_ tab – this will allow us to enter data and test transactions.  In the left sidebar you will see the types of participants and assets we defined in our model.

Select _Person_, and click on _Create New Participant_ in the top right.

<img src="./images/lab3-img5.png" alt="Hyperledger Composer Playground" style="width: 400px;"/>


This allows us to enter an entity of class _Person_.  Add a _firstName_ and _lastName_, and note down the digits of the _personId_, as you will need that later.  Click _Create New_.
> **NB:** there's a convention that the _personId_ is of format _PID:xxxx_, but it could be any unique String.

Add several more people.  Each time you do, check `curl localhost:7050/chain` to show that a new block is being added each time you add a participant to the database.

![alt-text](./images/lab3-img6.png "Hyperledger Composer Playground")

Next click _LandTitle_ in the left sidebar, and repeat the process to add some properties.  This time, because there is a foreign key relationship between Person and Land Title (a Person is the _owner_ of a LandTitle), you will need to specify a _personId_ that you noted down earlier as the owner (note that you only need to change the digits).  Also, note down the digits of the _titleId_ of this property.

Add a few more properties if you want.

## Executing a transaction
We will now execute a transaction to register a property for sale.  If you haven’t already, note down the _titleId_ and _owner_ of one of your properties.  Click on _Submit Transaction_.  Enter the _titleId_ digits in _title_ field, and the _owner_ digits in the _seller_ field.  Click _Submit_.

This will execute the transaction in the Blockchain (you will get another block added).  If you now check the list of properties, you will see that one is now for sale.

## Change the business network and redeploy
Click on the _Define_ tab to go back to the model definition.  In the Script file, add the line beginning _propertyForSale.title.information_:
```javascript
function onRegisterPropertyForSale(propertyForSale) {
    console.log('### onRegisterPropertyForSale ' + propertyForSale.toString());
    propertyForSale.title.forSale = true;
    propertyForSale.title.information += " – NOW FOR SALE!!";

    return getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle').then(function(result) {
        return result.update(propertyForSale.title);
    }
    );
}
```

This will modify the transaction to add a comment to the end of the property’s _information_ field.  Check the model file to see if you can follow the logical flow of what we’ve done here.

Click _Deploy_ to redeploy the business network to the Blockchain.

Go back to the _Test_ tab and submit another _RegisterPropertyForSale_ transaction on a different property.  When it has completed, check that the property now has the "FOR SALE!!” comment in its _information_ field.

Continue with [lab 4](./lab4.md).
