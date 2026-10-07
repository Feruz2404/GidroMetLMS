import { describeDatabaseConfiguration, validateDeploymentEnvironment } from '../src/server/config/environment.js'

const validation = validateDeploymentEnvironment(process.env)
console.log(JSON.stringify({ valid: validation.valid, errors: validation.errors, ...describeDatabaseConfiguration(process.env) }))
if (!validation.valid) process.exitCode = 1
