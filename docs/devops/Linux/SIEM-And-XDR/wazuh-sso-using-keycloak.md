---
title: Wazuh SSO with Keyclock
layout: default
parent: Wazuh
grand_parent: Linux Projects
nav_order: 7
permalink: /docs/devops/Linux/SIEM-And-XDR/wazuh-sso-using-keycloak/
description: Documentation for Installing the Wazuh SSO with Keyclock.
---


# Setup single sign-on with administrator role with Keycloak

[Keycloak](https://www.keycloak.org/) is an open source identity and access management tool. It provides user federation, strong authentication, user management, and fine-grained authorization for modern applications and services. In this guide, we integrate the KeyCloak IdP to authenticate users into the Wazuh platform.

There are three stages in the single sign-on integration:
1) KeyCloak configuration

2) Wazuh indexer configuration

3) Wazuh dashboard configuration

## 1. KeyCloak configuration

## 1.1 Create a new realm.

* Log in to the Keycloak admin console.
* Expand the master drop-down menu and click Add Realm. 
* Input a name in the Realm name field; this is named `Wazuh`. Click on Create to apply this configuration.

![wazuh-realm](../images/wazuh-realm.png)

## 1.2 Create a new client.

> In the newly created realm, navigate to `Clients` > `Create Client` and modify the following parameters:

   * `Client type:` select `SAML` from the drop-down menu.

   * `Client ID:` input `wazuh-saml`. This is the SP (service provider) Entity ID value which will be used later in the `config.yml` on the Wazuh indexer instance.

> You can leave the rest of the values as default. Click Save to apply the configuration.

![keycloak-wazuh-client](../images/keycloak-wazuh-client.png)

## 1.3 Configure client settings.

### 1.3.1 Navigate to Clients > Settings and ensure the Enabled button is turned on.
* Complete the section with these parameters:

```yaml
Client ID: wazuh-saml

Name: Wazuh SSO

Valid redirect URIs: https://<WAZUH_DASHBOARD_URL>/*

IDP-Initiated SSO URL name: wazuh-dashboard

Name ID format: username

Force POST binding: ON

Include AuthnStatement: ON

Sign documents: ON

Sign assertions: ON

Signature algorithm: RSA_SHA256

SAML signature key name: KEY_ID

Canonicalization method: EXCLUSIVE

Front channel logout: ON
```

> Replace the `<WAZUH_DASHBOARD_URL>` field with the corresponding URL of your Wazuh dashboard instance.

![client1](../images/client1.png)

![client2](../images/client2.png)

![client3](../images/client3.png)

### NOTE
> You can leave the rest of the values as default. Click Save to apply the configuration.

### 1.3.2 **Navigate to** `Clients > Keys` and set the following parameter:

   - **Client signature required:** `Off`
![client4](../images/client4.png)


### 1.3.3 Navigate to `Clients > Advanced > Fine Grain SAML Endpoint Configuration` and complete the section with these parameters:
   * Assertion Consumer Service POST Binding URL:
   `https://<WAZUH_DASHBOARD_URL>/_opendistro/_security/saml/acs/idpinitiated`
     
   * Logout Service Redirect Binding URL: `https://<WAZUH_DASHBOARD_URL>`

![keycloak-advance](../images/keycloak-advance.png)

> You can leave the rest of the values as default. Click `Save to apply` the configuration.


### 1.3.4 Create a new role. Navigate to `Realm roles > Create role` and complete the section with these parameters:
   * Role name: `admin`.
    ## NOTE: This will be our backend role in the Wazuh indexer configuration.

### 1.3.5 Create a new user.
   * Navigate to `Users > Add user` and fill in the required information.


### 1.3.6 Set user creds
   * Navigate to `Users > Credentials > Set password` and input a password for the newly created user. **You will use these credentials to log in to the Wazuh dashboard.**


### 1.3.7 Create a new group and assign the user.
   * Go to `Groups > Create group` and assign a name to the group. In our case, this is `Wazuh-admins`.

![group](../images/group.png)


### 1.3.8 Add members to group
   * Click on the newly created group, navigate to `Members > Add member` and select the user created in the previous step. Click on Add to `add` it to the group.


### 1.3.9 Role mapping
   * In the newly created group details, go to `Role Mapping > Assign role` and select the `admin role` created above. Click on Assign to apply the configuration.


### 1.3.10 Configure protocol mapper.
   * Navigate to `Client scopes > role_list > Mappers > Configure a new mapper`.
   * Select `Role list` from the list as seen below:
   ![mapper](../images/mapper.png)

