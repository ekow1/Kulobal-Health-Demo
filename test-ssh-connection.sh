#!/bin/bash

echo "=== SSH Connection Test Script ==="
echo "This script will help you test your SSH connection setup."
echo ""

# Check if we have the required environment variables
if [ -z "$VPS_HOST" ] || [ -z "$VPS_USERNAME" ] || [ -z "$VPS_PORT" ]; then
    echo "❌ Missing required environment variables:"
    echo "   VPS_HOST: $VPS_HOST"
    echo "   VPS_USERNAME: $VPS_USERNAME"
    echo "   VPS_PORT: $VPS_PORT"
    echo ""
    echo "Please set these variables or run this script with:"
    echo "VPS_HOST=your-host VPS_USERNAME=your-user VPS_PORT=22 ./test-ssh-connection.sh"
    exit 1
fi

echo "✅ Environment variables found:"
echo "   Host: $VPS_HOST"
echo "   Username: $VPS_USERNAME"
echo "   Port: $VPS_PORT"
echo ""

# Test basic connectivity
echo "🔍 Testing basic connectivity..."
if ping -c 1 $VPS_HOST > /dev/null 2>&1; then
    echo "✅ Host is reachable"
else
    echo "❌ Host is not reachable"
    echo "   Please check your VPS_HOST value and network connectivity"
    exit 1
fi

# Test SSH connection with verbose output
echo ""
echo "🔍 Testing SSH connection (verbose mode)..."
ssh -v -p $VPS_PORT $VPS_USERNAME@$VPS_HOST "echo 'SSH connection successful!'" 2>&1

echo ""
echo "=== Manual Verification Steps ==="
echo "1. SSH into your VPS manually:"
echo "   ssh -p $VPS_PORT $VPS_USERNAME@$VPS_HOST"
echo ""
echo "2. Check if your public key is in the authorized_keys file:"
echo "   cat ~/.ssh/authorized_keys"
echo ""
echo "3. Verify SSH service is running:"
echo "   sudo systemctl status ssh"
echo ""
echo "4. Check SSH configuration:"
echo "   sudo cat /etc/ssh/sshd_config | grep -E '(PubkeyAuthentication|PasswordAuthentication|AuthorizedKeysFile)'"
