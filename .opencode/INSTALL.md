# Installing Agent Plugins for AWS in OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- AWS CLI configured with appropriate credentials (for some skills)

## Installation

Add agent-plugins-for-aws to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["agent-plugins-for-aws@git+https://github.com/pengcheng1898/agent-plugins.git"]
}
```

Restart OpenCode. That's it — the plugin auto-installs and registers all skills and MCP servers.

Verify by asking: "Deploy my application to AWS" or "Tell me about AWS skills"

## Installation Options

### Option 1: From GitHub (Recommended)

```json
{
  "plugin": ["agent-plugins-for-aws@git+https://github.com/pengcheng1898/agent-plugins.git"]
}
```

### Option 2: From Local Repository

```json
{
  "plugin": ["file:///path/to/agent-plugins"]
}
```

### Option 3: From npm (When Published)

Once published to npm:

```json
{
  "plugin": ["@awslabs/agent-plugins-for-aws"]
}
```

## Available Skills

The plugin provides 9 AWS agent skills:

- **deploy** - Deploy applications to AWS with architecture recommendations and cost estimates
- **amazon-location-service** - Maps, geocoding, routing, and geospatial features
- **amplify-workflow** - AWS Amplify Gen 2 full-stack app development
- **api-gateway** - REST, HTTP, and WebSocket API development
- **aws-lambda** - Serverless applications with AWS Lambda
- **aws-lambda-durable-functions** - Long-running workflows with state persistence
- **aws-serverless-deployment** - SAM and CDK deployment
- **dsql** - Aurora DSQL database development
- **gcp-to-aws** - GCP to AWS migration

## Available MCP Servers

The plugin configures 6 MCP servers for real-time AWS data:

- **awsknowledge** - AWS documentation and architecture guidance
- **awspricing** - Real-time AWS service pricing
- **awsiac** - Infrastructure as Code best practices
- **aws-mcp** - AWS service integration
- **aws-serverless-mcp** - Serverless development guidance
- **aurora-dsql** - Direct database operations (disabled by default)

## Available Tools

The plugin provides 2 custom tools for discovering skills and MCP servers:

- **aws-skills-info** - Get information about available AWS skills and their MCP dependencies
- **aws-mcp-servers** - List available MCP servers and their status

## Usage

### Use Skills

Skills auto-trigger based on your intent. Simply describe your task:

```
Deploy my Node.js API to AWS
# → OpenCode suggests: deploy skill

Build a full-stack app with authentication
# → OpenCode suggests: amplify-workflow skill

Migrate our GCP infrastructure to AWS
# → OpenCode suggests: gcp-to-aws skill
```

### Use Custom Tools

```
Use the aws-skills-info tool to list all skills
Use the aws-skills-info tool with skill "deploy"
Use the aws-mcp-servers tool to check MCP server status
```

### Use OpenCode's Skill Tool

```
use skill tool to list available skills
use skill tool to load deploy
```

## Configuration

### Enable Aurora DSQL MCP Server

The Aurora DSQL MCP server is disabled by default for security. To enable it, update your `opencode.json`:

```json
{
  "mcp": {
    "aurora-dsql": {
      "enabled": true
    }
  }
}
```

### Customize MCP Servers

You can enable/disable individual MCP servers or modify their configuration:

```json
{
  "mcp": {
    "awspricing": {
      "enabled": false
    },
    "awsknowledge": {
      "enabled": true
    }
  }
}
```

## Updating

Agent Plugins for AWS updates automatically when you restart OpenCode.

To pin a specific version:

```json
{
  "plugin": ["agent-plugins-for-aws@git+https://github.com/pengcheng1898/agent-plugins.git#v1.1.0"]
}
```

## Troubleshooting

### Plugin not loading

1. Check logs: `opencode run --print-logs "hello" 2>&1 | grep -i agent-plugins`
2. Verify the plugin line in your `opencode.json`
3. Make sure you're running a recent version of OpenCode
4. Restart OpenCode completely

### Skills not found

1. Use `skill` tool to list what's discovered
2. Check that the plugin is loading (see above)
3. Verify OpenCode permissions to read plugin files

### MCP servers not responding

1. Check MCP server status: `opencode mcp list`
2. Test connectivity to required services (AWS documentation, pricing APIs, etc.)
3. Verify AWS CLI credentials are configured: `aws sts get-caller-identity`
4. Check firewall/network restrictions if using remote MCP servers

### Tool mapping

When skills reference Claude Code tools:

- `TodoWrite` → `todowrite`
- `Task` with subagents → `@mention` syntax
- `Skill` tool → OpenCode's native `skill` tool
- File operations → your native tools

## Requirements

- Node.js 14+ (for local MCP servers)
- AWS CLI configured with credentials (for AWS operations)
- uvx or uv installed (for running MCP servers via uvx)

## Getting Help

- Report issues: [https://github.com/pengcheng1898/agent-plugins/issues](https://github.com/pengcheng1898/agent-plugins/issues)
- Full documentation: [https://github.com/pengcheng1898/agent-plugins](https://github.com/pengcheng1898/agent-plugins)
- OpenCode documentation: [https://opencode.ai/docs](https://opencode.ai/docs)
- AWS documentation: [https://docs.aws.amazon.com](https://docs.aws.amazon.com)

## Support

For support or questions:

- Check the [troubleshooting guide](https://github.com/pengcheng1898/agent-plugins/blob/main/docs/TROUBLESHOOTING.md)
- Review [OpenCode documentation](https://opencode.ai/docs)
- Open an issue on GitHub

## License

This plugin is licensed under Apache License 2.0. See LICENSE file for details.