**Fill in the Mapper Configuration:**
```yaml
Mapper type: Role list

Name: wazuhRoleKey. You can use any name here.

Role attribute name: Roles. This will be the roles_key on the Wazuh indexer configuration.

SAML Attribute NameFormat: Basic

Single Role Attribute: On
```

### 1.3.11 Note the necessary parameters from the SAML settings of Keycloak.
> The parameters already obtained during the integration are:

* sp.entity_id: wazuh-saml
* roles_key: Roles
* kibana_url: https://<WAZUH_DASHBOARD_URL>

> To obtain the remaining parameters.

- Navigate to `Clients` and select the name of your client. In our case, this is `wazuh-saml`.
- Navigate to `Action > Download adapter config`, and ensure the Format option is `Mod Auth Mellon files`.
- Click on `Download` to download the remaining files.

![download-adaptor-config](../images/download-adaptor-config.png)

> The downloaded files contain the `idp.metadata.xml` file and the `sp.metadata.xml` file.
> The `idp.entityID` parameter is in the `idp.metadata.xml` file.

![keycloak idp metadata](../images/metadata.png)


## Keycloak configuration is done now. Now we are moving to **Wazuh indexer configuration**.

## 2. Wazuh indexer configuration

> Edit the Wazuh indexer security configuration files. We recommend that you back up these files before you carry out the configuration.

### 2.1 Generate a 64-character long random key using the following command.
```shell
openssl rand -hex 32
```
#### The output will be used as the **exchange_key** in the **/etc/wazuh-indexer/opensearch-security/config.yml** file.


### 2.2 copy keycloak idp.metadata.xml and sp.metadata.xml into wazuh indexer
> Place the `idp.metadata.xml` and `sp.metadata.xml` files within the `/etc/wazuh-indexer/opensearch-security/` directory. And Set the file ownership to wazuh-indexer using the following command:

```shell
# In latest keycloak these files are named as idp-metadata.xml & sp-metadata.xml
# Make sure to rename the file from idp-metadata.xml to idp.metadata.xml & sp-metadata.xml to sp.metadata.xml
chown wazuh-indexer:wazuh-indexer /etc/wazuh-indexer/opensearch-security/idp.metadata.xml
chown wazuh-indexer:wazuh-indexer /etc/wazuh-indexer/opensearch-security/sp.metadata.xml
```

### 2.3 Edit the **/etc/wazuh-indexer/opensearch-security/config.yml** file and change the following values:

* Set the order in `basic_internal_auth_domain` to `0`, and set the `challenge` flag to `false`.

* Include a `saml_auth_domain` configuration under the `authc` section similar to the following:

```yaml
saml_auth_domain:
   http_enabled: true
   transport_enabled: false
   order: 1
   http_authenticator:
   type: saml
   challenge: true
   config:
      idp:
         metadata_file: '/etc/wazuh-indexer/opensearch-security/idp.metadata.xml'
         entity_id: 'https://keycloak.dev.linuxforall.in/realms/wazuh'
      sp:
         entity_id: wazuh-saml
         metadata_file: '/etc/wazuh-indexer/opensearch-security/sp.metadata.xml'
      kibana_url: https://13.212.5.81
      roles_key: Roles
      exchange_key: '9ba6ddb59cb366cd7f7a6cad344989da2b163f64d1c22ae04e7903886ad74ea7'
   authentication_backend:
   type: noop
```
### Example snippet:
![indexer-config-file](../images/indexer-config-file.png)


## Ensure to change the following parameters to their corresponding value:

```shell
* idp.metadata_file

* idp.entity_id

* sp.entity_id

* sp.metadata_file

* kibana_url

* roles_key

* exchange_key
```

## 2.4 Run the securityadmin script to load the configuration changes made in the config.yml file.
```shell
# The -h flag specifies the hostname or the IP address of the Wazuh indexer node. Note that this command uses 127.0.0.1, set your Wazuh indexer address if necessary.

export JAVA_HOME=/usr/share/wazuh-indexer/jdk/ && bash /usr/share/wazuh-indexer/plugins/opensearch-security/tools/securityadmin.sh -f /etc/wazuh-indexer/opensearch-security/config.yml -icl -key /etc/wazuh-indexer/certs/admin-key.pem -cert /etc/wazuh-indexer/certs/admin.pem -cacert /etc/wazuh-indexer/certs/root-ca.pem -h 127.0.0.1 -nhnv
```

> The command output must be similar to the following:

