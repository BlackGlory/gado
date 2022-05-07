import { createServer, Level } from '@delight-rpc/websocket'
import { Daemon } from './daemon.js'
import { IAPI } from '@src/types.js'
import { delay } from 'extra-promise'
import { calculateExponentialBackoffTimeout } from 'extra-timers'
import WebSocket from 'ws'
import ms from 'ms'
import { version } from '@utils/package.js'

export function registerInRegistry(daemon: Daemon, registry: string): void {
  register()

  function register(retries: number = 0): void {
    const socket = new WebSocket(registry)
    const close = createServer<IAPI>(daemon, socket, {
      loggerLevel: Level.None
    , version
    })
    socket.once('close', async () => {
      close()

      const timeout = calculateExponentialBackoffTimeout({
        baseTimeout: ms('10s')
      , maxTimeout: ms('60s')
      , retries
      })
      await delay(timeout)
      register(retries + 1)
    })
  }
}
