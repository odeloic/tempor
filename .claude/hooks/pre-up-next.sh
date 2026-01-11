#!/bin/bash
# PreToolUse hook for /up-next command - Branch Management
# Runs once at the start to ensure correct branch is checked out
#
# Expected input via stdin: JSON with tool_name, tool_input, session_id, etc.
# Branch name is extracted from $1 argument of the slash command

set -e

# Read JSON input from stdin
INPUT=$(cat)

# Extract tool name and args
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only process on first Read tool call (indicates command is starting)
if [[ "$TOOL_NAME" != "Read" ]]; then
    exit 0
fi

# Get the session's hook context - branch name should be passed
# via the slash command arguments ($1)
# The hook receives tool_input which may contain context
ARGS=$(echo "$INPUT" | jq -r '.tool_input.args // empty' 2>/dev/null)

# Try to extract branch name from various sources
BRANCH_NAME=""

# Check if BRANCH_NAME is set as environment variable (from slash command)
if [[ -n "${BRANCH_NAME:-}" ]]; then
    : # Use the env var
elif [[ -n "$ARGS" ]]; then
    # Extract first word from args as branch name
    BRANCH_NAME=$(echo "$ARGS" | awk '{print $1}')
fi

# If no branch name, exit silently (let Claude handle the error)
if [[ -z "$BRANCH_NAME" ]]; then
    exit 0
fi

# Navigate to project directory
cd "${CLAUDE_PROJECT_DIR:-/Users/loicishimwe/workspace/projects/tempor}" || exit 0

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [[ -z "$CURRENT_BRANCH" ]]; then
    echo "Not in a git repository" >&2
    exit 0
fi

# Check if target branch exists
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" 2>/dev/null; then
    # Branch exists
    if [[ "$CURRENT_BRANCH" == "$BRANCH_NAME" ]]; then
        # Already on the branch, continue
        echo "Already on branch: $BRANCH_NAME"
        exit 0
    else
        # Switch to existing branch
        git checkout "$BRANCH_NAME" 2>&1
        echo "Switched to existing branch: $BRANCH_NAME"
        exit 0
    fi
else
    # Branch doesn't exist, create it
    git checkout -b "$BRANCH_NAME" 2>&1
    echo "Created and switched to new branch: $BRANCH_NAME"
    exit 0
fi
