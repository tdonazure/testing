# database-azure-service
Private API Service for Intellicloud Console

### General Project Structure
```
- api               # Application code for the API. Unit tests are side-by-side with application code.
- infrastructure    # CloudFormation and Swagger files for deploying the API to AWS
- node_modules      # project-level dependencies such as tslint
- tests             # API tests to be executed via HTTP against the deployed API
```

#### Build and Test
Build the project with the following commands:
```
npm run install      # npm install in the project root directory is required
cd {project_root}/api
npm install
npm run build        # builds the application
npm run build:spec   # builds the unit tests
npm run test         # executes the unit tests with coverage stats
```

#### Run the API Locally
The database-azure-service api runs on localhost port 8170 and 8171. Use these commands to fire it up. These are long running processes, so it's best to run each one in a separate terminal shell.
```
cd {project_root}/api
npm run server:db    # Starts up dynamodb-local on port 8171
npm run server:api   # Starts up serverless-webpack on port 8170
```

You can then hit the API endpoints in a browser, Postman, wget, or curl via http://localhost:8170/{endpoint_path}

#### Execute the API Tests against the local API environment
The API Test suite is designed to be executed against the deployed "test" environment by default. While developing tests, you can execute them against your locally running API instance. You must first kick off the server:db and server:api commands described above. Then you can execute the API tests with these commands:
```
cd {project_root}/tests/api
npm install
npm run test:local
```
