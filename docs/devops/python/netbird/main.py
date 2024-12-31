import config
import requests
import json
from requests.exceptions import Timeout
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Token {config.token()}'
}

max_retries = 3
timeout = 0.20


# List Accounts
def list_accounts():
    url = config.account_url()
    formatted_json = None  # Ensure it's defined before usage

    for retries in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)  # Use a reasonable timeout value
            response.raise_for_status()  # Raise an error if the response status code is not 2xx
            formatted_json = response.json()
            break
        except Timeout:
            print(f"{Fore.RED}Timeout Error: Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Request failed: {e}")
            return  # Exit if there's a fatal error (e.g., invalid URL, authentication failure)

    if not formatted_json:
        print(f"{Fore.YELLOW}No data received after {max_retries} retries.")
        return

    if not formatted_json:  # Check if the JSON response is empty or null
        print(f"{Fore.YELLOW}No accounts present.")
    else:
        for account in formatted_json:
            print(f"{Fore.GREEN}Account ID: {account['id']}")


# List Users
def list_users():
    users_dict = {}
    url = config.list_user_url()

    for retries in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            formatted_json = response.json()
            break
        except Timeout:
            print(f"{Fore.RED}Timeout Error: Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Request failed: {e}")
            return
    else:
        print(f"{Fore.YELLOW}No data received after {max_retries} retries.")
        return

    if not formatted_json:
        print(f"{Fore.YELLOW}No users found.")
        return

    for user in formatted_json:
        name = user.get("name", "Unknown Name")
        email_id = user.get("email", "Unknown Email")
        users_dict[name] = email_id

    print(f"{Fore.GREEN}User details:\n{json.dumps(users_dict, indent=4)}")


# List Peers 
def list_peers():
    url = config.list_peers_url()

    for retries in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            formatted_json = response.json()
            break
        except Timeout:
            print(f"{Fore.RED}Timeout Error: Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Request failed: {e}")
            return
    else:
        print(f"{Fore.YELLOW}No data received after {max_retries} retries.")
        return

    if not formatted_json:
        print(f"{Fore.YELLOW}No peers found.")
        return

    print(f"{Fore.GREEN}Peers:")
    for peer in formatted_json:
        peer_id = peer.get("id", "Unknown ID")
        dns_label = peer.get("dns_label", "Unknown DNS Label")
        peer_ip = peer.get("ip", "Unknown IP")
        print(f"Peer ID: {peer_id}, DNS Name: {dns_label}, Peer IP: {peer_ip}")


# Setup Keys
def list_setup_keys():
    expired_keys = []  # To store expired key IDs
    setup_keys_dict = {}
    url = config.setup_key_url()

    for retries in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            formatted_json = response.json()
            break
        except Timeout:
            print(f"{Fore.RED}Timeout Error: Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Request failed: {e}")
            return
    else:
        print(f"{Fore.YELLOW}No data received after {max_retries} retries.")
        return

    if not formatted_json:
        print(f"{Fore.YELLOW}No setup keys found.")
        return

    print(f"{Fore.GREEN}Setup Keys:")
    for setup_key in formatted_json:
        name = setup_key.get("name", "Unknown Key")
        key_id = setup_key.get("id", "Unknown ID")
        key_value = setup_key.get("key", "Unknown Key")
        expires_on = setup_key.get("expires", "No Expiration")
        auto_groups = ", ".join(setup_key.get("auto_groups", []))
        state = setup_key.get("state", "unknown")

        if state == "expired":
            status = "Key is expired"
            expired_keys.append(key_id)
        else:
            status = f"Expires on {expires_on}"

        setup_keys_dict[f"{name} ({key_id})"] = f"{key_value} - {auto_groups} - {status}"

    for key, details in setup_keys_dict.items():
        print(f"{key} - {details}")

    return expired_keys


