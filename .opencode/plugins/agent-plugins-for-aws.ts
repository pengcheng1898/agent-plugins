/**
 * Agent Plugins for AWS - OpenCode Plugin
 *
 * This plugin provides AWS agent skills and MCP server integrations for OpenCode.
 * It automatically loads all available AWS skills and configures MCP servers
 * for AWS documentation, pricing, and infrastructure as code guidance.
 */

export const AgentPluginsForAWS = {
  name: "agent-plugins-for-aws",
  description: "AWS Agent Plugins - Skills and MCP servers for building on AWS",
  version: "1.1.0",

  // Skills that this plugin provides
  skills: [
    {
      name: "deploy",
      path: "../../plugins/deploy-on-aws/skills/deploy/SKILL.md",
    },
    {
      name: "amazon-location-service",
      path: "../../plugins/amazon-location-service/skills/amazon-location-service/SKILL.md",
    },
    {
      name: "amplify-workflow",
      path: "../../plugins/aws-amplify/skills/amplify-workflow/SKILL.md",
    },
    {
      name: "api-gateway",
      path: "../../plugins/aws-serverless/skills/api-gateway/SKILL.md",
    },
    {
      name: "aws-lambda",
      path: "../../plugins/aws-serverless/skills/aws-lambda/SKILL.md",
    },
    {
      name: "aws-lambda-durable-functions",
      path: "../../plugins/aws-serverless/skills/aws-lambda-durable-functions/SKILL.md",
    },
    {
      name: "aws-serverless-deployment",
      path: "../../plugins/aws-serverless/skills/aws-serverless-deployment/SKILL.md",
    },
    {
      name: "dsql",
      path: "../../plugins/databases-on-aws/skills/dsql/SKILL.md",
    },
    {
      name: "gcp-to-aws",
      path: "../../plugins/migration-to-aws/skills/gcp-to-aws/SKILL.md",
    },
  ],

  // MCP servers configuration
  mcpServers: {
    awsknowledge: {
      type: "remote",
      url: "https://knowledge-mcp.global.api.aws",
      enabled: true,
    },
    awspricing: {
      type: "local",
      command: ["uvx", "awslabs.aws-pricing-mcp-server@latest"],
      enabled: true,
      timeout: 120000,
      environment: {
        FASTMCP_LOG_LEVEL: "ERROR",
      },
    },
    awsiac: {
      type: "local",
      command: ["uvx", "awslabs.aws-iac-mcp-server@latest"],
      enabled: true,
      timeout: 120000,
      environment: {
        FASTMCP_LOG_LEVEL: "ERROR",
      },
    },
    "aws-mcp": {
      type: "local",
      command: ["uvx", "mcp-proxy-for-aws@latest", "https://aws-mcp.us-east-1.api.aws/mcp"],
      enabled: true,
      timeout: 120000,
      environment: {
        FASTMCP_LOG_LEVEL: "ERROR",
      },
    },
    "aws-serverless-mcp": {
      type: "local",
      command: ["uvx", "awslabs.aws-serverless-mcp-server@latest", "--allow-write"],
      enabled: true,
      timeout: 120000,
      environment: {
        FASTMCP_LOG_LEVEL: "ERROR",
      },
    },
    "aurora-dsql": {
      type: "local",
      command: ["uvx", "awslabs.aurora-dsql-mcp-server@latest"],
      enabled: false,
      timeout: 120000,
      environment: {
        FASTMCP_LOG_LEVEL: "ERROR",
      },
    },
  },

  // Plugin configuration
  config: {
    version: "1.1.0",
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
  },

  // Hooks for automation and validation
  hooks: {
    // SAM template validation hook
    "sam-template": {
      trigger: "After edits to `template.yaml`/`template.yml`",
      action: "Runs `sam validate` and reports errors inline",
      enabled: true,
    },
    // Schema verification hook for DSQL
    "schema-verification": {
      trigger: "After `transact` operations in DSQL",
      action: "Prompts verification of schema changes and affected rows",
      enabled: true,
    },
  },
}

export default AgentPluginsForAWS
