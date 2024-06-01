#!/bin/bash

# Set Time Zone
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Ensure PATH includes the directory for ansible-playbook
export PATH=$PATH:/usr/local/bin

# Set permissions for the cron file (copied from a volume)
chmod 0644 /etc/cron.d/ansible

# Apply the cron job
crontab /etc/cron.d/ansible

# Start the cron service
service cron start

# Create the log file to be able to run tail
touch /var/log/cron.log

# Start application
python3 ./main.py