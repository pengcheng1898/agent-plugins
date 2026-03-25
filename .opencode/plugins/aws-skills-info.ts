import type { Plugin, tool } from "@opencode-ai/plugin"

/**
 * AWS Skills Loader Plugin for OpenCode
 *
 * This plugin provides AWS-specific features for agent-plugins-for-aws:
 * - Skill loading status
 * - MCP server management
 * - AWS service recommendations
 */
export const AWSSkillsLoaderPlugin: Plugin = async ({ client, $, directory }) => {
  // Log initialization
  await client.app.log({
    body: {
      service: "aws-skills-loader",
      level: "info",
      message: "AWS Skills Loader initialized",
      extra: {
        pluginsDirectory: directory,
      },
    },
  })

  return {
    /**
     * Custom tool to get AWS skills info
     */
    tool: {
      "aws-skills-info": tool({
        description:
          "Get information about available AWS agent skills and their purpose",
        args: {
          skill: tool.schema
            .string()
            .optional()
            .describe(
              'Optional: specific skill name to get details (deploy, amplify-workflow, api-gateway, aws-lambda, aws-lambda-durable-functions, aws-serverless-deployment, dsql, gcp-to-aws, amazon-location-service)'
            ),
        },
        async execute(args) {
          const skills = {
            deploy:
              "Deploy applications to AWS with architecture recommendations and cost estimates",
            "amplify-workflow":
              "Build full-stack apps with AWS Amplify Gen 2",
            "api-gateway":
              "Build and manage REST, HTTP, and WebSocket APIs with Amazon API Gateway",
            "aws-lambda":
              "Design, build, deploy, and debug serverless applications with AWS Lambda",
            "aws-lambda-durable-functions":
              "Build resilient long-running, multi-step applications with automatic state persistence",
            "aws-serverless-deployment":
              "Deploy serverless applications using AWS SAM and AWS CDK",
            dsql: "Build applications with Aurora DSQL serverless database",
            "gcp-to-aws":
              "Migrate workloads from Google Cloud Platform to AWS",
            "amazon-location-service":
              "Add maps, geocoding, routing, and geospatial features",
          }

          if (args.skill && args.skill in skills) {
            return {
              skill: args.skill,
              description: skills[args.skill as keyof typeof skills],
              mcp: getMCPServersForSkill(args.skill),
            }
          } else if (args.skill) {
            return { error: `Unknown skill: ${args.skill}` }
          }

          return {
            message: "Available AWS Agent Skills",
            skills,
            count: Object.keys(skills).length,
            tip: "Use 'aws-skills-info' tool with a specific skill name for details",
          }
        },
      }),

      /**
       * Tool to list available MCP servers
       */
      "aws-mcp-servers": tool({
        description:
          "List available MCP servers and their configuration for AWS operations",
        args: {
          enabled: tool.schema
            .boolean()
            .optional()
            .describe("Filter by enabled status (true for enabled, false for disabled)"),
        },
        async execute(args) {
          const servers = {
            awsknowledge: {
              name: "AWS Knowledge",
              type: "remote",
              enabled: true,
              purpose: "AWS documentation and architecture guidance",
              url: "https://knowledge-mcp.global.api.aws",
            },
            awspricing: {
              name: "AWS Pricing",
              type: "local",
              enabled: true,
              purpose: "Real-time AWS service pricing for cost estimates",
              command: "uvx awslabs.aws-pricing-mcp-server@latest",
            },
            awsiac: {
              name: "AWS IaC",
              type: "local",
              enabled: true,
              purpose:
                "IaC best practices for CDK/CloudFormation/Terraform",
              command: "uvx awslabs.aws-iac-mcp-server@latest",
            },
            "aws-mcp": {
              name: "AWS MCP",
              type: "local",
              enabled: true,
              purpose: "AWS service and documentation integration",
              command:
                "uvx mcp-proxy-for-aws@latest https://aws-mcp.us-east-1.api.aws/mcp",
            },
            "aws-serverless-mcp": {
              name: "AWS Serverless MCP",
              type: "local",
              enabled: true,
              purpose: "AWS serverless services support",
              command:
                "uvx awslabs.aws-serverless-mcp-server@latest --allow-write",
            },
            "aurora-dsql": {
              name: "Aurora DSQL",
              type: "local",
              enabled: false,
              purpose: "Aurora DSQL database operations",
              command: "uvx awslabs.aurora-dsql-mcp-server@latest",
              note: "Disabled by default for security. Enable in opencode.json if needed.",
            },
          }

          let filtered = Object.values(servers)
          if (args.enabled !== undefined) {
            filtered = filtered.filter((s) => s.enabled === args.enabled)
          }

          return {
            count: filtered.length,
            servers: filtered,
            total: Object.keys(servers).length,
          }
        },
      }),
    },

    /**
     * Log when skills are used
     */
    "message.updated": async (input, output) => {
      // Monitor skill usage if needed
    },
  }
}

/**
 * Helper function to determine which MCP servers a skill uses
 */
function getMCPServersForSkill(
  skillName: string
): string[] {
  const skillMCPMap: Record<string, string[]> = {
    deploy: ["awsknowledge", "awspricing", "awsiac"],
    "amplify-workflow": ["aws-mcp"],
    "api-gateway": ["awsknowledge"],
    "aws-lambda": ["awsknowledge"],
    "aws-lambda-durable-functions": ["awsknowledge"],
    "aws-serverless-deployment": ["awsknowledge", "awsiac"],
    dsql: ["awsknowledge", "aurora-dsql"],
    "gcp-to-aws": ["awsknowledge", "awspricing"],
    "amazon-location-service": ["aws-mcp"],
  }

  return skillMCPMap[skillName] || []
}

export default AWSSkillsLoaderPlugin
