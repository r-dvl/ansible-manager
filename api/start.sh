#!/bin/bash

# Start cron service
service cron start

# Start your application
python3 ./main.py