def create_setup_keys():
    url = config.setup_key_url()

    # Load keys_to_create from a JSON file
    try:
        with open("keys_to_create.json", "r") as file:
            keys_to_create = json.load(file)
    except FileNotFoundError:
        print(f"{Fore.RED}Error: The file 'keys_to_create.json' was not found.")
        return
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'keys_to_create.json'.")
        return

    # Fetch existing setup keys
    existing_names = set()
    for retries in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            existing_keys = response.json()
            existing_names = {key.get("name", "Unknown") for key in existing_keys}
            break
        except Timeout:
            print(f"{Fore.YELLOW}Timeout while fetching existing setup keys. Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error fetching existing setup keys: {e}")
            return
    else:
        print(f"{Fore.RED}Failed to fetch existing keys after {max_retries} retries.")
        return

    # Create setup keys from the file
    for key_payload in keys_to_create:
        key_name = key_payload.get("name", "Unknown Key")
        if key_name in existing_names:
            print(f"{Fore.YELLOW}Key '{key_name}' already exists. Skipping creation.")
            continue

        try:
            response = requests.post(url, json=key_payload, headers=headers)
            response.raise_for_status()
            created_key = response.json()
            print(
                f"{Fore.GREEN}Key created successfully: {created_key.get('name')} (ID: {created_key.get('id')}) (Key: {created_key.get('key')} )")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error creating key '{key_name}': {e}")


def delete_setup_keys(expired_keys):
    url = config.setup_key_url()

    for key_id in expired_keys:
        try:
            delete_url = f"{url}/{key_id}"
            response = requests.delete(delete_url, headers=headers)
            if response.status_code == 204:
                print(f"{Fore.GREEN}Successfully deleted key with ID: {key_id}")
            else:
                print(f"{Fore.RED}Failed to delete key with ID: {key_id}. Response: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error deleting key with ID {key_id}: {e}")


# Groups
def list_groups():
    url = config.list_group_url()

    for retries in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            formatted_json = response.json()
            break
        except Timeout:
            print(f"{Fore.YELLOW}Timeout while fetching groups. Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error fetching groups: {e}")
            return
    else:
        print(f"{Fore.RED}Failed to fetch groups after {max_retries} retries.")
        return []

    print(f"{Fore.GREEN}Existing Groups:")
    for group in formatted_json:
        group_id = group.get("id", "Unknown ID")
        group_name = group.get("name", "Unknown Name")
        print(f"Group ID: {group_id} | Group Name: {group_name}")
        peers = group.get("peers", [])
        if isinstance(peers, list):
            for peer in peers:
                print(f"  Peer ID: {peer.get('id', 'Unknown')} | Peer Name: {peer.get('name', 'Unknown')}")
        else:
            print(f"{Fore.YELLOW}Group '{group_name}' has no peers or invalid peer data.")
    return formatted_json


def create_group():
    url = config.create_group_url()

    # Fetch existing groups
    try:
        existing_groups = list_groups()
        existing_group_names = {group["name"] for group in existing_groups}
    except Exception as e:
        print(f"{Fore.RED}Error: Could not fetch existing groups. {e}")
        return

    # Load new groups to create
    try:
        with open("create_groups.json", "r") as file:
            groups_to_create = json.load(file)
    except FileNotFoundError:
        print(f"{Fore.RED}Error: The file 'create_groups.json' was not found.")
        return
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'create_groups.json'.")
        return

    # Create new groups
    for group in groups_to_create:
        group_name = group.get("name", "Unknown Group")
        if group_name in existing_group_names:
            print(f"{Fore.YELLOW}Group '{group_name}' already exists. Skipping creation.")
            continue

        try:
            response = requests.post(url, json=group, headers=headers)
            if response.status_code == 201:
                print(f"{Fore.GREEN}Group '{group_name}' created successfully.")
            else:
                print(f"{Fore.RED}Failed to create Group '{group_name}'. Status: {response.status_code}")
                print(f"Response: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error creating group '{group_name}': {e}")


