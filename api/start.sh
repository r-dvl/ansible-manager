#!/bin/bash

# Set Time Zone
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install and start cron service
chmod 0644 /etc/cron.d/ansible
crontab /etc/cron.d/ansible
service cron start

# Start application
python3 ./main.py