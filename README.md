# C3P0-js
![](/jsbanner.png)

## What is C3P0-JS?
C3P0-JS is a web-based keypoint labeling tool for machine learning applications. It is a React service that provides a high-level interface that is easy to use and intuitive. The package was developed as a part of my master's thesis at Høgskolen i Østfold.

## Installation
To install the package, run the following command:

`
git clone https://github.com/wsvea-lochert/c3po-js.git
`

## install dependencies
Before trying to install the dependencies, make sure Node.js is installed on your system. If it is not installed follow the guide in this link: https://nodejs.org/en/


After Node.js is installed run the following terminal command to install all project dependecies:

`
npm install
`

## Firebase connection
Before you are able to use the package you have to set up a Firebase instance with Firebase Storage, authentication (Email/password sign in method) and Real-Time database. To get started with Firebase follow this link: https://firebase.google.com/ 

When your Firebase instances are up and ready you can move to the next step.

## Starting the service

To start the service run the following command: 

`
npm start
`

The service will start up and run on localhost:3000 by default, if you have another service running on that port you will automatically be prompted if you want the service to run on another port.

## Start labeling!
After the service is up and running you can now login, upload you data and start labeling! When the labeling process is finished go into your Firebase Console and download the data from you Real-Time database by selecting your your_dataset/dataset, and then Export JSON.

![](/downloadFirebase.jpg)

