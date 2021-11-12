# Amazon ECS "Cancel active deployments" Action for GitHub Actions

```yml
  - name: Cancel active deployments
    uses: imbox/aws-cancel-deployment-action@master
    with:
      aws-region: 'eu-west-1'
      application-name:
      deployment-group-name:
      auto-rollback-enabled: 'true' / 'false'
```
