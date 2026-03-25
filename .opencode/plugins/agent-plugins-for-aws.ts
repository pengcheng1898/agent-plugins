/**
 * Agent Plugins for AWS - OpenCode Plugin
 *
 * This plugin provides AWS agent skills and MCP server integrations for OpenCode.
 * It automatically loads all available AWS skills and configures MCP servers
 * for AWS documentation, pricing, and infrastructure as code guidance.
 *
 * Includes custom tools for discovering available skills and MCP servers.
 */

// Skills information for custom tools
const skillsInfo: Record<string, any> = {
  deploy: {
    description: "Deploy applications to AWS with architecture recommendations, cost estimates, and IaC",
    triggers: [
      "deploy to AWS",
      "host on AWS",
      "run this on AWS",
      "AWS architecture",
      "estimate AWS cost",
      "generate infrastructure",
    ],
    mcpServers: ["awsknowledge", "awspricing", "awsiac"],
  },
  "amazon-location-service": {
    description: "Add maps, geocoding, routing, and geospatial features with Amazon Location Service",
    triggers: [
      "add a map",
      "geocode an address",
      "calculate a route",
      "location-aware app",
      "Amazon Location Service",
      "geospatial",
      "places search",
    ],
    mcpServers: ["aws-mcp"],
  },
  "amplify-workflow": {
    description: "Build full-stack apps with AWS Amplify Gen 2 for React, Next.js, Vue, Angular, and more",
    triggers: [
      "build Amplify app",
      "create Amplify project",
      "add auth to Amplify",
      "deploy Amplify",
      "full-stack Amplify",
    ],
    mcpServers: ["aws-mcp"],
  },
  "api-gateway": {
    description: "Build, manage, and operate APIs with Amazon API Gateway (REST, HTTP, WebSocket)",
    triggers: [
      "API Gateway",
      "REST API",
      "HTTP API",
      "WebSocket API",
      "custom domain",
      "Lambda authorizer",
      "CORS",
    ],
    mcpServers: ["aws-mcp"],
  },
  "aws-lambda": {
    description: "Design, build, deploy, test, and debug serverless applications with AWS Lambda",
    triggers: [
      "Lambda function",
      "event source",
      "serverless application",
      "EventBridge",
      "Step Functions",
      "event-driven architecture",
    ],
    mcpServers: ["aws-mcp", "aws-serverless-mcp"],
  },
  "aws-lambda-durable-functions": {
    description: "Build resilient, long-running, multi-step applications with automatic state persistence",
    triggers: [
      "lambda durable functions",
      "workflow orchestration",
      "state machines",
      "retry/checkpoint patterns",
      "saga pattern",
      "human-in-the-loop",
    ],
    mcpServers: ["aws-serverless-mcp"],
  },
  "aws-serverless-deployment": {
    description: "Deploy serverless applications using AWS SAM and AWS CDK",
    triggers: [
      "SAM template",
      "SAM deploy",
      "CDK serverless",
      "CDK Lambda",
      "NodejsFunction",
      "serverless CI/CD",
    ],
    mcpServers: ["aws-serverless-mcp"],
  },
  dsql: {
    description: "Build with Aurora DSQL - serverless, distributed SQL database",
    triggers: [
      "Aurora DSQL",
      "DSQL schema",
      "distributed SQL",
      "serverless PostgreSQL",
      "create DSQL table",
      "migrate to DSQL",
    ],
    mcpServers: ["awsknowledge", "aurora-dsql"],
  },
  "gcp-to-aws": {
    description: "Migrate GCP infrastructure to AWS with resource discovery and architecture mapping",
    triggers: [
      "migrate GCP to AWS",
      "move from GCP",
      "GCP migration plan",
      "estimate AWS costs",
      "GCP infrastructure assessment",
    ],
    mcpServers: ["awsknowledge", "awspricing"],
  },
}

// MCP servers information for custom tools
const mcpServersInfo: Record<string, any> = {
  awsknowledge: {
    type: "remote",
    description: "AWS documentation, architecture guidance, and best practices",
    url: "https://knowledge-mcp.global.api.aws",
    enabled: true,
  },
  awspricing: {
    type: "local",
    description: "Real-time AWS service pricing for cost estimates",
    command: "uvx awslabs.aws-pricing-mcp-server@latest",
    enabled: true,
  },
  awsiac: {
    type: "local",
    description: "IaC best practices for CDK, CloudFormation, and Terraform",
    command: "uvx awslabs.aws-iac-mcp-server@latest",
    enabled: true,
  },
  "aws-mcp": {
    type: "local",
    description: "AWS documentation and service guidance",
    command: "uvx mcp-proxy-for-aws@latest",
    enabled: true,
  },
  "aws-serverless-mcp": {
    type: "local",
    description: "Serverless development guidance and project scaffolding",
    command: "uvx awslabs.aws-serverless-mcp-server@latest",
    enabled: true,
  },
  "aurora-dsql": {
    type: "local",
    description: "Direct database operations for Aurora DSQL",
    command: "uvx awslabs.aurora-dsql-mcp-server@latest",
    enabled: false,
  },
}

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

  // Custom tools for discovering skills and MCP servers
  tools: [
    {
      name: "aws-skills-info",
      description: "Get information about available AWS skills and their MCP dependencies",
      input: {
        type: "object",
        properties: {
          skillName: {
            type: "string",
            description: "Optional: Name of a specific skill to get details about",
          },
        },
      },
      handler: async (input: any) => {
        if (input.skillName) {
          const skill = skillsInfo[input.skillName]
          if (skill) {
            return {
              skill: input.skillName,
              ...skill,
            }
          } else {
            return {
              error: `Skill '${input.skillName}' not found`,
              availableSkills: Object.keys(skillsInfo),
            }
          }
        }

        return {
          availableSkills: Object.keys(skillsInfo),
          skills: skillsInfo,
          description: "All available AWS skills and their MCP server dependencies",
        }
      },
    },
    {
      name: "aws-mcp-servers",
      description: "List available MCP servers and their status",
      input: {
        type: "object",
        properties: {
          serverName: {
            type: "string",
            description: "Optional: Name of a specific MCP server to get details about",
          },
        },
      },
      handler: async (input: any) => {
        if (input.serverName) {
          const server = mcpServersInfo[input.serverName]
          if (server) {
            return {
              server: input.serverName,
              ...server,
            }
          } else {
            return {
              error: `MCP server '${input.serverName}' not found`,
              availableServers: Object.keys(mcpServersInfo),
            }
          }
        }

        return {
          availableServers: Object.keys(mcpServersInfo),
          servers: mcpServersInfo,
          description: "All available MCP servers for AWS agent plugins",
        }
      },
    },
  ],
}

export default AgentPluginsForAWS
