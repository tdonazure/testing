String branch_name = env.BRANCH_NAME
versionNumber = "1.1"

println "Branch Name: " + branch_name
isDevelopBranch = branch_name.equals("develop")

if (isDevelopBranch){
  println "Building develop branch with deployment to development environment"
  sonar_project = "database-azure"
} else {
  println "Building feature branch without deployment"
  sonar_project = "database-azure.feature"
}



node {
  build job: 'database-azure-service-dev', parameters: [string(name: 'github_repository', value: 'https://github.com/tdslalom/database-azure-service.git'), string(name: 'github_version', value: "${versionNumber}"),string(name: 'github_branch', value: env.BRANCH_NAME),string(name: 'environment', value: 'dev' ), string(name: 'sq_project', value: sonar_project ),[$class: 'BooleanParameterValue', name: 'deploy', value: isDevelopBranch]], wait: true
}
