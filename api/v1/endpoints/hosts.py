from fastapi import APIRouter
import yaml

router = APIRouter()

# Hosts path
path = '/ansible-playbooks/inventories/hosts.yaml'

@router.get("/read")
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