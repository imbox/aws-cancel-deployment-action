# Amazon ECS "Cancel/Stop active deployments" Action for GitHub Actions

```yml
  - name: Cancel active deployments
    uses: imbox/aws-cancel-deployment-action@master
    with:
      aws-region: 'eu-west-1'
      application-name: 'AppECS-default-appname'
      deployment-group-name: 'DgpECS-default-appname'
      auto-rollback-enabled: 'true'
```
