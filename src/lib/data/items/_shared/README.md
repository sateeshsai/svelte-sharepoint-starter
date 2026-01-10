# Shared Item Utilities

This folder contains cross-cutting patterns and utilities shared across multiple item domains (stories, files, users, etc.).

## Purpose

When item domains need to share common patterns that don't belong to either domain specifically, place them here. Examples:

- Generic parent-lookup types/schemas
- Common attachment patterns
- Shared validation utilities

## Guidelines

1. **Avoid premature abstraction** - Only add code here when there's a genuine need for sharing across 2+ domains
2. **Keep it minimal** - Prefer domain-specific code over shared abstractions
3. **Document usage** - Each utility should document which domains use it

## Current Contents

_(Empty - populate as genuine shared patterns emerge)_
