# Installing Agent Plugins for AWS in OpenCode

This guide explains how to install and use the `@awslabs/agent-plugins-for-aws` package in OpenCode.

## Installation Methods

### Method 1: Direct Installation from GitHub

If you want to install the latest development version directly from the repository:

```bash
# In your project directory
cd /path/to/your/project

# Update your opencode.json to include the plugin
```

Edit `.opencode/opencode.json` or `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "git+https://github.com/pengcheng1898/agent-plugins.git"
  ]
}
```

Or for a local repository path:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "file:///Users/pengcheng/2026/agent-plugins/agent-plugins"
  ]
}
```

### Method 2: Installation from npm (When Published)

Once the package is published to npm, you can install it globally or per-project:

```bash
# Global installation
npm install -g @awslabs/agent-plugins-for-aws

# Per-project installation
npm install @awslabs/agent-plugins-for-aws
```

Then add to your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "@awslabs/agent-plugins-for-aws"
  ]
}
```

## After Installation

Once installed, OpenCode will automatically:

1. **Load Agent Skills** - All 9 AWS agent skills become available:
   - `deploy` - Deploy to AWS with cost estimation
   - `amplify-workflow` - Build full-stack apps
   - `api-gateway` - API management
   - `aws-lambda` - Serverless development
   - `aws-lambda-durable-functions` - Long-running workflows
   - `aws-serverless-deployment` - SAM/CDK deployment
   - `dsql` - Aurora DSQL database
   - `gcp-to-aws` - GCP migration
   - `amazon-location-service` - Maps and geospatial

2. **Enable MCP Servers** - 6 MCP servers for real-time AWS data:
   - `awsknowledge` - AWS documentation
   - `awspricing` - Pricing data
   - `awsiac` - Infrastructure as Code guidance
   - `aws-mcp` - AWS service integration
   - `aws-serverless-mcp` - Serverless services
   - `aurora-dsql` - Database operations (disabled by default)

3. **Provide Custom Tools** - Two new tools become available:
   - `aws-skills-info` - Get details about AWS skills
   - `aws-mcp-servers` - List MCP server status

## Using the Plugin

### Verify Installation

```bash
opencode
# Then in OpenCode TUI:
/skill
# Should show all 9 AWS skills
```

### Use Custom Tools

```bash
# Get info about available skills
Use the aws-skills-info tool to list all skills
# or for a specific skill:
Use the aws-skills-info tool with skill "deploy"

# Check MCP server status
Use the aws-mcp-servers tool to list MCP servers
```

### Use Agent Skills

Simply describe your task and OpenCode will suggest relevant skills:

```
I need to deploy a Node.js API to AWS
# OpenCode: I'll use the deploy skill...

Build an Amplify app with authentication
# OpenCode: I'll use the amplify-workflow skill...

Migrate our GCP infrastructure to AWS
# OpenCode: I'll use the gcp-to-aws skill...
```

## Configuration

### Enable Aurora DSQL

The Aurora DSQL MCP server is disabled by default for security. To enable it:

1. Edit your `opencode.json`
2. Find the `mcp` section
3. Change `"enabled": false` to `"enabled": true` for `aurora-dsql`
4. Restart OpenCode

```json
{
  "mcp": {
    "aurora-dsql": {
      "type": "local",
      "command": ["uvx", "awslabs.aurora-dsql-mcp-server@latest"],
      "enabled": true
    }
  }
}
```

### Customize MCP Servers

You can enable/disable MCP servers in your `opencode.json`:

```json
{
  "mcp": {
    "awspricing": {
      "enabled": false
    },
    "custom-server": {
      "type": "remote",
      "url": "https://example.com/mcp",
      "enabled": true
    }
  }
}
```

## Troubleshooting

### Skills not appearing

1. Verify OpenCode loaded the plugin:
   ```bash
   opencode
   # Check logs for plugin loading messages
   ```

2. Check that plugin directory exists:
   ```bash
   ls -la .opencode/skills/
   ```

3. Verify skill files are in place:
   ```bash
   head -5 .opencode/skills/deploy/SKILL.md
   ```

### MCP servers not responding

1. Check MCP server status:
   ```bash
   opencode mcp list
   ```

2. Test connectivity:
   ```bash
   opencode mcp debug awspricing
   ```

3. Check if server is enabled in `opencode.json`

### Plugin not loading

1. Verify `opencode.json` syntax:
   ```bash
   python3 -m json.tool opencode.json
   ```

2. Check plugin directory exists:
   ```bash
   ls -la .opencode/plugins/
   ```

3. Review OpenCode logs for errors

## Development

If you're developing this plugin:

1. **Build TypeScript**:
   ```bash
   npm run build
   ```

2. **Test locally**:
   ```bash
   cd /path/to/agent-plugins
   opencode
   ```

3. **Publish to npm**:
   ```bash
   npm publish
   ```

## Package Contents

The `@awslabs/agent-plugins-for-aws` npm package includes:

- **Skills** (9): Located in `plugins/*/skills/*/`
- **MCP Configuration**: In `opencode.json`
- **Custom Tools**: In `.opencode/plugins/`
- **Documentation**: README.md and guides

## Support

For issues or questions:

- GitHub Issues: https://github.com/pengcheng1898/agent-plugins/issues
- OpenCode Discord: https://opencode.ai/discord
- AWS Support: https://console.aws.amazon.com/support/

## License

This package is licensed under Apache License 2.0. See LICENSE file for details.
