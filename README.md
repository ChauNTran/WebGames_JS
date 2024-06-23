# Pre-Requisites
1. [Node.js and npm](https://nodejs.org/en/). The production site uses version 8.11, but newer versions
should work fine.

# Installation
Open the Node.js command line and navigate to the root directory of the project and type:
```
npm install
```
This will download and install all necessary dependencies.

#Running
Open up two command prompts and navigate to the root directory.

In the first one, run the following command to turn on webpack
```
npm run build
```
this will automatically re-build if it detects changes in index.js or its dependencies.

In the second one, type the following command to start the server:
```
npm run start
```
If you make changes to the server, you'll need to kill this process and re-start it.
