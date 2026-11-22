# Deployment

The site is self-hosted on a VPS behind nginx and Cloudflare. It is **not** on
Vercel — `.vercel/` and `vercel.json` are leftovers from an earlier setup and
are not used by anything here.

Before this existed there was no CI/CD at all: every release required someone to
SSH in, pull, build and restart by hand, which is why commits sat unreleased.

## How a deploy works

`.github/workflows/deploy.yml` runs on every push to `master`:

1. Installs dependencies and runs `npm run test:seo` (97 technical SEO
   assertions). A failure stops the deploy.
2. Builds on the GitHub runner, **not** on the VPS. The build peaks well above
   2GB across ~5,200 prerendered pages; running it on a small instance would
   risk the OOM killer taking out the live site.
3. `deploy/release.sh` assembles a self-contained release (~250MB) from the
   standalone output.
4. rsyncs it into `/srv/devexcode/releases/<timestamp>-<sha>/`, seeded with
   hardlinks from the current release so only changed files transfer.
5. Swaps `/srv/devexcode/current` atomically and restarts systemd.
6. Health-gates on `127.0.0.1:3000`. If the new release does not return 200
   within 60 seconds it **rolls back** to the previous one automatically.
7. Verifies the public URLs actually answer.

Releases are kept for rollback (last 5). To roll back by hand:

```bash
ln -sfn /srv/devexcode/releases/<older> /srv/devexcode/current.tmp
mv -Tf /srv/devexcode/current.tmp /srv/devexcode/current
sudo systemctl restart devexcode
```

## One-time setup

On the server, as root:

```bash
git clone <repo> /tmp/devexcode && cd /tmp/devexcode
bash deploy/bootstrap.sh
```

That creates the `deploy` user, `/srv/devexcode/{releases,shared}`, the systemd
unit, and a sudoers rule letting `deploy` restart only this one service.

Then:

1. **Generate a deploy key** (on your machine, not the server):
   ```bash
   ssh-keygen -t ed25519 -f devexcode_deploy -N "" -C "github-actions"
   ```
   Append `devexcode_deploy.pub` to `/home/deploy/.ssh/authorized_keys`.

2. **Capture the host key** for pinning:
   ```bash
   ssh-keyscan -t ed25519 <server-ip>
   ```

3. **Populate `/srv/devexcode/shared/.env`** (chmod 600, owned by `deploy`):
   ```
   MONGODB_URI=...
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=https://www.devexcode.com
   ```

4. **Add the nginx site** from `deploy/nginx.conf.example`, then
   `nginx -t && systemctl reload nginx`.

5. **Harden SSH** — set `PermitRootLogin no` and `PasswordAuthentication no`
   in `/etc/ssh/sshd_config`, then `systemctl restart sshd`.

## Required GitHub secrets

| Secret | What it is |
|---|---|
| `DEPLOY_HOST` | Server IP or hostname |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_SSH_KEY` | Private half of the deploy key (the whole file) |
| `DEPLOY_KNOWN_HOSTS` | Output of `ssh-keyscan -t ed25519 <host>` |
| `MONGODB_URI` | Build-time connection string |
| `NEXTAUTH_SECRET` | Build-time value |
| `NEXTAUTH_URL` | `https://www.devexcode.com` |

## The thing most likely to break a deploy

Next's standalone output traces JavaScript, **not data**. Several routes read
markdown and JSON from disk at request time via `process.cwd()`:

```
dailyblogsdb  dailyblogsjava  dailyblogsreact  dailyblogtips
gfgblogs      learn10         tech_battles_blogs
src/content   src/data        src/posts
```

`deploy/release.sh` copies these in explicitly. If a route starts 404ing or
rendering a placeholder after a deploy, check that list first — a new content
directory added to the repo must be added there too, or it will work locally and
silently break in production.
