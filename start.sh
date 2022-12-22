#!/bin/bash

npm_ls="$(npm ls)"
if (echo "$npm_ls" | grep -q UNMET) || ! (echo "$npm_ls" | grep -q node-pinyin && echo "$npm_ls" | grep -q readline-sync); then
	echo Installing dependencies...
	npm i
fi

node index.js $@
