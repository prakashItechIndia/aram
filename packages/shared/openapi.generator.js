#!/usr/bin/env node
/**
 * OpenAPI Generator Script for Frontend
 * Generates TypeScript client code from OpenAPI/Swagger JSON specs
 * Cross-platform Node.js version (ES Module)
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to check if API is reachable
function checkApiReachable(hostname, port) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname,
        port,
        path: '/',
        method: 'HEAD',
        timeout: 3000,
      },
      () => {
        resolve(true);
      },
    );

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Read environment variable or use default
const targetKey =
  process.env.OPENAPI_SWAGGER_KEY || 'SWAGGER_JSON_DEV_ENDPOINT_ARAM';

// Read openapi.url.env file
const envFile = path.join(__dirname, 'openapi.url.env');
let swaggerJsonEndpoint = null;

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    // Skip comments and empty lines
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    // Match key=value or key="value" or key='value'
    const match = trimmedLine.match(new RegExp(`^${targetKey}\\s*=\\s*(.+)$`));
    if (match) {
      // Remove quotes if present and trim
      swaggerJsonEndpoint = match[1].trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

if (!swaggerJsonEndpoint) {
  console.log(
    `⚠️ Unable to resolve an endpoint. Looked for key: ${targetKey}.`,
  );
  console.log('Using local file fallback if available.');
}

// Determine output directory and local JSON file path based on API type
let outputDir;
let localJsonFile = null;

if (targetKey.includes('ARAM')) {
  outputDir = path.join(__dirname, 'src', '_api');
  localJsonFile = path.join(
    __dirname,
    '..',
    '..',
    'services',
    'api',
    'openapi.json',
  );
  console.log('📦 Generating Aram API client...');
} else {
  outputDir = path.join(__dirname, 'src', '_api');
  console.log('📦 Generating API client...');
}

// Main generation function (wrapped in async to use await)
async function generateApiClient() {
  // Check if local JSON file exists (preferred method - doesn't require running API)
  let openApiSource = swaggerJsonEndpoint;
  if (localJsonFile && fs.existsSync(localJsonFile)) {
    console.log(`📄 Using local OpenAPI JSON file: ${localJsonFile}`);
    openApiSource = localJsonFile;
  } else {
    if (!swaggerJsonEndpoint) {
      console.error('❌ No endpoint and no local file found.');
      process.exit(1);
    }
    console.log(`📡 Using HTTP endpoint: ${swaggerJsonEndpoint}`);
    console.log('⚠️  Note: Backend API must be running for this to work.');

    // Check if API is reachable
    try {
      const url = new URL(swaggerJsonEndpoint);
      const port = parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80);
      console.log(
        `🔍 Checking if API is reachable at ${url.hostname}:${port}...`,
      );

      const isReachable = await checkApiReachable(url.hostname, port);

      if (!isReachable) {
        console.error(`\n❌ Cannot connect to ${swaggerJsonEndpoint}`);
        process.exit(1);
      }
      console.log('✅ API is reachable');
    } catch (error) {
      console.error(`\n❌ Error checking API connectivity: ${error.message}`);
      process.exit(1);
    }
  }

  // Remove existing generated files for this API
  if (fs.existsSync(outputDir)) {
    console.log(`🗑️  Removing existing generated files in ${outputDir}...`);
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  // Create the output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Create temporary directory for generation
  const tempDir = path.join(__dirname, 'src', `api_temp_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    // Generate code using openapi-generator-cli
    console.log('⚙️  Generating TypeScript client from OpenAPI spec...');

    const configFile = path.join(__dirname, 'openapi.config.json');
    const ignoreFile = path.join(__dirname, '.openapi-generator-ignore');

    // Resolve local CLI path to avoid npx issues with spaces in paths
    const localCliPath = path.join(
      __dirname,
      'node_modules',
      '@openapitools',
      'openapi-generator-cli',
      'main.js',
    );

    let cmd;
    let args;

    if (fs.existsSync(localCliPath)) {
      console.log(`🔌 Using local openapi-generator-cli: ${localCliPath}`);
      cmd = 'node';
      args = [
        localCliPath,
        'generate',
        '-i',
        `"${openApiSource}"`,
        '--skip-validate-spec',
        '--generator-name',
        'typescript-axios',
        '--output',
        `"${tempDir}"`,
        '--config',
        `"${configFile}"`,
      ];
    } else {
      console.log('🔌 Using npx to run openapi-generator-cli');
      cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      args = [
        '--yes',
        '@openapitools/openapi-generator-cli',
        'generate',
        '-i',
        `"${openApiSource}"`,
        '--skip-validate-spec',
        '--generator-name',
        'typescript-axios',
        '--output',
        `"${tempDir}"`,
        '--config',
        `"${configFile}"`,
      ];
    }

    if (fs.existsSync(ignoreFile)) {
      args.push('--ignore-file-override', `"${ignoreFile}"`);
    }

    const result = spawnSync(cmd, args, {
      stdio: 'inherit',
      cwd: __dirname,
      shell: false,
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(`Process exited with status ${result.status}`);
    }

    // Check if generation was successful
    const apiFile = path.join(tempDir, 'api.ts');
    if (!fs.existsSync(apiFile)) {
      throw new Error(`Generation failed - api.ts not found in ${tempDir}`);
    }

    // Copy generated files to output directory
    console.log(`📋 Copying generated files to ${outputDir}...`);

    const filesToCopy = [
      'api.ts',
      'base.ts',
      'common.ts',
      'configuration.ts',
      'index.ts',
    ];
    filesToCopy.forEach((file) => {
      const src = path.join(tempDir, file);
      const dest = path.join(outputDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });

    // Remove temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log(`✅ Successfully generated API client in ${outputDir}`);
    console.log('📁 Files generated:');

    const files = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
    files.forEach((file) => {
      const stats = fs.statSync(path.join(outputDir, file));
      console.log(`  ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  } catch (error) {
    // Clean up temp directory on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

// Run the async function
generateApiClient().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