# Acl Policies
def list_acl_policies():
    url = config.list_policies_url()

    for retries in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            formatted_json = response.json()
            break
        except Timeout:
            print(f"{Fore.YELLOW}Timeout while fetching ACL policies. Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error fetching ACL policies: {e}")
            return
    else:
        print(f"{Fore.RED}Failed to fetch ACL policies after {max_retries} retries.")
        return

    print(f"{Fore.GREEN}ACL Policies:")
    for policy in formatted_json:
        policy_name = policy.get("name", "Unnamed Policy")
        rules = policy.get("rules", [])
        print(f"Policy Name: {policy_name}")
        print(f"Rules:")
        for rule in rules:
            print(json.dumps(rule, indent=4))


def create_acl_policies():
    url = config.create_acl_policies()
    list_policies_url = config.list_policies_url()

    # Fetch existing policies
    existing_policy_names = set()
    for retries in range(max_retries):
        try:
            response = requests.get(url=list_policies_url, headers=headers, timeout=timeout)
            response.raise_for_status()
            existing_policies = response.json()
            existing_policy_names = {policy["name"] for policy in existing_policies}
            break
        except Timeout:
            print(f"{Fore.YELLOW}Timeout while fetching existing policies. Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error fetching existing policies: {e}")
            return
    else:
        print(f"{Fore.RED}Failed to fetch existing policies after {max_retries} retries.")
        return

    # Load new policies from the JSON file
    try:
        with open("acl_policies_rule.json", "r") as acl_file:
            policies = json.load(acl_file)
    except FileNotFoundError:
        print(f"{Fore.RED}Error: The file 'acl_policies_rule.json' was not found.")
        return
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'acl_policies_rule.json'.")
        return

    # Create new policies
    for policy in policies:
        policy_name = policy.get("name", "Unknown Policy")
        if policy_name in existing_policy_names:
            print(f"{Fore.YELLOW}Policy '{policy_name}' already exists. Skipping creation.")
            continue

        try:
            response = requests.post(url=url, json=policy, headers=headers)
            response.raise_for_status()
            created_policy = response.json()
            print(f"{Fore.GREEN}Policy '{created_policy.get('name')}' created successfully.")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error creating policy '{policy_name}': {e}")


def update_acl_policies():
    list_acl_policies_url = config.list_policies_url()

    # Fetch existing ACL policies
    try:
        response = requests.get(url=list_acl_policies_url, headers=headers, timeout=timeout)
        response.raise_for_status()
        existing_policies = response.json()
        acl_policies_info = {policy["id"]: policy for policy in existing_policies}
        acl_policy_options = list(acl_policies_info.items())
    except Timeout:
        print(f"{Fore.YELLOW}Timeout while fetching ACL policies.")
        return
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error fetching ACL policies: {e}")
        return
    except ValueError:
        print(f"{Fore.RED}Error: Unable to parse JSON from the response.")
        return

    # Display ACL policies
    print(f"{Fore.GREEN}\nExisting ACL Policies:")
    for idx, (policy_id, policy) in enumerate(acl_policy_options, start=1):
        print(f"{idx}. ID: {policy_id}, Name: {policy['name']}, "
              f"Description: {policy.get('description', 'No description')}")

    # Allow user to select a policy
    try:
        choice = int(input("\nEnter the number corresponding to the ACL Policy you want to update: ")) - 1
        if choice < 0 or choice >= len(acl_policy_options):
            print(f"{Fore.RED}Error: Invalid selection.")
            return
        acl_policy_id, selected_policy = acl_policy_options[choice]
    except ValueError:
        print(f"{Fore.RED}Error: Please enter a valid number.")
        return

    # Load update payload from JSON file
    try:
        with open("acl_policies_rule.json", "r") as update_file:
            update_payload = json.load(update_file)

        # Match the selected policy with the payload by 'name'
        matching_payload = next(
            (policy for policy in update_payload if policy["name"] == selected_policy["name"]),
            None
        )

        if not matching_payload:
            print(f"{Fore.RED}Error: No matching payload found for ACL Policy '{selected_policy['name']}'.")
            return

        # Send update request
        update_url = f"{config.create_acl_policies()}/{acl_policy_id}"
        response = requests.put(url=update_url, json=matching_payload, headers=headers)
        if response.status_code in [200, 204]:  # 204: No Content
            print(f"{Fore.GREEN}Success: ACL Policy '{selected_policy['name']}' updated successfully.")
        else:
            print(f"{Fore.RED}Error: Failed to update ACL Policy '{selected_policy['name']}'.")
            print(f"Status code: {response.status_code}, Response: {response.text}")
    except FileNotFoundError:
        print(f"{Fore.RED}\nError: The file 'acl_policies_rule.json' was not found.")
    except json.JSONDecodeError:
        print(f"{Fore.RED}\nError: Invalid JSON format in 'acl_policies_rule.json'.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}\nError: Failed to send update request. {e}")


