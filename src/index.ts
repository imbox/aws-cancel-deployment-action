import core from '@actions/core'

import run from './action'

run().catch((error: any) => {
  if (!(error instanceof Error)) error = new Error(String(error))
  core.setFailed(error.message)
  core.debug(error.stack)
})
