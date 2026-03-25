/**
 * Agent Plugins for AWS - OpenCode Integration
 *
 * This package provides AWS agent skills and MCP servers for OpenCode development.
 *
 * Available Skills:
 * - deploy: Deploy applications to AWS
 * - amazon-location-service: Maps and geospatial features
 * - amplify-workflow: Full-stack app development
 * - api-gateway: REST/HTTP/WebSocket APIs
 * - aws-lambda: Serverless applications
 * - aws-lambda-durable-functions: Long-running workflows
 * - aws-serverless-deployment: SAM and CDK deployment
 * - databases-on-aws: Aurora DSQL database
 * - gcp-to-aws: GCP to AWS migration
 *
 * Available MCP Servers:
 * - awsknowledge: AWS documentation and architecture
 * - awspricing: Real-time pricing
 * - awsiac: Infrastructure as Code best practices
 * - aws-mcp: AWS service integration
 * - aws-serverless-mcp: Serverless services
 * - aurora-dsql: Database operations (disabled by default)
 */

// Re-export plugins for OpenCode
export { AgentPluginsForAWS } from "./.opencode/plugins/agent-plugins-for-aws"
export { AWSSkillsLoaderPlugin } from "./.opencode/plugins/aws-skills-info"

/**
 * Configuration for OpenCode
 *
 * To use this package with OpenCode, add to your opencode.json:
 *
 * ```json
 * {
 *   "plugin": ["@awslabs/agent-plugins-for-aws"]
 * }
 * ```
 *
 * Or for a local repository:
 *
 * ```json
 * {
 *   "plugin": ["file:///path/to/agent-plugins"]
 * }
 * ```
 *
 * Or from GitHub:
 *
 * ```json
 * {
 *   "plugin": ["git+https://github.com/pengcheng1898/agent-plugins.git"]
 * }
 * ```
 */

export const DEFAULT_CONFIG = {
  version: "1.1.0",
  plugins: [
    ".opencode/plugins/agent-plugins-for-aws.ts",
    ".opencode/plugins/aws-skills-info.ts",
  ],
  skills: [
    "deploy",
    "amazon-location-service",
    "amplify-workflow",
    "api-gateway",
    "aws-lambda",
    "aws-lambda-durable-functions",
    "aws-serverless-deployment",
    "dsql",
    "gcp-to-aws",
  ],
  mcpServers: [
    "awsknowledge",
    "awspricing",
    "awsiac",
    "aws-mcp",
    "aws-serverless-mcp",
    "aurora-dsql",
  ],
}

export default DEFAULT_CONFIG
