# Blockchain Lab 1 - Create a local Hyperledger Fabric

We’re going to create a simple Hyperledger Fabric v0.6 network on your machine, running in two Docker containers. It will have one peer node, and a membership services node.

<img src="./images/lab1-img1.png" alt="Lab 1 architecture" style="width: 400px;"/>


## Getting started – creating the working directory
Start a Terminal window.  Clone the Github repository to create a working directory and switch into the _lab1_ directory:
```bash
$ git clone https://github.ibm.com/future-skills-cloud/blockchain.git
$ cd blockchain/lab1
```
> **NB:** this will download the files for all of the Blockchain labs.

> **Learning Point**: when using IBM’s Enterprise Github you will need to be connected to the IBM network and log in with your Github ID and a Personal Access Token (not your IBM password) – see https://github.ibm.com/settings/tokens for details.


## Pull the _fabric-baseimage_ Docker container
Pull the Hyperledger base image container from the Docker repository, and tag it as ‘latest’. This image will be used to spin up our two containers.  This could take a few minutes to download the first time, but Docker will cache it locally.
```bash
$ docker pull hyperledger/fabric-baseimage:x86_64-0.3.0
$ docker tag hyperledger/fabric-baseimage:x86_64-0.3.0 hyperledger/fabric-baseimage:latest
```

You can see the container image on your local machine by typing
```bash
$ docker images
```


## Docker Compose file
Next open the Docker Compose file – this is a series of instructions for Docker.  You can also specify these on the command line, but using a Docker Compose file saves some typing.  The file (_docker-compose.yml_) is in the _lab1_ directory.  Open it with your favourite coding editor – if you’re using Atom you can do this with
```bash
$ atom docker-compose.yml
```

Let’s take a look at the file.  Docker will use this file to determine how many containers to start up, using which container images, and in what environment.
![alt-text](./images/lab1-img2.png "Docker Compose file")


Look at the details for the _vp0_ container:
-	it will use the latest version of the _fabric-peer_ image
-	it will map the container’s ports 7050-3 to the same ports on your local machine, so you will be able to access the container
-	it sets some environment variables, including the address and port of the membership services container
-	it sets a command which will run once the container is started – this will start the Hyperledger peer process

Note that _fabric-peer_ isn’t currently in your local image repository, so Docker will download it.  However it is based on _fabric-baseimage_ which you downloaded earlier, so that will save some time.


## Create the containers
Run the Docker Compose file to create the two containers and set up our Hyperledger network:
```bash
$ docker-compose up -d
```

> **Learning Point**: the –d flag tells Docker to run in ‘detached’ mode, in other words, control will be returned back to the command line once the containers are up and running.  If you want to see the console logs from the containers as they run, omit the –d.  You will then need to open a new terminal window.

You can see your containers running with
```bash
$ docker ps

CONTAINER ID        IMAGE                                  COMMAND                  CREATED             STATUS              PORTS                              NAMES
1a29702f783f        hyperledger/fabric-peer:latest         "sh -c 'sleep 5; p..."   5 days ago          Up About a minute   0.0.0.0:7050-7053->7050-7053/tcp   lab1_vp0_1
10cd79befdb0        hyperledger/fabric-membersrvc:latest   "membersrvc"             5 days ago          Up About a minute   0.0.0.0:7054->7054/tcp             lab1_membersrvc_1
```
and you can inspect the environment of a running container with
```bash
$ docker inspect <container-id>
```
Note that you can abbreviate the container ID (_1a29702f783f_ in the output above) to just the first three characters (_1a2_), to make it easier to type.

If you want to see all of the current containers, whether they are running or stopped, use
```bash
$ docker ps -a
```

## View the chain using the API
Now that our Blockchain network is running, we can examine it using a basic API.  Check with `docker ps` and you will see that our _vp0_ peer is running on port 7050; remember that in _docker-compose.yml_ we mapped the container’s port 7050 to the same port on the local machine.   You can therefore access peer _vp0_ through that port:
```bash
$ curl localhost:7050/chain
```

This should return a JSON object showing the height of the chain as 1 – this is the ‘genesis’ block, which is the first block added to the start of every Blockchain.
```bash
{"height":1,"currentBlockHash":"RrndKwuojRMjOz/rdD7rJD/NUupiuBuCtQwnZG7Vdi/XXcTd2MDyAMsFAZ1ntZL2/IIcSUeatIZAKS6ss7fEvg=="}
```

Note that depending on the setup of your system, you might need to use the IP addresses _127.0.0.1_ or _0.0.0.0_ instead of _localhost_.

You have deployed Hyperledger to Docker containers on your local machine.  You can now continue straight on to [lab 2](./lab2.md).
