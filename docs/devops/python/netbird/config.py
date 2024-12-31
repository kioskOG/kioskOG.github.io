import os

BASE_URL = "https://<Netbird domain>/"
ACC_PATH = 'api/accounts'
# TOKEN = 'nbp_JKZH0k4CaYU8MzGtHOFZo0KGW7XUoq3LYRdM'

LIST_USERS = "api/users"
LIST_SETUP_KEYS = "api/setup-keys"
LIST_GROUPS = "api/groups"
LIST_PEERS = "api/peers"
LIST_POLICIES = "api/policies"
LIST_POSTURE_CHECKS = "api/posture-checks"
CREATE_POLICIES = "api/policies"
LIST_NAMESERVERS = "api/dns/nameservers"
LIST_ROUTES = "api/routes"
LIST_EVENTS = "api/events"

def token():
    token = os.environ.get('NETBIRD_TOKEN')
    if not token:
        raise EnvironmentError("NETBIRD_TOKEN environment variable is not set.")
    return token

def account_url():
    return BASE_URL + ACC_PATH

def list_user_url():
    return BASE_URL + LIST_USERS

def setup_key_url():
    return BASE_URL + LIST_SETUP_KEYS

def list_group_url():
    return BASE_URL + LIST_GROUPS
def create_group_url():
    return BASE_URL + LIST_GROUPS

def list_peers_url():
    return BASE_URL + LIST_PEERS

def list_policies_url():
    return BASE_URL + LIST_POLICIES

def list_posture_checks_url():
    return BASE_URL + LIST_POSTURE_CHECKS

def create_posture_checks_url():
    return BASE_URL + LIST_POSTURE_CHECKS

def update_posture_checks_url():
    return BASE_URL + LIST_POSTURE_CHECKS

def create_acl_policies():
    return BASE_URL + CREATE_POLICIES

def list_name_server_url():
    return BASE_URL + LIST_NAMESERVERS

def create_name_server_url():
    return BASE_URL + LIST_NAMESERVERS

def list_routes():
    return BASE_URL + LIST_ROUTES

def create_route_url():
    return BASE_URL + LIST_ROUTES
def list_events():
    return BASE_URL + LIST_EVENTS
