#!/bin/bash

echo "Setting up environment for API..."

echo "Updating npm; Running 'npm install -g npm'..."
npm install -g npm

echo "Installing global dependencies (@angular/cli babel-cli bower depcheck express nodemon requirejs)..."
npm install -g @angular/cli babel-cli bower depcheck express nodemon requirejs

echo "Running 'npm install'..."
npm install

echo "Checking for 'data' dir in $PWD..."
if [ -e "$PWD/data" ]; then
	echo "'data' dir exists"
else
	echo "'data' dir was missing; creating data dir..."
    mkdir "$PWD/data"
    echo "'data' dir created successfully"
fi

echo "Checking for 'dark' dir in $PWD/data..."
if [ -e "$PWD/data/dark" ]; then
	echo "'dark' dir exists"
else
	echo "'dark' dir was missing; creating 'dark' dir..."
    mkdir "$PWD/data/dark"
    echo "'dark' dir created successfully"
fi

echo "Checking for 'fire' dir in $PWD/data..."
if [ -e "$PWD/data/fire" ]; then
	echo "'fire' dir exists"
else
	echo "'fire' dir was missing; creating 'fire' dir..."
    mkdir "$PWD/data/fire"
    echo "'fire' dir created successfully"
fi

echo "Checking for 'light' dir in $PWD/data..."
if [ -e "$PWD/data/light" ]; then
	echo "'light' dir exists"
else
	echo "'light' dir was missing; creating 'light' dir..."
    mkdir "$PWD/data/light"
    echo "'light' dir created successfully"
fi

echo "Checking for 'water' dir in $PWD/data..."
if [ -e "$PWD/data/water" ]; then
	echo "'water' dir exists"
else
	echo "'water' dir was missing; creating 'water' dir..."
    mkdir "$PWD/data/water"
    echo "'water' dir created successfully"
fi

echo "Checking for 'wind' dir in $PWD/data..."
if [ -e "$PWD/data/wind" ]; then
	echo "'wind' dir exists"
else
	echo "'wind' dir was missing; creating 'wind' dir..."
    mkdir "$PWD/data/wind"
    echo "'wind' dir created successfully"
fi
