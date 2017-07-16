#!/bin/bash

echo "Setting up environment for API..."

echo "Updating npm; Running 'npm install -g npm'..."
npm install -g npm

echo "Installing global dependencies (@angular/cli babel-cli bower depcheck express nodemon requirejs)..."
npm install -g @angular/cli babel-cli bower depcheck express nodemon requirejs

echo "Running 'npm install'..."
npm install

echo "Checking for 'crawlers' dir in %cd%..."
if [ -e "%cd%/crawlers" ]; then
	echo "'crawlers' dir exists"
else
	echo "'crawlers' dir was missing; creating 'crawlers' dir..."
    mkdir "%cd%/crawlers"
    echo "'crawlers' dir created successfully"
fi

echo "Checking for 'data' dir in %cd%..."
if [ -e "%cd%/data" ]; then
	echo "'data' dir exists"
else
	echo "'data' dir was missing; creating 'data' dir..."
    mkdir "%cd%/data"
    echo "'data' dir created successfully"
fi

echo "Checking for 'dark' dir in %cd%/data..."
if [ -e "%cd%/data/dark" ]; then
	echo "'dark' dir exists"
else
	echo "'dark' dir was missing; creating 'dark' dir..."
    mkdir "%cd%/data/dark"
    echo "'dark' dir created successfully"
fi

echo "Checking for 'fire' dir in %cd%/data..."
if [ -e "%cd%/data/fire" ]; then
	echo "'fire' dir exists"
else
	echo "'fire' dir was missing; creating 'fire' dir..."
    mkdir "%cd%/data/fire"
    echo "'fire' dir created successfully"
fi

echo "Checking for 'light' dir in %cd%/data..."
if [ -e "%cd%/data/light" ]; then
	echo "'light' dir exists"
else
	echo "'light' dir was missing; creating 'light' dir..."
    mkdir "%cd%/data/light"
    echo "'light' dir created successfully"
fi

echo "Checking for 'water' dir in %cd%/data..."
if [ -e "%cd%/data/water" ]; then
	echo "'water' dir exists"
else
	echo "'water' dir was missing; creating 'water' dir..."
    mkdir "%cd%/data/water"
    echo "'water' dir created successfully"
fi

echo "Checking for 'wind' dir in %cd%/data..."
if [ -e "%cd%/data/wind" ]; then
	echo "'wind' dir exists"
else
	echo "'wind' dir was missing; creating 'wind' dir..."
    mkdir "%cd%/data/wind"
    echo "'wind' dir created successfully"
fi