# Posture Checks
def list_posture_checks():
    url = config.list_posture_checks_url()

    try:
        response = requests.get(url=url, headers=headers, timeout=timeout)
        response.raise_for_status()
        posture_checks = response.json()

        print("\nExisting Posture Checks:")
        for check in posture_checks:
            print(
                f"- ID: {check['id']}, Name: {check['name']}, Description: {check.get('description', 'No description')}")

    except requests.exceptions.Timeout:
        print(f"{Fore.YELLOW}Timeout while fetching posture checks.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error fetching posture checks: {e}")
    except ValueError:
        print(f"{Fore.RED}Error: Unable to parse JSON from the response.")


def create_posture_checks():
    url = config.create_posture_checks_url()

    # Fetch existing posture checks
    existing_names = set()
    for retries in range(max_retries):
        try:
            response = requests.get(url=config.list_posture_checks_url(), headers=headers, timeout=timeout)
            response.raise_for_status()
            existing_checks = response.json()
            existing_names = {check["name"] for check in existing_checks}
            break
        except requests.exceptions.Timeout:
            print(f"{Fore.YELLOW}Timeout fetching existing posture checks. Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error fetching existing posture checks: {e}")
            return
    else:
        print(f"{Fore.RED}Failed to fetch existing posture checks after {max_retries} retries.")
        return

    # Load posture checks from the JSON file
    try:
        with open("create_posture_checks.json", "r") as file:
            posture_checks = json.load(file)

        for posture_check in posture_checks:
            check_name = posture_check.get("name", "Unnamed")
            if check_name in existing_names:
                print(f"{Fore.YELLOW}Posture Check '{check_name}' already exists. Skipping.")
                continue

            # Create posture check
            response = requests.post(url=url, headers=headers, json=posture_check)
            if response.status_code in [200, 201]:
                print(f"{Fore.GREEN}Posture Check '{check_name}' created successfully.")
            else:
                print(f"{Fore.RED}Failed to create Posture Check '{check_name}'. Response: {response.text}")

    except FileNotFoundError:
        print(f"{Fore.RED}Error: 'create_posture_checks.json' file not found.")
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'create_posture_checks.json'.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error sending request: {e}")


def update_posture_checks():
    list_url = config.list_posture_checks_url()

    # Fetch existing posture checks
    try:
        response = requests.get(url=list_url, headers=headers, timeout=timeout)
        response.raise_for_status()
        existing_checks = response.json()
        posture_checks_info = {check["id"]: check for check in existing_checks}

        # Display options
        print("\nExisting Posture Checks:")
        posture_check_options = list(posture_checks_info.items())
        for idx, (posture_check_id, posture_check) in enumerate(posture_check_options, start=1):
            print(f"{idx}. ID: {posture_check_id}, Name: {posture_check['name']}, "
                  f"Description: {posture_check.get('description', 'No description')}")

    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error fetching existing posture checks: {e}")
        return

    # User selection
    try:
        choice = int(input("\nEnter the number corresponding to the Posture Check you want to update: ")) - 1
        if choice < 0 or choice >= len(posture_check_options):
            print(f"{Fore.RED}Invalid selection.")
            return
        posture_check_id, selected_check = posture_check_options[choice]
    except ValueError:
        print(f"{Fore.RED}Please enter a valid number.")
        return

    # Load update payload
    try:
        with open("create_posture_checks.json", "r") as file:
            update_payload = json.load(file)

        matching_payload = next(
            (check for check in update_payload if check["name"] == selected_check["name"]),
            None
        )

        if not matching_payload:
            print(f"{Fore.RED}No matching payload found for Posture Check '{selected_check['name']}'.")
            return

        # Update request
        update_url = f"{config.update_posture_checks_url()}/{posture_check_id}"
        response = requests.put(url=update_url, headers=headers, json=matching_payload)
        if response.status_code in [200, 204]:
            print(f"{Fore.GREEN}Posture Check '{selected_check['name']}' updated successfully.")
        else:
            print(f"{Fore.RED}Failed to update Posture Check '{selected_check['name']}'. Response: {response.text}")

    except FileNotFoundError:
        print(f"{Fore.RED}Error: 'create_posture_checks.json' file not found.")
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'create_posture_checks.json'.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error sending update request: {e}")


