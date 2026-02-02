#!/bin/bash
# OpenAPI Generator Script for Frontend
# Generates TypeScript client code from OpenAPI/Swagger JSON specs

set -e

TARGET_KEY=${OPENAPI_SWAGGER_KEY:-SWAGGER_JSON_DEV_ENDPOINT_SSO}

# Read the target endpoint from openapi.url.env and extract the URL
SWAGGER_JSON_ENDPOINT=$(grep -E "^${TARGET_KEY}=" openapi.url.env | sed "s/${TARGET_KEY}=//; s/^\"\\(.*\\)\"$/\\1/")

# Check if SWAGGER_JSON_ENDPOINT is set
if [ -z "$SWAGGER_JSON_ENDPOINT" ]; then
  echo "❌ Unable to resolve an endpoint. Looked for key: ${TARGET_KEY}."
  echo "Available keys in openapi.url.env:"
  grep -E "^SWAGGER_JSON_DEV_ENDPOINT" openapi.url.env | cut -d'=' -f1 || echo "  (none found)"
  exit 1
fi

echo "📡 Using endpoint (${TARGET_KEY}): $SWAGGER_JSON_ENDPOINT"

# Determine output directory based on API type
if [[ "$TARGET_KEY" == *"SSO"* ]]; then
  OUTPUT_DIR="src/_api/sso"
  echo "📦 Generating SSO API client..."
elif [[ "$TARGET_KEY" == *"BILLING"* ]] || [[ "$TARGET_KEY" == *"EXPERIENCE"* ]]; then
  OUTPUT_DIR="src/_api/experience"
  echo "📦 Generating Experience API client..."
else
  OUTPUT_DIR="src/_api"
  echo "📦 Generating API client..."
fi

# Remove existing generated files for this API
if [ -d "$OUTPUT_DIR" ]; then
  echo "🗑️  Removing existing generated files in $OUTPUT_DIR..."
  rm -rf "$OUTPUT_DIR"
fi

# Create the output directory
mkdir -p "$OUTPUT_DIR"

# Create temporary directory for generation
TEMP_DIR="src/api_temp_$$"
mkdir -p "$TEMP_DIR"

# Generate code using openapi-generator-cli
echo "⚙️  Generating TypeScript client from OpenAPI spec..."
openapi-generator-cli \
  generate -i "$SWAGGER_JSON_ENDPOINT" \
  --skip-validate-spec \
  --generator-name typescript-axios \
  --output "$TEMP_DIR" \
  --config openapi.config.json

# Check if generation was successful
if [ ! -f "$TEMP_DIR/api.ts" ]; then
  echo "❌ Generation failed - api.ts not found in $TEMP_DIR"
  rm -rf "$TEMP_DIR"
  exit 1
fi

# Copy generated files to output directory
echo "📋 Copying generated files to $OUTPUT_DIR..."
cp "$TEMP_DIR/api.ts" "$OUTPUT_DIR/"
cp "$TEMP_DIR/base.ts" "$OUTPUT_DIR/"
cp "$TEMP_DIR/common.ts" "$OUTPUT_DIR/"
cp "$TEMP_DIR/configuration.ts" "$OUTPUT_DIR/"
cp "$TEMP_DIR/index.ts" "$OUTPUT_DIR/"

# Remove temporary directory
rm -rf "$TEMP_DIR"

echo "✅ Successfully generated API client in $OUTPUT_DIR"
echo "📁 Files generated:"
ls -lh "$OUTPUT_DIR" | grep -E "\.(ts|js)$" || echo "  (no files found)"
