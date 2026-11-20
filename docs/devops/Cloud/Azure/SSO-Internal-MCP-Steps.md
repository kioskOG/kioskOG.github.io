---
title: "Step-by-Step: Entra ID Setup for an Internal MCP Server"
layout: doc-page
parent: "Company SSO for an Internal MCP Server: Entra ID App Roles, Security Groups and Claude Connectors"
parent_url: /docs/devops/Cloud/Azure/SSO-Internal-MCP/
grand_parent: Azure
grand_parent_url: /docs/devops/Cloud/Azure/
nav_order: 1
author: Jatin Sharma
permalink: /docs/devops/Cloud/Azure/SSO-Internal-MCP-Steps/
description: Click-by-click Entra admin center runbook for putting an internal MCP server behind company SSO with app roles, security groups and assignment required.
type: concept
tags:
  - Azure
  - Entra ID
  - MCP
  - SSO
timestamp: '2026-11-20T09:35:00Z'
---

# Step-by-Step Entra ID Setup for an Internal MCP Server

This is the click-by-click runbook for the setup described in the parent post, done in the Microsoft Entra admin center (entra.microsoft.com). It uses the same generic names: tenant *Contoso*, server `https://mcp.dev.contoso.com/mcp`, and the data domains Finance, Billing, Payments and Shared. Do the steps in order, because later steps depend on IDs created earlier.

---

## 0. Before you start

**Admin roles you'll need** (or Global Administrator):
- **Application Administrator** or **Cloud Application Administrator**: app registration, enterprise app and admin consent
- **Groups Administrator** or **User Administrator**: security groups
- **Conditional Access Administrator**: CA policies

**Check first:**
- **Verified domain.** `contoso.com` must show as *Verified* under **Identity > Settings > Domain names**. Entra won't accept an `https://` Application ID URI (step 3) on a domain the tenant hasn't verified. Subdomains like `mcp.dev.contoso.com` are covered once the parent is verified.
- **Licence.** Under **Identity > Overview**, the licence should be **Entra ID P1 or P2**. Without it you can't assign groups to roles in step 6, only individual users.

---

## Step 1: Create the app registration
1. Go to **Identity > Applications > App registrations > + New registration**.
2. Fill in:
   - **Name:** `Engineering MCP (Dev)`
   - **Supported account types:** *Accounts in this organizational directory only (Single tenant)*
   - **Redirect URI:** leave blank (you add these in step 2)
3. Click **Register**.
4. On the **Overview** page, copy the **Application (client) ID** and the **Directory (tenant) ID**. You'll hand both back in step 10.

## Step 2: Platform and redirect URIs
1. In the app, go to **Authentication > + Add a platform > Mobile and desktop applications**.
2. In **Custom redirect URIs**, add:
   - `https://claude.ai/api/mcp/auth_callback`
3. Click **Configure**. Then under the same platform, click **Add URI** and add:
   - `http://localhost/callback`
4. Click **Save**.
5. Leave **Allow public client flows** set to **No**. Auth code with PKCE doesn't need it; it's only for device-code and password flows.
6. Add `127.0.0.1` through the manifest, because the portal won't accept it:
   - Go to **Manifest**. Use the default Microsoft Graph format, not the "AAD Graph" tab.
   - Find `"publicClient"` and make it look like this:
     ```json
     "publicClient": {
       "redirectUris": [
         "https://claude.ai/api/mcp/auth_callback",
         "http://localhost/callback",
         "http://127.0.0.1/callback"
       ]
     },
     ```
   - Click **Save**.
7. Check that **Authentication** now lists all three URIs under *Mobile and desktop applications*, and that **Web** and **Single-page application** have none.

> **If saving the `https` URI fails** because of tenant policy, fall back to a client secret instead. Put the three URIs under the **Web** platform. Then go to **Certificates & secrets > + New client secret** and create one that expires in 12 months. Give the secret value only to the Claude org Owner, by a secure channel. It must never go in a ticket or chat.