# Name Servers
def list_nameservers():
    url = config.list_name_server_url()

    try:
        response = requests.get(url=url, headers=headers, timeout=timeout)
        response.raise_for_status()
        nameservers = response.json()

        print("\nExisting Name Servers:")
        for nameserver in nameservers:
            print(f"- Name: {nameserver['name']} {'*' * 5} Associated Domains: {', '.join(nameserver['domains'])}")

    except requests.exceptions.Timeout:
        print(f"{Fore.YELLOW}Timeout while fetching name servers.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error fetching name servers: {e}")
    except ValueError:
        print(f"{Fore.RED}Error: Unable to parse JSON from the response.")


def create_nameserver():
    url = config.create_name_server_url()

    # Fetch existing NameServers
    existing_nameservers = set()
    for retries in range(max_retries):
        try:
            response = requests.get(url=config.list_name_server_url(), headers=headers, timeout=timeout)
            response.raise_for_status()
            existing_nameservers_data = response.json()
            existing_nameservers = {nameserver["name"] for nameserver in existing_nameservers_data}
            break
        except requests.exceptions.Timeout:
            print(f"{Fore.YELLOW}Timeout fetching existing name servers. Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error fetching existing name servers: {e}")
            return
    else:
        print(f"{Fore.RED}Failed to fetch existing name servers after {max_retries} retries.")
        return

    # Load name servers from the JSON file
    try:
        with open("create_dns_group.json", "r") as file:
            dns_group = json.load(file)

        for dns_name in dns_group:
            dns_group_name = dns_name.get("name", "Unnamed")
            if dns_group_name in existing_nameservers:
                print(f"{Fore.YELLOW}Name Server '{dns_group_name}' already exists. Skipping.")
                continue

            # Create name server
            response = requests.post(url=url, headers=headers, json=dns_name)
            if response.status_code in [200, 201]:
                print(f"{Fore.GREEN}Name Server '{dns_group_name}' created successfully.")
            else:
                print(f"{Fore.RED}Failed to create Name Server '{dns_group_name}'. Response: {response.text}")

    except FileNotFoundError:
        print(f"{Fore.RED}Error: 'create_dns_group.json' file not found.")
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'create_dns_group.json'.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error sending request: {e}")


