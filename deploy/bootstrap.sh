#!/usr/bin/env bash
# One-time server setup. Run as root on the VPS:
#   bash bootstrap.sh
#
# Creates an unprivileged deploy user, the release directory layout, and the
# systemd unit. Safe to re-run; it does not touch an existing .env or releases.
set -euo pipefail

APP_ROOT=/srv/devexcode
DEPLOY_USER=deploy

echo "==> deploy user"
id -u "$DEPLOY_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /bin/bash "$DEPLOY_USER"

echo "==> directory layout"
mkdir -p "$APP_ROOT"/{releases,shared}
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_ROOT"

echo "==> authorized_keys for CI"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown "$DEPLOY_USER":"$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"
echo "    -> append the CI public key to /home/$DEPLOY_USER/.ssh/authorized_keys"

echo "==> env file"
if [[ ! -f "$APP_ROOT/shared/.env" ]]; then
  touch "$APP_ROOT/shared/.env"
  chmod 600 "$APP_ROOT/shared/.env"
  chown "$DEPLOY_USER":"$DEPLOY_USER" "$APP_ROOT/shared/.env"
  echo "    -> created empty $APP_ROOT/shared/.env (populate it before first start)"
else
  echo "    -> $APP_ROOT/shared/.env already exists, left untouched"
fi

echo "==> systemd unit"
cp "$(dirname "$0")/devexcode.service" /etc/systemd/system/devexcode.service
systemctl daemon-reload
systemctl enable devexcode

echo "==> allow the deploy user to restart only this service"
cat > /etc/sudoers.d/devexcode <<SUDO
$DEPLOY_USER ALL=(root) NOPASSWD: /bin/systemctl restart devexcode, /bin/systemctl status devexcode, /bin/systemctl is-active devexcode
SUDO
chmod 440 /etc/sudoers.d/devexcode

echo
echo "Done. Remaining manual steps:"
echo "  1. Append the CI public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "  2. Populate $APP_ROOT/shared/.env (MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL, ...)"
echo "  3. Point nginx at 127.0.0.1:3000"
echo "  4. Disable root SSH login and password auth in /etc/ssh/sshd_config"
