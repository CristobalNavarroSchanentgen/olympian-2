# Model Registry

The Model Registry provides a predefined set of model capabilities for use in custom configuration mode.

## Available Models

| Model Name | Tools | Reasoning | Vision |
|------------|--------|-----------|---------|
| llama3.2-vision:11b | ❌ | ❌ | ✅ |
| granite3.2-vision:2b | ❌ | ❌ | ✅ |
| phi4:14b | ❌ | ❌ | ❌ |
| llama3.2:3b | ❌ | ❌ | ❌ |
| phi4-mini:3.8b | ✅ | ❌ | ❌ |
| deepseek-r1:14b | ✅ | ✅ | ❌ |
| qwen3:4b | ✅ | ✅ | ❌ |
| gemma3:4b | ❌ | ❌ | ❌ |

## Configuration Modes

### Auto-Scan Mode (Default)
- Automatically detects model capabilities at runtime
- No restrictions on which models can be used
- Capabilities determined through testing

### Registry Mode
- Only models listed in the registry are available
- Capabilities are predefined and guaranteed
- Faster startup (no detection needed)
- Selected during setup by choosing option 2

## Usage

During setup (`make setup`), you'll be prompted:

```
🔍 Model Capability Detection:
1. Auto-scan (recommended)
2. Custom configuration
```

Selecting option 2 will:
- Enable registry mode
- Show available models
- Restrict model access to registry entries only

## Model Access Validation

When registry mode is enabled:
- Only registered models can be used in chat
- Attempting to use unregistered models will result in an error
- Error messages include suggested alternatives

## Environment Variables

- `AUTO_SCAN_MODELS`: Set to `false` to enable registry mode

## Extending the Registry

To add new models, update the `PREDEFINED_MODEL_REGISTRY` in:
`packages/shared/models/connection/model-registry.ts`