def update_dns_group():
    """
    Update an existing DNS group using data from a JSON file.
    """
    list_url = config.list_name_server_url()

    # Fetch existing DNS groups
    try:
        response = requests.get(url=list_url, headers=headers, timeout=timeout)
        response.raise_for_status()
        existing_dns_groups = response.json()
        dns_groups_info = {dns_group["id"]: dns_group for dns_group in existing_dns_groups}

        # Display existing DNS groups with numbered options
        print("\nExisting DNS Groups:")
        dns_group_options = list(dns_groups_info.items())
        for idx, (dns_group_id, dns_group) in enumerate(dns_group_options, start=1):
            print(f"{idx}. ID: {dns_group_id}, Name: {dns_group['name']}, "
                  f"Description: {dns_group.get('description', 'No description')}")

    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error fetching existing DNS groups: {e}")
        return

    # User selection
    try:
        choice = int(input("\nEnter the number corresponding to the DNS Group you want to update: ")) - 1
        if choice < 0 or choice >= len(dns_group_options):
            print(f"{Fore.RED}Invalid selection.")
            return
        dns_group_id, selected_dns_group_info = dns_group_options[choice]
    except ValueError:
        print(f"{Fore.RED}Please enter a valid number.")
        return

    # Load update payload
    try:
        with open("create_dns_group.json", "r") as file:
            update_payload = json.load(file)

        matching_payload = next(
            (group for group in update_payload if group["name"] == selected_dns_group_info["name"]),
            None
        )

        if not matching_payload:
            print(f"{Fore.RED}No matching payload found for DNS Group '{selected_dns_group_info['name']}'.")
            return

        # Update request
        update_url = f"{config.list_name_server_url()}/{dns_group_id}"
        response = requests.put(url=update_url, headers=headers, json=matching_payload)
        if response.status_code in [200, 204]:
            print(f"{Fore.GREEN}DNS Group '{selected_dns_group_info['name']}' updated successfully.")
        else:
            print(
                f"{Fore.RED}Failed to update DNS Group '{selected_dns_group_info['name']}'. Response: {response.text}")

    except FileNotFoundError:
        print(f"{Fore.RED}Error: 'create_dns_group.json' file not found.")
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'create_dns_group.json'.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error sending update request: {e}")


# Routes
def list_routes():
    url = config.list_routes()

    try:
        response = requests.get(url=url, headers=headers, timeout=timeout)
        response.raise_for_status()
        routes = response.json()

        print("\nExisting Network Routes:")
        for route in routes:
            print(
                f"Route Network ID: {route['network_id']} {'*' * 5} ID: {route['id']} {'*' * 5} Network: {route['network']}")

    except requests.exceptions.Timeout:
        print(f"{Fore.YELLOW}Timeout while fetching network routes.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error fetching network routes: {e}")
    except ValueError:
        print(f"{Fore.RED}Error: Unable to parse JSON from the response.")


def create_network_routes():
    """
    Create new network routes from a JSON file, avoiding duplication.
    """
    url = config.create_route_url()

    # Fetch existing network routes
    existing_routes = set()
    for retries in range(max_retries):
        try:
            response = requests.get(url=config.list_routes(), headers=headers, timeout=timeout)
            response.raise_for_status()
            existing_routes_data = response.json()
            existing_routes = {route["network_id"] for route in existing_routes_data}
            break
        except requests.exceptions.Timeout:
            print(f"{Fore.YELLOW}Timeout fetching existing network routes. Retry {retries + 1}/{max_retries}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error fetching existing network routes: {e}")
            return
    else:
        print(f"{Fore.RED}Failed to fetch existing network routes after {max_retries} retries.")
        return

    # Load new routes from JSON file
    try:
        with open("create_routes.json", "r") as file:
            new_routes = json.load(file)

        for route in new_routes:
            route_name = route.get("network_id", "Unnamed Route")
            if route_name in existing_routes:
                print(f"{Fore.YELLOW}Network route '{route_name}' already exists. Skipping creation.")
                continue

            # Create the network route
            response = requests.post(url=url, headers=headers, json=route)
            if response.status_code in [200, 201]:
                print(f"{Fore.GREEN}Network route '{route_name}' created successfully.")
            else:
                print(f"{Fore.RED}Failed to create network route '{route_name}'. Response: {response.text}")

    except FileNotFoundError:
        print(f"{Fore.RED}Error: 'create_routes.json' file not found.")
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'create_routes.json'.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error sending request: {e}")


