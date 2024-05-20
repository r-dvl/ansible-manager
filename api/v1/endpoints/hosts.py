import os
import yaml
from pathlib import Path
from fastapi import APIRouter


router = APIRouter()

# Hosts path
hosts_path = Path(os.getenv('ANSIBLE_INVENTORY'))

@router.get("/")
def get_hosts():
    with open(path, 'r') as stream:
        try:
            data = yaml.safe_load(stream)
            hosts_info = {}
            for group in data:
                for host in data[group]['hosts']:
                    hosts_info[host] = data[group]['hosts'][host]
                    hosts_info[host]['group'] = group
            return hosts_info
        except yaml.YAMLError as exc:
            return {"error": "Hosts file doesn't exists."}