import core from '@actions/core'
import {
  CodeDeployClient,
  ListDeploymentsCommand,
  StopDeploymentCommand,
} from '@aws-sdk/client-codedeploy'

export default async function run(): Promise<void> {
  core.debug('Fetching active developments')

  const region = core.getInput('region', {required: true})
  const codeDeployApp = core.getInput('codedeploy-application', {
    required: true,
  })
  const codeDeployGroup = core.getInput('codedeploy-deployment-group', {
    required: true,
  })
  const autoRollbackEnabled =
    core.getInput('codedeploy-auto-rollback-enabled') === 'true'

  const client = new CodeDeployClient({
    region,
    customUserAgent: 'aws-cancel-deployment-action',
  })

  const listDeployments = new ListDeploymentsCommand({
    applicationName: codeDeployApp,
    deploymentGroupName: codeDeployGroup,
  })

  const {deployments} = await client.send(listDeployments)
  if (!deployments) {
    core.info('No active deployments')
    return
  }

  core.debug(`Deployments:\n${JSON.stringify(deployments)}`)
  for (const deploymentId of deployments) {
    const cancelDeployment = new StopDeploymentCommand({
      deploymentId,
      autoRollbackEnabled,
    })

    // eslint-disable-next-line no-await-in-loop
    const response = await client.send(cancelDeployment)
    core.debug(`Response:\n${JSON.stringify(response)}`)
  }

  core.info(`Cancelled ${deployments.length} deployments`)
}
