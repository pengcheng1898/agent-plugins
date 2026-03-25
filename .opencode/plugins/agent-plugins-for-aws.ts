/**
 * Agent Plugins for AWS - OpenCode Plugin
 *
 * This plugin provides AWS agent skills and MCP server integrations for OpenCode.
 * Auto-registers all AWS skills and MCP servers via config hook (no manual setup needed).
 * Injects plugin context via system prompt transform for agent awareness.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import type { Plugin } from '@opencode-ai/plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Normalize a path: trim whitespace, expand ~, resolve to absolute
const normalizePath = (p: string | undefined, homeDir: string): string | null => {
  if (!p || typeof p !== 'string') return null;
  let normalized = p.trim();
  if (!normalized) return null;
  if (normalized.startsWith('~/')) {
    normalized = path.join(homeDir, normalized.slice(2));
  } else if (normalized === '~') {
    normalized = homeDir;
  }
  return path.resolve(normalized);
};

// Discover all skill directories in the plugins folder
const discoverSkills = (pluginsDir: string): string[] => {
  const skillPaths: string[] = [];
  
  if (!fs.existsSync(pluginsDir)) {
    return skillPaths;
  }

  try {
    const plugins = fs.readdirSync(pluginsDir);
    
    for (const plugin of plugins) {
      const pluginPath = path.join(pluginsDir, plugin);
      const pluginSkillsDir = path.join(pluginPath, 'skills');
      
      if (fs.existsSync(pluginSkillsDir) && fs.statSync(pluginPath).isDirectory()) {
        const skills = fs.readdirSync(pluginSkillsDir);
        
        for (const skill of skills) {
          const skillPath = path.join(pluginSkillsDir, skill);
          if (fs.statSync(skillPath).isDirectory()) {
            skillPaths.push(skillPath);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error discovering skills:', error);
  }
  
  return skillPaths;
};

// Discover and merge all MCP server configurations from plugin .mcp.json files
const discoverMcpServers = (pluginsDir: string): Record<string, any> => {
  const mergedServers: Record<string, any> = {};
  
  if (!fs.existsSync(pluginsDir)) {
    return mergedServers;
  }

  try {
    const plugins = fs.readdirSync(pluginsDir);
    
    for (const plugin of plugins) {
      const pluginPath = path.join(pluginsDir, plugin);
      const mcpConfigPath = path.join(pluginPath, '.mcp.json');
      
      if (fs.existsSync(mcpConfigPath) && fs.statSync(pluginPath).isDirectory()) {
        try {
          const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf-8'));
          
          if (mcpConfig.mcpServers) {
            // Merge servers, with later plugins potentially overriding earlier ones
            for (const [serverName, serverConfig] of Object.entries(mcpConfig.mcpServers)) {
              if (!mergedServers[serverName]) {
                mergedServers[serverName] = serverConfig;
              }
            }
          }
        } catch (error) {
          console.error(`Error reading .mcp.json for plugin ${plugin}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error discovering MCP servers:', error);
  }
  
  return mergedServers;
};

// Generate bootstrap content with plugin context
const getBootstrapContent = (pluginsDir: string, configDir: string): string => {
  const skills = discoverSkills(pluginsDir);
  const mcpServers = discoverMcpServers(pluginsDir);
  
  const skillsList = skills.map(s => {
    const parts = s.split(path.sep);
    const skillName = parts[parts.length - 1];
    const pluginName = parts[parts.length - 3];
    return `  - ${skillName} (${pluginName})`;
  }).join('\n');

  const mcpServersList = Object.keys(mcpServers)
    .map(name => {
      const config = mcpServers[name];
      const status = config.disabled ? ' (disabled)' : '';
      return `  - **${name}**${status}`;
    })
    .join('\n');

  return `<IMPORTANT_CONTEXT>
# Agent Plugins for AWS

You have access to AWS agent plugins that extend your capabilities with specialized skills and MCP servers.

## Available AWS Skills

The following skills are automatically available - OpenCode will match user intent to skill descriptions:

${skillsList}

**Skills location:** \`${configDir}/plugins/agent-plugins-for-aws\`

Use OpenCode's native \`skill\` tool to list and load skills as needed.

## MCP Servers

The following MCP servers are automatically configured from plugins:

${mcpServersList}

These servers provide:
- **awsknowledge**: AWS documentation, architecture guidance, best practices
- **awspricing**: Real-time AWS service pricing for cost estimates
- **awsiac**: IaC best practices (CDK, CloudFormation, Terraform)
- **aws-mcp**: AWS documentation and service guidance
- **aws-serverless-mcp**: Serverless development guidance and scaffolding
- **aurora-dsql**: Direct Aurora DSQL database operations (disabled by default)

## Key Workflow Principles

1. **Auto-trigger**: Skills activate based on user intent, not slash commands
2. **Cost awareness**: Always estimate and display costs before deployment
3. **User confirmation**: Never deploy without explicit user approval
4. **Best practices**: Follow AWS Well-Architected Framework
5. **Default to dev**: Use development sizing unless user specifies production

## Service Selection Defaults

- Web frameworks → Fargate + ALB (not Lambda - cold starts break WSGI)
- Static sites/SPAs → Amplify Hosting (not S3+CloudFront - simpler)
- Databases → Aurora Serverless v2 (scales to near-zero in dev)
- IaC → CDK TypeScript (most expressive, best IDE support)

</IMPORTANT_CONTEXT>`;
};

export const AgentPluginsForAWS: Plugin = async ({ directory }) => {
  const homeDir = os.homedir();
  const pluginsDir = path.resolve(__dirname, '../../plugins');
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir);
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode');

  return {
    // Inject all AWS skill paths and MCP servers into live config
    // Skills: Auto-discovered from plugins/*/skills/* directories
    // MCP Servers: Merged from all plugins/*/.mcp.json files
    config: async (config: any) => {
      // Initialize skills configuration
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      
      // Add all discovered skill paths
      const skillPaths = discoverSkills(pluginsDir);
      
      for (const skillPath of skillPaths) {
        if (!config.skills.paths.includes(skillPath)) {
          config.skills.paths.push(skillPath);
        }
      }

      // Initialize MCP servers configuration
      config.mcpServers = config.mcpServers || {};
      
      // Merge all discovered MCP server configurations
      const mcpServers = discoverMcpServers(pluginsDir);
      
      for (const [serverName, serverConfig] of Object.entries(mcpServers)) {
        // Only add if not already configured (allows user overrides)
        if (!config.mcpServers[serverName]) {
          config.mcpServers[serverName] = serverConfig;
        }
      }
    },

    // Inject plugin context via system prompt transform
    'experimental.chat.system.transform': async (_input: any, output: any) => {
      const bootstrap = getBootstrapContent(pluginsDir, configDir);
      if (bootstrap) {
        (output.system ||= []).push(bootstrap);
      }
    }
  };
};

export default AgentPluginsForAWS;
