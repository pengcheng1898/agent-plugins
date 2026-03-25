# OpenCode Support Setup Guide

This document explains how this repository supports OpenCode and how to use the agent skills directly.

## Overview

This repository contains 9 reusable agent skills that are automatically discoverable by OpenCode:

- **deploy** - Deploy applications to AWS with architecture recommendations and cost estimates
- **amazon-location-service** - Integrate maps, geocoding, routing, and geospatial features
- **amplify-workflow** - Build full-stack apps with AWS Amplify Gen 2
- **api-gateway** - Build and manage REST, HTTP, and WebSocket APIs
- **aws-lambda** - Design and deploy serverless applications with AWS Lambda
- **aws-lambda-durable-functions** - Build resilient long-running workflows
- **aws-serverless-deployment** - Deploy with SAM and CDK
- **databases-on-aws** (dsql) - Work with Aurora DSQL database
- **gcp-to-aws** - Migrate workloads from Google Cloud Platform to AWS

## Quick Start with OpenCode

1. **Navigate to the repository:**
   ```bash
   cd /path/to/agent-plugins
   opencode
   ```

2. **Access available skills:**
   When working on tasks, OpenCode will automatically suggest relevant skills based on your request. You can also explicitly load a skill using the skill tool:
   ```
   /skill
   ```
   This shows all available skills with their descriptions.

3. **Load a specific skill:**
   For example, to deploy an application:
   ```
   Let me use the deploy skill to help with AWS architecture...
   ```

## Directory Structure

Skills are organized as follows:

```
.opencode/
└── skills/
    ├── amazon-location-service/ → plugins/amazon-location-service/skills/amazon-location-service/
    ├── amplify-workflow/ → plugins/aws-amplify/skills/amplify-workflow/
    ├── api-gateway/ → plugins/aws-serverless/skills/api-gateway/
    ├── aws-lambda/ → plugins/aws-serverless/skills/aws-lambda/
    ├── aws-lambda-durable-functions/ → plugins/aws-serverless/skills/aws-lambda-durable-functions/
    ├── aws-serverless-deployment/ → plugins/aws-serverless/skills/aws-serverless-deployment/
    ├── deploy/ → plugins/deploy-on-aws/skills/deploy/
    ├── dsql/ → plugins/databases-on-aws/skills/dsql/
    └── gcp-to-aws/ → plugins/migration-to-aws/skills/gcp-to-aws/
```

Each skill symlink points to the actual skill file in the plugins directory, allowing centralized maintenance while supporting OpenCode's discovery mechanism.

## Configuration

The repository includes:

- **opencode.json** - Repository-level OpenCode configuration
- **.opencode/skills/** - Symlinked skills for direct OpenCode discovery

OpenCode automatically loads all skills from the `.opencode/skills/` directory when working in this repository.

## How Skills Work

Each skill has:

1. **SKILL.md** - The main skill file with YAML frontmatter containing:
   - `name` - Skill identifier (e.g., "deploy")
   - `description` - What the skill does and when to use it
   - `license` - License information (optional)
   - `metadata` - Additional metadata (optional)

2. **references/** - Supporting documentation that the skill can consult

When you make a request related to a skill's description, OpenCode will offer to use that skill. For example:
- "Deploy this to AWS" → suggests the deploy skill
- "Build an Amplify app" → suggests the amplify-workflow skill
- "Migrate from GCP" → suggests the gcp-to-aws skill

## Using OpenCode with Agent Plugins

Example interactions:

### Deploy an Application
```
User: I have a Node.js app I want to deploy to AWS
OpenCode: I'll use the deploy skill to help with AWS architecture recommendations and cost estimates...
```

### Build a Full-Stack App
```
User: Build a React app with authentication and a database using AWS Amplify
OpenCode: I'll use the amplify-workflow skill to guide you through building a full-stack app...
```

### Migrate from Google Cloud
```
User: We're migrating our infrastructure from Google Cloud to AWS
OpenCode: I'll use the gcp-to-aws skill to help with resource discovery and migration planning...
```

## MCP Servers

Some skills have access to MCP servers for real-time information:

- **awsknowledge** - AWS documentation and architecture guidance
- **awspricing** - Real-time AWS service pricing
- **awsiac** - IaC best practices for CDK/CloudFormation/Terraform

These are configured in the plugin's `.mcp.json` files.

## Troubleshooting

If skills don't appear in OpenCode:

1. **Verify skill files exist:**
   ```bash
   ls -la .opencode/skills/
   ```

2. **Check SKILL.md frontmatter:**
   ```bash
   head -10 .opencode/skills/deploy/SKILL.md
   ```

3. **Confirm OpenCode sees the repo:**
   ```bash
   cd /path/to/agent-plugins
   opencode
   /skill
   ```

4. **Check OpenCode configuration:**
   See `opencode.json` for plugin configuration.

## Contributing

When adding new skills:

1. Create the skill in the appropriate plugin directory: `plugins/<plugin>/skills/<skill-name>/SKILL.md`
2. Ensure SKILL.md has valid YAML frontmatter with `name` and `description`
3. Run the symlink creation script (or manually create symlink in `.opencode/skills/`)
4. Test with OpenCode: `opencode` → `/skill` → search for your skill name

For more information, see the [OpenCode skills documentation](https://opencode.ai/docs/skills).
