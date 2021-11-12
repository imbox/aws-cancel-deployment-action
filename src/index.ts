import process from 'node:process'
import core from '@actions/core'

import run from './action'

const handleFatal = (error: unknown) => {
  if (error instanceof Error) {
    core.setFailed(error.message)
    core.debug(error.stack ?? '')
    return
  }

  core.error(`Non-error exception\n:${JSON.stringify(error)}`)
}

process.on('uncaughtException', handleFatal)
process.on('unhandledRejection', handleFatal)
run().catch(handleFatal)