```shell
Security Admin v7
Will connect to 192.168.0.100:9200 ... done
Connected as "CN=admin,OU=Wazuh,O=Wazuh,L=California,C=US"
OpenSearch Version: 2.10.0
Contacting opensearch cluster 'opensearch' and wait for YELLOW clusterstate ...
Clustername: wazuh-cluster
Clusterstate: GREEN
Number of nodes: 1
Number of data nodes: 1
.opendistro_security index already exists, so we do not need to create one.
Populate config from /etc/wazuh-indexer/opensearch-security
Will update '/config' with /etc/wazuh-indexer/opensearch-security/config.yml
   SUCC: Configuration for 'config' created or updated
SUCC: Expected 1 config types for node {"updated_config_types":["config"],"updated_config_size":1,"message":null} is 1 (["config"]) due to: null
Done with success
```

## 2.5 Map the realm role in Keycloak to the appropriate Wazuh indexer role

* Edit the **/etc/wazuh-indexer/opensearch-security/roles_mapping.yml** file and change the following values:

* Configure the roles_mapping.yml file to map the `realm role in Keycloak (admin)` to the appropriate Wazuh indexer role; in our case, we map this to the all_access role.

```shell
all_access:
  reserved: false
  hidden: false
  backend_roles:
  - "admin"
```

## 2.6 Run the **securityadmin** script to load the configuration changes made in the `roles_mapping.yml` file.

```shell
# The -h flag specifies the hostname or the IP address of the Wazuh indexer node. Note that this command uses both 127.0.0.1, set your Wazuh indexer address if necessary.

export JAVA_HOME=/usr/share/wazuh-indexer/jdk/ && bash /usr/share/wazuh-indexer/plugins/opensearch-security/tools/securityadmin.sh -f /etc/wazuh-indexer/opensearch-security/roles_mapping.yml -icl -key /etc/wazuh-indexer/certs/admin-key.pem -cert /etc/wazuh-indexer/certs/admin.pem -cacert /etc/wazuh-indexer/certs/root-ca.pem -h 192.168.0.100 -nhnv
```

> The command output must be similar to the following:

```shell
Security Admin v7
Will connect to 192.168.0.100:9200 ... done
Connected as "CN=admin,OU=Wazuh,O=Wazuh,L=California,C=US"
OpenSearch Version: 2.10.0
Contacting opensearch cluster 'opensearch' and wait for YELLOW clusterstate ...
Clustername: wazuh-cluster
Clusterstate: GREEN
Number of nodes: 1
Number of data nodes: 1
.opendistro_security index already exists, so we do not need to create one.
Populate config from /etc/wazuh-indexer/opensearch-security
Will update '/rolesmapping' with /etc/wazuh-indexer/opensearch-security/roles_mapping.yml
   SUCC: Configuration for 'rolesmapping' created or updated
SUCC: Expected 1 config types for node {"updated_config_types":["rolesmapping"],"updated_config_size":1,"message":null} is 1 (["rolesmapping"]) due to: null
Done with success
```

## 3 Wazuh dashboard configuration

## 3.1 Check the value of `run_as` in the `/usr/share/wazuh-dashboard/data/wazuh/config/wazuh.yml` configuration file. If `run_as` is set to `false`, proceed to the next step.

```shell
hosts:
  - default:
      url: https://192.168.0.100
      port: 55000
      username: wazuh-wui
      password: "<wazuh-wui-password>"
      run_as: false
```

> If `run_as` is set to `true`, you need to add a role mapping on the Wazuh dashboard. To map the backend role to Wazuh, follow these steps:

```shell
Click ☰ to open the menu on the Wazuh dashboard, go to Server management > Security, and then Roles mapping to open the page.

Click Create Role mapping and complete the empty fields with the following parameters:

* Role mapping name: Assign a name to the role mapping.

* Roles: Select `administrator`.

* Custom rules: Click Add new rule to expand this field.

* User field: `backend_roles`

* Search operation: `FIND`

* Value: Assign the value of the realm role in Keycloak configuration. In our case, this is `admin`.
```

![create-new-role-mapping](../images/create-new-role-mapping.png)

## 3.2 Wazuh dashboard configuration

> Edit the Wazuh dashboard configuration file. Add these configurations to /etc/wazuh-dashboard/opensearch_dashboards.yml. We recommend that you back up these files before you carry out the configuration.

```shell
opensearch_security.auth.type: "saml"
server.xsrf.allowlist: ["/_opendistro/_security/saml/acs", "/_opendistro/_security/saml/logout", "/_opendistro/_security/saml/acs/idpinitiated"]
opensearch_security.session.keepalive: false
```

## 3.3 Restart the Wazuh dashboard service using this command:
```shell
systemctl restart wazuh-dashboard
```

## Test the configuration. Go to your **Wazuh dashboard URL** and log in with your **Keycloak account**.


## Referance
[keycloak sso](https://documentation.wazuh.com/current/user-manual/user-administration/single-sign-on/administrator/keycloak.html)