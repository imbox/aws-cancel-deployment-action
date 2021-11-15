import * as core from '@actions/core'
import {
  CodeDeployClient,
  DeploymentStatus,
  ListDeploymentsCommand,
  StopDeploymentCommand,
} from '@aws-sdk/client-codedeploy'

const handleFatal = (error: unknown) => {
  if (error instanceof Error) {
    core.setFailed(error)
    core.debug(error.stack ?? '')
    return
  }

  core.error(`Non-error exception\n:${JSON.stringify(error)}`)
}

export default async function run(): Promise<void> {
  core.debug('Fetching active developments')

  const region = core.getInput('aws-region', {required: true})
  const codeDeployApp = core.getInput('application-name', {
    required: true,
  })
  const codeDeployGroup = core.getInput('deployment-group-name', {
    required: true,
  })
  const autoRollbackEnabled = core.getInput('auto-rollback-enabled') === 'true'

  const client = new CodeDeployClient({
    region,
    customUserAgent: 'aws-cancel-deployment-action',
  })

  const listDeployments = new ListDeploymentsCommand({
    applicationName: codeDeployApp,
    deploymentGroupName: codeDeployGroup,
    includeOnlyStatuses: [DeploymentStatus.IN_PROGRESS],
  })

  const {deployments} = await client.send(listDeployments)
  if (typeof deployments === 'undefined') {
    core.debug('Unable to get deployments')
    return
  }

  if (deployments.length === 0) {
    core.info('No active deployments')
    return
  }

  core.info(`Active deployments:\n${JSON.stringify(deployments)}`)
  for (const deploymentId of deployments) {
    core.info(`Stopping deployment: ${deploymentId}`)
    const cancelDeployment = new StopDeploymentCommand({
      deploymentId,
      autoRollbackEnabled,
    })

    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await client.send(cancelDeployment)
      core.debug(`Response:\n${JSON.stringify(response)}`)
    } catch (error: unknown) {
      handleFatal(error)
      break
    }
  }

  core.info(
    `Successfully cancelled ${
      deployments.length
    } deployments: ${deployments.join(', ')}`,
  )
}
