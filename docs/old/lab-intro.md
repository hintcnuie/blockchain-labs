# Blockchain Tutorial Labs

This set of tutorial labs will introduce you to the Hyperledger blockchain technology.

Labs 1 & 2 will show you how to create a simple Hyperledger Fabric blockchain network on your machine, running in Docker containers.

Labs 3 & 4 will show you how to define a business network model using Hyperledger Composer, how to expose that model using a REST API, and how to quickly build a simple application to work with that model.

Labs 5 & 6 will show you how to build a real-world prototype using Hyperledger Composer’s command line interface and a Node.js application running on your local machine.

Labs 7 & 8 will show you how to deploy your Blockchain, REST server and application to Bluemix.

## What will we be doing?
This is a series of tutorial labs where we will be setting up and running Blockchain networks based on Hyperledger Fabric.  We will start with a basic setup, and then move onto more advanced topics such as
-	using Hyperledger Composer to build a business network
-	creating and using an API to interact with that business network
-	deploying to Bluemix and using OpenWhisk

We assume a familiarity with the command line – creating and switching directories, running commands etc.  If you need an intro to the command line, try [here](https://lifehacker.com/5633909/who-needs-a-mouse-learn-to-use-the-command-line-for-almost-anything).

We also assume a basic knowledge of Docker, using commands like docker run, docker images and docker ps.

> **Learning Point:** Docker is a lightweight virtualisation technology which lets you create and run applications in simple containers on your local machine or in the cloud. You can get an intro to Docker [here](https://docs.docker.com/engine/docker-overview/).

The tutorial runs on MacOS Sierra (10.12), Windows 10 Pro and Ubuntu Linux 14.04 LTS.  **Note that it will not run on Windows 7** - a VM is available of Ubuntu 14.04 LTS, including the pre-reqs, which can run in VMWare or VirtualBox if you have Windows 7.

**TODO - add Aspera links to the VMs here**

Note that we will be making extensive use of the command line.  In Mac and Ubuntu, this is called the Terminal.  In Windows, this is called the Command Prompt.  For simplicity, we have used ‘Terminal’ throughout this tutorial.

Note also that we are using Hyperledger Fabric v0.6 - v1.0 is currently is beta release, but it still lacks some of the features we need for the tutorial.

## Installing the pre-requisites
These tools need to be installed at the levels shown (or higher).  
-	Node.js: 6.x (NB version 7 is NOT supported by Hyperledger Composer)
-	npm: 3.10
-	git: 2.9
-	Docker: 1.12
-	docker-compose: 1.8
-	cURL: 7.51
- bx (Bluemix CLI): 0.5

You can usually check the versions from a command line by typing
`<tool-name> --version`, e.g. `node --version`.

> **Ubuntu only:** A pre-requisite install script is available to install all of these tools:
```bash
$ curl –O https://raw.github.ibm.com/future-skills-cloud/blockchain/master/prereqs-ubuntu.sh
$ chmod u+x prereqs-ubuntu.sh
$ ./prereqs-ubuntu.sh
```

Install Node.js (which includes npm) from https://nodejs.org/en/download/ - get the LTS version which is v6, not v7.

Install git from https://git-scm.com/downloads (accept any default options).

Install Docker Community Edition (the Stable version), which includes docker-compose, from:
-	Mac: https://docs.docker.com/docker-for-mac/install/
-	Windows: https://docs.docker.com/docker-for-windows/install/
-	Ubuntu: https://docs.docker.com/engine/installation/linux/ubuntu/

Once you've installed Docker, start it from the Start menu / Applications folder.

Install the Bluemix CLI from https://clis.ng.bluemix.net/ui/home.html.

> **Mac only:** You will also need to install XCode from the Mac App Store – it’s free but takes a while to download.

> **Windows only:** You will need to install the following:
- cURL – instructions are at https://help.zendesk.com/hc/en-us/articles/229136847-Installing-and-using-cURL
- Python 2 https://www.python.org/downloads/windows/

## Installing a code editor
You will need a code editor to work with the tutorial.  Atom is a popular editor, and is available for free at https://atom.io - it works on all platforms.  It offers advanced features such as syntax highlighting and code completion.  Note that a simple text editor like Notepad or Text Editor will not work as they often insert unwanted formatting.

> **Windows only:** You will need to add `C:\Users\<user>\AppData\Local\atom\bin` to your `$PATH` environment variable in order to start Atom from the command line.

While most application development environments, such as JavaScript and Swift, are supported by Atom, Composer is experimental and it is trickier to set up the required support.  Optionally, you can install the syntax and code completion package for Composer by following the instructions at https://github.com/hyperledger/composer-atom-plugin.

Now you're set up, start with [lab 1](./lab1.md).