## Step 3: Expose an API
1. Go to **Expose an API**. Next to **Application ID URI**, click **Add** and accept the default `api://<client-id>`, then click **Save**.
2. Add the second URI through the manifest. Find `"identifierUris"` and set it to:
   ```json
   "identifierUris": [
     "api://<client-id>",
     "https://mcp.dev.contoso.com/mcp"
   ],
   ```
   Make sure there's **no trailing slash**, then click **Save**. If this fails with a domain error, go back to the verified-domain check in step 0.
3. Back in **Expose an API**, click **+ Add a scope** and fill in:
   - **Scope name:** `mcp.access`
   - **Who can consent:** *Admins only*
   - **Admin consent display name:** `Access Engineering MCP`
   - **Admin consent description:** `Allows Claude to call the Engineering MCP service as the signed-in user.`
   - **State:** Enabled
   
   Then click **Add scope**.
4. Go to **Manifest** again. Under `"api"`, set:
   ```json
   "api": {
     "requestedAccessTokenVersion": 2,
     ...
   }
   ```
   Then click **Save**.

## Step 4: Create the five app roles
1. Go to **App roles > + Create app role**. Create each of these five roles the same way:

   | Display name | Allowed member types | Value | Description |
   |---|---|---|---|
   | MCP Finance Read | Users/Groups | `mcp.finance.read` | Read finance index |
   | MCP Billing Read | Users/Groups | `mcp.billing.read` | Read billing index |
   | MCP Payments Read | Users/Groups | `mcp.payments.read` | Read payments index |
   | MCP Shared Read | Users/Groups | `mcp.shared.read` | Read shared index |
   | MCP Admin | Users/Groups | `mcp.admin` | MCP administration |

2. Tick **Do you want to enable this app role?** for each one, then click **Apply**.
3. The **Value** must match exactly. It's what the gateway reads from the `roles` claim.

## Step 5: Turn on "Assignment required"
1. Go to **Identity > Applications > Enterprise applications** and open `Engineering MCP (Dev)`. Entra created it automatically in step 1.
2. Go to **Properties** and set **Assignment required?** to **Yes**.
3. Optionally set **Visible to users?** to **No**, since users connect through Claude rather than My Apps.
4. Click **Save**.

## Step 6: Create the groups and assign them to roles
1. Go to **Identity > Groups > All groups > New group** and create each of these five groups:
   - **Group type:** Security
   - **Membership type:** Assigned
   - **Names:** `SG-MCP-Finance`, `SG-MCP-Billing`, `SG-MCP-Payments`, `SG-MCP-Shared`, `SG-MCP-Admin`
   - **Members:** the lists the service owner provides. Add people directly, because nested groups don't count.
2. Back in the enterprise app, go to **Users and groups > + Add user/group**. For each group:
   - **Users and groups:** select the group, e.g. `SG-MCP-Finance`
   - **Select a role:** the matching role, e.g. `MCP Finance Read`
   - Click **Assign**.
3. Repeat until all five group-and-role pairs are listed.
4. **Without P1:** at the same screen, assign individual users to their roles instead of groups.

## Step 7: Claims (make sure there's no groups claim)
1. In the app registration, go to **Token configuration**. There should be **no** "groups claim" entry; remove one if it exists.
2. In the **Manifest**, check that `"groupMembershipClaims"` is `null` or `"None"`.

Nothing else is needed here. Assigned roles appear in the `roles` claim automatically.

## Step 8: API permissions and admin consent
1. In the app registration, go to **API permissions > + Add a permission**:
   - Choose **APIs my organization uses** (or **My APIs**) > **Engineering MCP (Dev)** > **Delegated permissions**, tick `mcp.access`, and click **Add permissions**.
