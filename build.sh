#!/bin/bash

npm install

npm run build

mkdir publish

cp run.sh publish/run.sh
cp -r .next/standalone/* publish/*
cp -r public publish/public
cp -r .next/static publish/.next/static