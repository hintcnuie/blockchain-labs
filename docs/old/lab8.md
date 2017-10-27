# Blockchain Lab 8 - Deploy the REST server and application to Bluemix

This lab continues with the deployment of our Blockchain application to Bluemix.  We will now deploy the Hyperledger Composer REST Server to a Bluemix container, and our Node.js application to Cloud Foundry on Bluemix.

Note that for this lab you will need to have the Bluemix CLI installed – if you don’t have that, please see here: https://clis.ng.bluemix.net/ui/home.html

## Build the REST Server container
We’re going to build a container (based on _composer-rest-server_), customised with our Hyperledger connection profile and configuration data – this is the stuff we normally pass on the command line, such as business network name, ID and password.

We're still using the _lab5_ directory. In the _rest-server_ sub-directory, edit _Dockerfile_.

> **Learning Point:** unlike _docker-compose.yml_, which is a set of instructions for deploying existing containers, a Dockerfile shows how to build a new container.

![alt-text](./images/lab8-img1.png "Dockerfile")

Edit the _COMPOSER_BUSINESS_NETWORK_ to match your business model name.  

Edit the _COMPOSER_ENROLLMENT_ID_ and _COMPOSER_ENROLLMENT_SECRET_. You will need to choose a new ID/password pair from the Bluemix credentials.  You’ll get errors if you try to reuse a previous ID/password from a different container.

Edit the _membershipServicesURL_, _peerURL_ and _eventHubURL_ parameters to match your own Blockchain.

Edit the _networks_ parameter to match the name and 64-character UUID of your deployed business network.

Now build your new container.  It's useful to give it a unique name (_my-composer-rest-server_ for instance) as you may be pushing it to a shared Bluemix account.  From the _rest-server_ directory:
```bash
$ docker build -t my-composer-rest-server .
```
> **NB:** watch the dot! This means 'build the container from the current directory'.

## Deploy the REST container to Bluemix
You now need to login to the Bluemix Container Service.
```bash
$ bx api https://api.ng.bluemix.net
$ bx login –-sso
```
This will ask for a one-time code, you can get that at https://iam.ng.bluemix.net/oidc/passcode

> **NB:** if you're using an external Bluemix account, you will log in with `bx login -u <username>` and the account password.

The first time you use Bluemix Containers, you will need to install the Bluemix CLI Container plugin, and set a namespace name for your containers (something like your user ID should be fine).  If you’re using an account which has already been set up, there will already be a namespace name, you can find that using `bx ic namespace get`
```bash
$ bx plugin install IBM-Containers –r Bluemix
$ bx ic init
$ bx ic namespace-set <my-namespace>
```

On subsequent visits, you’ll just need to initialise the Container service
```bash
$ bx ic init
```

NB the command `bx ic` calls the IBM Containers service on Bluemix.  You can do most of the things you can do with the `docker` command, but it will happen on Bluemix, not on your local machine, for example try `bx ic images` or `bx ic ps`.

Back to our newly-built container from [lab 7](./lab7.md) - get the image ID from `docker images` – it will be the one just created. Remember you only need the first 3 characters of the image ID.

We need to tag this container image with the IBM Containers registry name, which will be _registry.ng.bluemix.net/<my-namespace>_, then we can push it to Bluemix Containers.
```bash
$ docker tag <image-id> registry.ng.bluemix.net/<my-namespace>/my-composer-rest-server:latest
$ docker push registry.ng.bluemix.net/<my-namespace>/my-composer-rest-server:latest
```

Wait a moment for the container to be pushed to Bluemix.

Now go back to your Bluemix account.  Click on the menu on the left, select _Apps_ then _Containers_.  Now select _Containers_ on the left again (in preference to _Clusters_).  You should see a window telling you that you don’t have any containers yet, and inviting you to create one.  Click _Create Container_.

![alt-text](./images/lab8-img2.png "Bluemix Containers")

You will now see a selection of container images which are available to you.  Most of these are the standard IBM ones (MQ, Liberty, etc), but you should also see any custom images which you have uploaded (NB it may take a few seconds for these to load).

![alt-text](./images/lab8-img3.png "Bluemix Containers")

Select your the container image which you uploaded.  On the next page
-	enter a name for the service (_my-server_ or similar)
-	in the _Public IP address_ field, select _Request and Bind Public IP_. Then click _Create_.

![alt-text](./images/lab8-img4.png "Bluemix Containers")

> **NB:** you can also do this from the command line with
```bash
$ bx ic run -p 3000:3000 --name my-server registry.ng.bluemix.net/<my-namespace>/my-composer-rest-server
$ bx ic ip-request
$ bx ic ip-bind <ip-address-from-previous-command> my-server
```

This will take a few moments to spin up the container.  Remember, we built into that container all of the necessary connection profiles and security certificates to be able to access the Blockchain service, which is also running on Bluemix.

Once it has finished, you will see more details of your running container.  Click on the _3000_ in the _Ports_ field to access the REST Server page – remember that you actually need the _/explorer_ page.

![alt-text](./images/lab8-img5.png "Bluemix Containers")

Add a few entries, then go back to the Blockchain dashboard and see that the number of blocks has increased.

## Deploy the application to Cloud Foundry on Bluemix
Now that the REST server is deployed with a public IP address, we can access the Blockchain from anywhere.  We will now deploy our Node.js Express application to Bluemix as a Cloud Foundry app.

It’s simple to deploy a well-structured application to Cloud Foundry, the only additional thing you need is a _manifest.yml_ file.  Navigate to the _express-app_ directory and look at that file.

<img src="./images/lab8-img6.png" alt="manifest.yml" style="width: 350px;"/>

> **Learning Point:** Cloud Foundry is just a specialised container which runs an application deployment tool called Diego.  It will recognise this package as a Node.js application, and will use the information in the manifest to manage the deployment of the code for us.

You need to make a couple of changes in here:
-	edit the application name – this must be unique
-	edit the _API_PATH_ environment variable to the URL of your REST server

Once that is done, you’re all set to deploy.

Using the Cloud Foundry CLI, login to Cloud Foundry (again, you’ll need a one-time code from the location shown)
```bash
$ cf login –-sso
```

Now, simply push the application to Cloud Foundry
```bash
$ cf push
```

Wait a few moments, and your application will be deployed to Bluemix.  You should be able to access it at http://xxx-express-app.mybluemix.net or similar, depending on your application name in the manifest.

**Congratulations!**  You’ve created a managed Hyperledger instance, created a REST server and deployed it to a container, and deployed your application, all on Bluemix.

In [lab 9](./lab9.md) we'll show you how to access your Blockchain model from OpenWhisk.