def update_network_routes():
    """
    Update an existing network route using data from a JSON file.
    """
    list_url = config.list_routes()

    # Fetch existing network routes
    try:
        response = requests.get(url=list_url, headers=headers, timeout=timeout)
        response.raise_for_status()
        existing_routes = response.json()
        route_info = {route["id"]: route for route in existing_routes}

        # Display existing routes with numbered options
        print("\nExisting Network Routes:")
        route_options = list(route_info.items())
        for idx, (route_id, route) in enumerate(route_options, start=1):
            print(f"{idx}. ID: {route_id}, Network: {route['network']}, Network ID: {route['network_id']}, "
                  f"Description: {route.get('description', 'No description')}")

    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error fetching existing network routes: {e}")
        return

    # User selection
    try:
        choice = int(input("\nEnter the number corresponding to the Network Route you want to update: ")) - 1
        if choice < 0 or choice >= len(route_options):
            print(f"{Fore.RED}Invalid selection.")
            return
        route_id, selected_route_info = route_options[choice]
    except ValueError:
        print(f"{Fore.RED}Please enter a valid number.")
        return

    # Load update payload
    try:
        with open("create_routes.json", "r") as file:
            update_payload = json.load(file)

        matching_payload = next(
            (route for route in update_payload if route["network_id"] == selected_route_info["network_id"]),
            None
        )

        if not matching_payload:
            print(f"{Fore.RED}No matching payload found for Network ID '{selected_route_info['network_id']}'.")
            return

        # Update request
        update_url = f"{config.list_routes()}/{route_id}"
        response = requests.put(url=update_url, headers=headers, json=matching_payload)
        if response.status_code in [200, 204]:
            print(f"{Fore.GREEN}Network Route '{route_id}' updated successfully.")
        else:
            print(f"{Fore.RED}Failed to update Network Route '{route_id}'. Response: {response.text}")

    except FileNotFoundError:
        print(f"{Fore.RED}Error: 'create_routes.json' file not found.")
    except json.JSONDecodeError:
        print(f"{Fore.RED}Error: Invalid JSON format in 'create_routes.json'.")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Error sending update request: {e}")


