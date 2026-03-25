import type { Plugin } from "@opencode-ai/plugin"

/**
 * Agent Plugins for AWS - OpenCode Plugin
 *
 * This plugin bundles AWS agent skills and MCP servers for OpenCode.
 * It provides comprehensive AWS development capabilities including:
 * - Deploy on AWS with cost estimation
 * - AWS Amplify full-stack development
 * - AWS serverless services (Lambda, API Gateway, etc.)
 * - Database guidance for Aurora DSQL
 * - GCP to AWS migration
 * - Amazon Location Service integration
 */
export const AgentPluginsForAWS: Plugin = async ({ client, directory }) => {
  await client.app.log({
    body: {
      service: "agent-plugins-for-aws",
      level: "info",
      message: "AWS Agent Plugins loaded successfully",
      extra: {
        skills: 9,
        mcpServers: 6,
        directory,
      },
    },
  })

  return {
    /**
     * Log plugin initialization
     */
    "session.created": async (input, output) => {
      // Plugin is ready to provide skills and MCP support
    },

    /**
     * Provide status information when requested
     */
    "tui.prompt.append": async (input, output) => {
      // Skills are automatically discovered via .opencode/skills/
      // MCP servers are configured in opencode.json
      // No additional setup needed
    },
  }
}

export default AgentPluginsForAWS
