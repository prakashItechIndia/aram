#!/bin/bash

# DO NOT USE FOR LOCAL .env GENERATION
# ONLY DESIGNED FOR USE OF BITBUCKET TO GENERATE .env FILE FOR DEPLOYMENTS

TEMPLATE_ENV_FILE_PATH=.env.template
GENERATED_ENV_FILE_PATH=.env

# Remove old file
rm -rf $GENERATED_ENV_FILE_PATH

# Backup Internal field separator override for new lines
IFSBAK=$IFS

while IFS="" read -r p || [ -n "$p" ]; do
  # printf '%s\n' "$p"
  # echo $p | cut -f1 -d"=" #remove characters after =
  env_var_name=$(echo $p | cut -f1 -d"=") #remove characters after =

  # Check if it is not a comment line
  # There are few cases it might not detect. Like if a comment is inline without an =
  if [[ $env_var_name =~ ^[[:space:]]*\#.*$ ]]; then
    # ignore
    continue
  else
    env_var_value=$(echo "${!env_var_name}")
    echo $env_var_name="\"$env_var_value\"" >>$GENERATED_ENV_FILE_PATH
  fi

done <$TEMPLATE_ENV_FILE_PATH

# Revert IFS Change
IFS=$IFSBAK