# List API Events
# full list of tracked events:-  https://docs.netbird.io/how-to/monitor-system-and-network-activity
def list_api_events():
    url = config.list_events()

    try:
        response = requests.get(url=url, headers=headers)
        if response.status_code == 200:
            formatted_json = response.json()

            print(Fore.CYAN + Style.BRIGHT + "\nAPI Events Log:")
            for event in formatted_json:
                activity = Fore.YELLOW + event["activity"]
                initiator_email = Fore.GREEN + event["initiator_email"]
                initiator_id = Fore.BLUE + event["initiator_id"]

                print(f"Activity: {activity}, Performed by: {initiator_email} ({initiator_id})")
        else:
            print(Fore.RED + f"Failed to fetch events. Status Code: {response.status_code}, Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(Fore.RED + f"Error: Failed to fetch API events. {e}")


def display_menu(title, options, is_submenu=False):
    """
    Displays a dynamic menu based on provided options.
    :param title: The title of the menu
    :param options: A dictionary of menu options
    :param is_submenu: If True, shows 'Back 🔙' instead of 'Exit 🚪'
    """
    print(f"\n{Style.BRIGHT}{Fore.YELLOW}=== {title} ===")
    for key, description in options.items():
        print(f"{Fore.WHITE}{key}. {Fore.LIGHTBLUE_EX}{description}")
    print(f"{Fore.WHITE}h. {Fore.YELLOW}Help (Show Menu) 📋")
    if is_submenu:
        print(f"{Fore.WHITE}0. {Fore.LIGHTGREEN_EX}Back 🔙")
    else:
        print(f"{Fore.WHITE}0. {Fore.RED}Exit 🚪")


def handle_main_menu():
    """
    Handles the main menu and navigates to submenus based on user choice.
    """
    main_options = {
        "1": "List Options 📋",
        "2": "Create Options 🛠️",
        "3": "Update Options 🔄",
        "4": "Delete Options 🗑️",
    }

    while True:
        display_menu("Netbird Management System", main_options)
        choice = input(f"\n{Fore.CYAN}Enter your choice: ").strip().lower()

        if choice == "0":
            print(f"\n{Fore.YELLOW}Exiting... Goodbye 👋! Thanks for using Netbird 🕊️🐦")
            break
        elif choice == "h":
            continue
        elif choice == "1":
            handle_list_menu()
        elif choice == "2":
            handle_create_menu()
        elif choice == "3":
            handle_update_menu()
        elif choice == "4":
            handle_delete_menu()
        else:
            print(f"{Fore.RED}❗ Invalid input. Please select a valid option.")


def handle_list_menu():
    """
    Handles the submenu for listing options.
    """
    list_options = {
        "1": "List Accounts 🗂️",
        "2": "List Users 👥",
        "3": "List Setup Keys 🔑",
        "4": "List Groups 👥",
        "5": "List Peers 🔗",
        "6": "List Acl Policies 📜",
        "7": "List Posture Checks 🛡️",
        "8": "List NameServers 🌐",
        "9": "List Routes 🔀",
        "10": "List Events ➕📅",
    }

    while True:
        display_menu("List Options", list_options, is_submenu=True)
        choice = input(f"\n{Fore.CYAN}Enter your choice: ").strip().lower()

        if choice == "0":
            break
        elif choice == "h":
            continue
        elif choice == "1":
            list_accounts()
        elif choice == "2":
            list_users()
        elif choice == "3":
            list_setup_keys()
        elif choice == "4":
            list_groups()
        elif choice == "5":
            list_peers()
        elif choice == "6":
            list_acl_policies()
        elif choice == "7":
            list_posture_checks()
        elif choice == "8":
            list_nameservers()
        elif choice == "9":
            list_routes()
        elif choice == "10":
            list_api_events()
        else:
            print(f"{Fore.RED}❗ Invalid choice. Please try again.")


def handle_create_menu():
    """
    Handles the submenu for creating options.
    """
    create_options = {
        "1": "Create Setup Keys ➕🔑",
        "2": "Create Acl Policies ➕📜",
        "3": "Create Posture Checks ➕🛡️",
        "4": "Create NameServer ➕🌐",
        "5": "Create Network Routes ➕🔀",
        "6": "Create Groups ➕👥",
    }

    while True:
        display_menu("Create Options", create_options, is_submenu=True)
        choice = input(f"\n{Fore.CYAN}Enter your choice: ").strip().lower()

        if choice == "0":  # Back to the previous menu
            break
        elif choice == "h":  # Redisplay the menu
            continue
        elif choice == "1":
            create_setup_keys()
        elif choice == "2":
            create_acl_policies()
        elif choice == "3":
            create_posture_checks()
        elif choice == "4":
            create_nameserver()
        elif choice == "5":
            create_network_routes()
        elif choice == "6":
            create_group()
        else:
            print(f"{Fore.RED}❗ Invalid choice. Please try again.")


def handle_update_menu():
    """
    Handles the submenu for updating options.
    """
    update_options = {
        "1": "Update Posture Checks 🛡️",
        "2": "Update NameServer Groups 🌐",
        "3": "Update Network Routes 🔀",
        "4": "Update Acl Policies 📜",
    }

    while True:
        display_menu("Update Options", update_options, is_submenu=True)
        choice = input(f"\n{Fore.CYAN}Enter your choice: ").strip().lower()

        if choice == "0":  # Back to the previous menu
            break
        elif choice == "h":  # Redisplay the menu
            continue
        elif choice == "1":
            update_posture_checks()
        elif choice == "2":
            update_dns_group()
        elif choice == "3":
            update_network_routes()
        elif choice == "4":
            update_acl_policies()
        else:
            print(f"{Fore.RED}❗ Invalid choice. Please try again.")


def handle_delete_menu():
    """
    Handles the submenu for deleting options.
    """
    delete_options = {
        "1": "Delete Expired Setup Keys ❌🔑",
    }

    while True:
        display_menu("Delete Options", delete_options, is_submenu=True)
        choice = input(f"\n{Fore.CYAN}Enter your choice: ").strip().lower()

        if choice == "0":  # Back to the previous menu
            break
        elif choice == "h":  # Redisplay the menu
            continue
        elif choice == "1":
            print(f"\n{Fore.RED}--- Deleting Expired Setup Keys ❌🔑 ---")
            expired_keys = list_setup_keys()
            if expired_keys:
                delete_setup_keys(expired_keys)
            else:
                print(f"\n{Fore.YELLOW}No expired keys found.")
        else:
            print(f"{Fore.RED}❗ Invalid choice. Please try again.")


# Functions for create, update, delete can be defined similarly

if __name__ == "__main__":
    handle_main_menu()
