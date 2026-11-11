import { tmpdir } from 'node:os'
import { join } from 'node:path'

// The repo lives in Dropbox on /mnt/c: inotify doesn't fire there, and Dropbox
// locks freshly written dirs so Vite's dep-cache rename fails inside the repo.
export default {
  cacheDir: join(tmpdir(), 'vite-vibe-coding-handout'),
  server: { watch: { usePolling: true, interval: 300 } },
}
