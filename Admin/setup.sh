#!/bin/bash

echo "Setting up environment for Admin..."

echo "Updating npm; Running 'npm install -g npm'..."
npm install -g npm

echo "Installing global dependencies (@angular/cli babel-cli bower depcheck express nodemon requirejs)..."
npm install -g @angular/cli babel-cli bower depcheck express nodemon requirejs

echo "Running 'npm install'..."
npm install
