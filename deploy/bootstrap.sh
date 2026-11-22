#!/usr/bin/env bash
# One-time server setup. Run as root on the VPS:
#   bash bootstrap.sh "ssh-ed25519 AAAA... github-actions"
#
# The argument is optional; when given it is appended to the deploy user's
# authorized_keys.
#
# Creates an unprivileged deploy user, the release directory layout, and the
# systemd unit. Safe to re-run; it does not touch an existing .env or releases.
set -euo pipefail

# A non-interactive `ssh root@host 'bash ...'` gets a minimal PATH without
# /usr/sbin, so useradd/install/systemctl are not found. Set it explicitly
# rather than depending on the caller's login shell.
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

if [[ "$(id -u)" -ne 0 ]]; then
  echo "error: run as root" >&2
  exit 1
fi

APP_ROOT=/srv/devexcode
DEPLOY_USER=deploy

# Optional: public key to authorise for CI, passed as the first argument.
CI_PUBKEY="${1:-}"

echo "==> deploy user"
id -u "$DEPLOY_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /bin/bash "$DEPLOY_USER"

echo "==> directory layout"
mkdir -p "$APP_ROOT"/{releases,shared}
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_ROOT"

echo "==> authorized_keys for CI"
AUTH_KEYS="/home/$DEPLOY_USER/.ssh/authorized_keys"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
touch "$AUTH_KEYS"
chmod 600 "$AUTH_KEYS"
chown "$DEPLOY_USER":"$DEPLOY_USER" "$AUTH_KEYS"
if [[ -n "$CI_PUBKEY" ]]; then
  if grep -qF "$CI_PUBKEY" "$AUTH_KEYS" 2>/dev/null; then
    echo "    -> key already authorised"
  else
    printf '%s\n' "$CI_PUBKEY" >> "$AUTH_KEYS"
    echo "    -> CI key appended"
  fi
else
  echo "    -> no key passed; append the CI public key to $AUTH_KEYS"
fi

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
echo "  1. (only if no key was passed) append the CI public key to $AUTH_KEYS"
echo "  2. Populate $APP_ROOT/shared/.env (MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL, ...)"
echo "  3. Point nginx at 127.0.0.1:3000"
echo "  4. Disable root SSH login and password auth in /etc/ssh/sshd_config"
