# TecTic Bd – Cloud Worker Deployment Guide (Persistent Linux VPS)

This guide provides complete instructions for deploying the **TecTic Bd Automation Worker** onto a persistent Cloud VPS (Virtual Private Server).

---

## 1. Why Serverless / Cloud Functions Cannot Run Persistent Facebook Workers

| Feature | Serverless (Firebase Functions / AWS Lambda) | Persistent Cloud VPS (Ubuntu / Debian) |
|---|---|---|
| **Session Persistence** | ❌ Ephemeral containers wipe disk on shutdown. Facebook cookies are lost. | ✅ Dedicated disk partition (`/var/lib/tecticbd/profile`) keeps cookies permanently. |
| **IP Address Stability** | ❌ IP rotates randomly among multi-tenant cloud ranges, triggering Facebook bot bans. | ✅ Static dedicated IPv4 address prevents checkpoint triggers. |
| **Execution Time** | ❌ Hard timeouts (typically 60s – 540s max). | ✅ Runs 24/7 indefinitely across multi-hour staggered campaigns. |
| **Security & Privacy** | ❌ Risk of exposing cookies across shared serverless logs or environment variables. | ✅ Sandboxed on your private server. No passwords or cookies stored in public Firestore. |

---

## 2. Recommended Cloud VPS Providers

### Option A: Oracle Cloud Always Free (Recommended — $0 / Forever)
- **Specs**: Ampere A1 Compute (ARM), up to 4 OCPUs and 24 GB RAM forever free.
- **Location**: Singapore, Japan, Frankfurt, or US West.
- **Website**: [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)

### Option B: Hetzner Cloud (~€3.79 / month)
- **Specs**: CX22 (2 vCPU, 4 GB RAM, 40 GB NVMe, 20 TB traffic).
- **Location**: Nuremberg, Falkenstein, or Helsinki.
- **Website**: [https://www.hetzner.com/cloud](https://www.hetzner.com/cloud)

### Option C: DigitalOcean Droplet ($4 - $6 / month)
- **Specs**: 1 vCPU, 1 GB RAM, 25 GB SSD.
- **Website**: [https://www.digitalocean.com](https://www.digitalocean.com)

---

## 3. Ubuntu / Debian VPS Step-by-Step Setup

### Step 1: Connect to your VPS via SSH
```bash
ssh root@your_vps_ip
```

### Step 2: Install Node.js (v20 LTS) & Chrome
```bash
# Update packages
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git xvfb

# Install Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install -y ./google-chrome-stable_current_amd64.deb
```

### Step 3: Deploy Worker Files
```bash
# Create worker directory
mkdir -p /opt/tecticbd-worker
mkdir -p /var/lib/tecticbd/profile

# Copy worker.js and package.json into /opt/tecticbd-worker
cd /opt/tecticbd-worker
npm install
```

### Step 4: Configure Systemd Background Service
Create the service configuration file:
```bash
cat << 'EOF' > /etc/systemd/system/tecticbd-worker.service
[Unit]
Description=TecTic Bd Automation Worker
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/tecticbd-worker
ExecStart=/usr/bin/node /opt/tecticbd-worker/worker.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=WORKER_PORT=4892
Environment=WORKER_PROFILE_DIR=/var/lib/tecticbd/profile

[Install]
WantedBy=multi-user.target
EOF
```

### Step 5: Start & Enable the Service
```bash
# Reload systemd
systemctl daemon-reload

# Enable service to start on every server reboot
systemctl enable --now tecticbd-worker

# Check service status
systemctl status tecticbd-worker
```

### Step 6: Verify Heartbeat
From your local computer or inside the TecTic Bd Web App:
```bash
curl http://your_vps_ip:4892/health
```
You will receive:
```json
{
  "status": "online",
  "mode": "cloud_vps",
  "profileDir": "/var/lib/tecticbd/profile",
  "stats": { "completed": 0, "failed": 0, "skipped": 0 }
}
```

In the TecTic Bd Web App, go to **Automation Workers** tab, select **Cloud VPS Worker**, and the dashboard will connect to your persistent instance.
