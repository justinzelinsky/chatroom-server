# Chatroom

[![Build Status](https://travis-ci.com/justinzelinsky/chatroom-server.svg?branch=master)](https://travis-ci.com/justinzelinsky/chatroom-server)
[![codecov](https://codecov.io/gh/justinzelinsky/chatroom-server/branch/master/graph/badge.svg)](https://codecov.io/gh/justinzelinsky/chatroom-server)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

The server for a simple chatroom, built using Socket.IO and Mongo.

## Purpose

This is my pet project which allows me to test my knowledge of JavaScript and Web Development. The end goal is to have a full CI/CD pipeline.

## Setup & Running

## Setup

You must set the following environment variables (or create `.env` in the root of this project):

- SERVER_PORT
- MONGO_DB
- CHATROOM_SECRET

### Install

`npm install`

### Usage

`npm start`

The server will be running on `localhost:8083`. You will need the UI codebase to use the server. You can check out that codebase [here](https://github.com/justinzelinsky/chatroom-ui).

## Special Thanks

Many thanks to Rishi Prasad for his phenomenal [tutorial](https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669) on building an authentication app.
