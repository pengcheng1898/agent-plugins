/**
 * AWS Skills Info Tool Plugin
 *
 * Provides custom tools for discovering and managing available AWS skills
 * and MCP servers in OpenCode environment.
 */

export const AWSSkillsLoaderPlugin = {
  name: "aws-skills-info",
  description: "AWS Skills and MCP Server Information Tool",
  version: "1.1.0",

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
        const skills: Record<string, any> = {
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

        if (input.skillName) {
          const skill = skills[input.skillName]
          if (skill) {
            return {
              skill: input.skillName,
              ...skill,
            }
          } else {
            return {
              error: `Skill '${input.skillName}' not found`,
              availableSkills: Object.keys(skills),
            }
          }
        }

        return {
          availableSkills: Object.keys(skills),
          skills: skills,
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
        const servers: Record<string, any> = {
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

        if (input.serverName) {
          const server = servers[input.serverName]
          if (server) {
            return {
              server: input.serverName,
              ...server,
            }
          } else {
            return {
              error: `MCP server '${input.serverName}' not found`,
              availableServers: Object.keys(servers),
            }
          }
        }

        return {
          availableServers: Object.keys(servers),
          servers: servers,
          description: "All available MCP servers for AWS agent plugins",
        }
      },
    },
  ],
}

export default AWSSkillsLoaderPlugin