2. Click **+ Add a permission** again:
   - Choose **Microsoft Graph > Delegated permissions** and tick `openid`, `profile`, `email` and `offline_access`, then click **Add permissions**.
   - `User.Read` is added by default. You can remove it, since this setup doesn't need it.
3. Click **Grant admin consent for <tenant>** and confirm.
4. Every row should now show a green **Granted for <tenant>** status.

## Step 9: Conditional Access
1. **MFA.** Go to **Protection > Conditional Access > Policies**. Open your standard MFA policy and check that it covers this app: either **All cloud apps**, or add `Engineering MCP (Dev)` under *Target resources*.
2. **Named locations.** Only needed if any policy that applies to this app restricts by location:
   - Go to **Conditional Access > Named locations > + IP ranges location**.
   - **Name:** `Anthropic Claude token refresh`
   - **Ranges:** `160.79.104.0/21` and `153.61.208.0/20`
   - Tick **Mark as trusted location** if your policies rely on trusted locations, then click **Create**.
   - In the location-based policy, include this location in its allowed or trusted set, or exclude it from the block condition, so it applies to `Engineering MCP (Dev)`.
3. **Token lifetimes.** Leave them at the defaults. Add a **Sign-in frequency** session control only if you want users forced to sign in daily.

## Step 10: Hand back
Send this to the team that runs the MCP gateway. It contains **no secrets**:

```
Tenant ID:        <Directory (tenant) ID>
Client ID:        <Application (client) ID>
App ID URIs:      api://<client-id>, https://mcp.dev.contoso.com/mcp
Scope:            mcp.access
Roles:            mcp.finance.read, mcp.billing.read, mcp.payments.read, mcp.shared.read, mcp.admin
Groups:           SG-MCP-Finance, SG-MCP-Billing, SG-MCP-Payments, SG-MCP-Shared, SG-MCP-Admin
Assignment required: Yes
Admin consent:    Granted (mcp.access, openid, profile, email, offline_access)
Platform:         Mobile and desktop (public client, no secret)   ← or "Web + secret (given to Owner)" if fallback used
```

## Step 11: Test (MCP team)
1. **A user in a group.** Add `https://mcp.dev.contoso.com/mcp` as a connector in Claude Desktop, sign in with Microsoft and call one tool. It should succeed.
2. **A user outside every group, on a non-admin account.** They should be refused at sign-in with error **AADSTS50105**, which means the user isn't assigned to the app.
3. **Optional check:** decode a token at jwt.ms and confirm:
   - `ver` = `2.0`
   - `aud` = the client ID
   - `scp` includes `mcp.access`
   - `roles` holds the expected value
   - there's no `groups` claim
4. **Don't use a Global Admin** for the refusal test. Global Admins bypass "Assignment required", although the gateway's role check should still refuse one that has no role.

## Step 12: Claude organization admin
1. Go to **Organization settings > Connectors > Add custom connector**:
   - **Name:** `Engineering MCP (Dev)`
   - **URL:** `https://mcp.dev.contoso.com/mcp`
   - **Client ID:** leave blank. If the probe asks for one, choose **Use your own OAuth client**, enter the Entra client ID and leave the secret blank (unless the Web + secret fallback was used).
2. **Remove any older connector entry that points at a previous URL first.** Authentication settings can't be changed after a connector is added.
3. **Enterprise only:** set the connector to Always allow, Needs approval or Blocked for each role.
4. **Users:** go to **Settings > Connectors > Engineering MCP (Dev) > Connect** and sign in with Microsoft.
5. **Claude Code without the org connector:**
   ```
   claude mcp add --transport http engineering-mcp https://mcp.dev.contoso.com/mcp
   ```
   Then run `/mcp` inside Claude Code to sign in.

---

**Most likely snags:**
- The `https` Application ID URI fails if `contoso.com` isn't a verified domain.
- `127.0.0.1` can only be added through the manifest.
- Group assignment needs P1.
- Testing with a Global Admin account won't show the refusal.
