import * as core from '@actions/core'

import run from './action'

const handleFatal = (error: unknown) => {
  if (error instanceof Error) {
    core.setFailed(error)
    core.debug(error.stack ?? '')
    return
  }

  core.error(`Non-error exception\n:${JSON.stringify(error)}`)
}

// eslint-disable-next-line node/prefer-global/process
process.on('uncaughtException', handleFatal)
// eslint-disable-next-line node/prefer-global/process
process.on('unhandledRejection', handleFatal)

// Run action
run().catch(handleFatal)
