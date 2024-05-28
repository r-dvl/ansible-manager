#!/bin/bash

# Set Time Zone
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Start application
serve -s dist