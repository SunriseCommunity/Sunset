#!/bin/bash

export NODE_ENV="production"
export NEXT_TELEMETRY_DISABLED=1

npm install

npm run build

mkdir publish

cp run.sh publish/run.sh
cp -r .next/standalone/* publish/
cp -r .next/standalone/.next publish/.next
cp -r public publish/public
cp -r .next/static publish/.next/static