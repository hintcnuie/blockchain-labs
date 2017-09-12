# Blockchain Tutorial Labs

This set of tutorial labs will introduce you to the Hyperledger blockchain technology.

Labs 1 & 2 will show you how to create a simple Hyperledger Fabric blockchain network on your machine, running in Docker containers.

Labs 3 & 4 will show you how to define a business network model using Hyperledger Composer, how to expose that model using a REST API, and how to quickly build a simple application to work with that model.

Labs 5 & 6 will show you how to build a real-world prototype using Hyperledger Composer’s command line interface and a Node.js application running on your local machine.

Labs 7 & 8 will show you how to deploy your Blockchain, REST server and application to Bluemix.

Labs 9 & 10 will show you how to interact with your Blockchain network using OpenWhisk and Node-RED.

## What will we be doing?
This is a series of tutorial labs where we will be setting up and running Blockchain networks based on Hyperledger Fabric.  We will start with a basic setup, and then move onto more advanced topics such as
-	using Hyperledger Composer to build a business network
-	creating and using an API to interact with that business network
-	deploying to IBM Bluemix and using OpenWhisk

We assume a familiarity with the command line – creating and switching directories, running commands etc.  If you need an intro to the command line, try [here](https://lifehacker.com/5633909/who-needs-a-mouse-learn-to-use-the-command-line-for-almost-anything).

We also assume a basic knowledge of Docker, using commands like docker run, docker images and docker ps.

> **Learning Point:** Docker is a lightweight virtualisation technology which lets you create and run applications in simple containers on your local machine or in the cloud. You can get an intro to Docker [here](https://docs.docker.com/engine/docker-overview/).

The tutorial runs on MacOS Sierra (10.12) and Ubuntu Linux 14.04 LTS.  **Note that it will not run on Windows** - we recommend installing Ubuntu in a VM using [VirtualBox](https://www.virtualbox.org) if you have Windows (or if you want to keep the labs separate from your Mac environment).

## IBM Bluemix account
The early parts of this lab are done on a local machine. To complete the later part of the lab you will need an IBM Bluemix account. Bluemix is a complete cloud development and production platform offering virtual servers, containers, Cloud Foundry and serverless compute options, as well as a wide range of storage, database, analytics and AI services.  A _Standard_ account is free, has no time limit, and offers sufficient resources to run your own test Blockchain and associated apps, You can sign up at http://bluemix.net/. 

## Installing the pre-requisites
These tools need to be installed at the levels shown (or higher).  
-	Node.js: 6.x (NB version 7 is NOT supported by Hyperledger Composer)
-	npm: 3.10
-	git: 2.9
-	Docker: 1.12
-	docker-compose: 1.8
-	cURL: 7.51
- Python: 2.7

You can usually check the versions from a command line by typing
`<tool-name> --version`, e.g. `node --version`.

> **NB:** since March 2017 Docker has used year-based version numbers, so they went from v1.13 straight to v17.03

> **Ubuntu only:** A pre-requisite install script is available to install all of these tools:
```bash
$ curl -O https://raw.githubusercontent.com/idpattison/blockchain-labs/master/prereqs-ubuntu.sh
$ chmod u+x prereqs-ubuntu.sh
$ ./prereqs-ubuntu.sh
```

Install Node.js (which includes npm) from https://nodejs.org/en/download/ - get the LTS version which is v6, not v7.

Install git from https://git-scm.com/downloads (accept any default options).

Install Docker Community Edition (the Stable version), which includes docker-compose, from:
-	Mac: https://docs.docker.com/docker-for-mac/install/
-	Ubuntu: https://docs.docker.com/engine/installation/linux/ubuntu/

Once you've installed Docker, start it from the Start menu / Applications folder.

Install the Bluemix CLI from https://clis.ng.bluemix.net/ui/home.html.

> **Mac only:** You will also need to install XCode from the Mac App Store – it’s free but takes a while to download.

## Installing a code editor
You will need a code editor to work with the tutorial.  Atom is a popular editor, and is available for free at https://atom.io - it works on all platforms.  It offers advanced features such as syntax highlighting and code completion.  Note that a simple text editor like Notepad or Text Editor will not work as they often insert unwanted formatting.

Atom allows you to add support for different application development environments, such as JavaScript and Swift.  Hyperledger Composer's modeling language has its own syntax, and you can install the package for this. From Atom's menu, click on Packages -> Settings View -> Install Packages & Themes.  Search for the _composer-atom-plugin_ package, and install it.

Now you're set up, start with [lab 1](./lab1-v1.md).
