import Ajv, { JSONSchemaType } from 'ajv';
import { IMCPConfiguration, IMCPServerConfig } from '@/types/mcp';
import mcpSchema from '@/mcp-servers.schema.json';
import fs from 'fs';
import path from 'path';

const ajv = new Ajv();

// Define a type for the schema for better type checking with Ajv
const schema: JSONSchemaType<IMCPConfiguration> = mcpSchema as any;
const validate = ajv.compile(schema);

export class ConfigurationManager {
    private static instance: ConfigurationManager;
    private config: IMCPConfiguration | null = null;
    private readonly configFilePath: string;

    private constructor(configFilePath?: string) {
        this.configFilePath = configFilePath || path.resolve(process.cwd(), 'mcp-servers.config.json');
        this.loadConfiguration();
    }

    public static getInstance(configFilePath?: string): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager(configFilePath);
        }
        return ConfigurationManager.instance;
    }

    private loadConfiguration(): void {
        try {
            const fileContents = fs.readFileSync(this.configFilePath, 'utf-8');
            const parsedConfig = JSON.parse(fileContents);

            if (validate(parsedConfig)) {
                this.config = parsedConfig;
                console.log('MCP server configuration loaded and validated successfully.');
            } else {
                console.error('MCP server configuration validation failed:', validate.errors);
                this.config = null;
            }
        } catch (error: any) {
            console.error('Error loading or parsing MCP server configuration:', error.message);
            this.config = null;
        }
    }

    public reloadConfiguration(): void {
        this.loadConfiguration();
    }

    public getAllConfigs(): IMCPServerConfig[] {
        return this.config?.servers || [];
    }

    public getConfigById(id: string): IMCPServerConfig | undefined {
        return this.config?.servers.find(server => server.id === id);
    }

    public isConfigLoaded(): boolean {
        return this.config !== null;
    }
}

// Example usage (optional, for testing or direct use):
// const configManager = ConfigurationManager.getInstance();
// if (configManager.isConfigLoaded()) {
//     const allServers = configManager.getAllConfigs();
//     console.log('All configured servers:', allServers);
//     const specificServer = configManager.getConfigById('web_search_alpha');
//     console.log('Specific server (web_search_alpha):', specificServer);
// }
