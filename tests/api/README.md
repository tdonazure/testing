#### When running on local
When running tests against an AWS instance you need to export your AWS creds into your environment. Use the following commands:

```
export AWS_ACCESS_KEY_ID={ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY={SECRET_ACCESS_KEY}
```

#### Build and run test
Build and run tests with the following commands:
```
npm install
npm run build
npm run tests --env={env}
```

{env} specifies which env variables to be used from config/env.config.json