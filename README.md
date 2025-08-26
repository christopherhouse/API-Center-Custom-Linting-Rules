# 🎯 Azure API Center Custom Linting Rules

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the **Azure API Center Custom Linting Rules** repository! 🚀 This project demonstrates how to author, customize, and deploy powerful linting rules for Azure API Center to ensure your APIs meet organizational standards and best practices.

## 📋 Overview

This repository showcases how to:
- 📤 Export existing rulesets from Azure API Center analyzer configurations
- ✏️ Edit and customize rules locally using VS Code
- 🔧 Create custom JavaScript validation functions
- 📥 Import updated rulesets back to Azure API Center analyzer configurations
- 🎨 Implement comprehensive API governance standards

## 🏁 Quick Start

### Prerequisites
- 🔹 Azure CLI installed and configured
- 🔹 Azure API Center instance
- 🔹 Azure API Center CLI extension (`az extension add --name apic-extension --allow-preview`)
- 🔹 An analyzer configuration in your API Center (or create one with `az apic api-analysis create`)
- 🔹 VS Code or your preferred editor
- 🔹 Node.js (for testing custom functions locally)

### 🚀 Getting Started

1. **Clone this repository:**
```bash
git clone https://github.com/christopherhouse/API-Center-Custom-Linting-Rules.git
cd API-Center-Custom-Linting-Rules
```

2. **Export existing ruleset from Azure API Center:**
```bash
az apic api-analysis export-ruleset \
  --resource-group "your-resource-group" \
  --service-name "your-apic-instance" \
  --config-name "your-analyzer-config" \
  --path "./exported-ruleset"
```

3. **Edit the ruleset locally** (see sections below for details)

4. **Import updated ruleset back to Azure API Center:**
```bash
az apic api-analysis import-ruleset \
  --resource-group "your-resource-group" \
  --service-name "your-apic-instance" \
  --config-name "your-analyzer-config" \
  --path "./exported-ruleset"
```

## 📤 Exporting Rulesets from Azure API Center

Use the Azure CLI to export existing rulesets from your API Center analyzer configurations:

```bash
# Export the default analyzer configuration
az apic api-analysis export-ruleset \
  --resource-group "my-rg" \
  --service-name "my-apic" \
  --config-name "default" \
  --path "./my-exported-rules"

# Export a specific custom analyzer configuration
az apic api-analysis export-ruleset \
  --resource-group "my-rg" \
  --service-name "my-apic" \
  --config-name "my-custom-config" \
  --path "./exported-custom-rules"
```

This will create a local folder structure with:
- 📄 `ruleset.yml` - The main ruleset configuration
- 📁 `functions/` - Directory containing custom JavaScript functions

## ✏️ Editing Rulesets Locally

Once exported, you can edit the rulesets using VS Code or any text editor:

1. **Open in VS Code:**
```bash
code ./exported-ruleset
```

2. **Edit `ruleset.yml`** to:
   - Add new rules
   - Modify existing rule severity levels
   - Configure rule parameters
   - Reference custom functions

3. **Create or modify custom functions** in the `functions/` directory

4. **Test your changes** locally before importing

> **Important:** When importing, use the folder path (e.g., `./exported-ruleset`) not the file path (e.g., `./exported-ruleset/ruleset.yml`).

## 📥 Importing Rulesets to Azure API Center

After making your changes, import the updated ruleset to an analyzer configuration:

```bash
# Import using this repository's ruleset to an analyzer configuration
az apic api-analysis import-ruleset \
  --resource-group "my-rg" \
  --service-name "my-apic" \
  --config-name "custom-governance-rules" \
  --path "./ruleset-folder"

# Import to a specific analyzer configuration
az apic api-analysis import-ruleset \
  --resource-group "my-rg" \
  --service-name "my-apic" \
  --config-name "enterprise-standards" \
  --path "./ruleset-folder"
```

> **Note:** The import command expects a folder path containing the ruleset files, not a direct path to the `ruleset.yml` file. The analyzer configuration must be created separately using `az apic api-analysis create` if it doesn't exist.

## 🔧 Understanding Analyzer Configurations

Azure API Center uses **analyzer configurations** to manage API linting rules. Each configuration contains:
- 📋 A ruleset (YAML file with rule definitions)
- 📁 Custom functions (JavaScript files for validation logic)
- ⚙️ Configuration metadata (name, description, etc.)

### Managing Analyzer Configurations

```bash
# List all analyzer configurations
az apic api-analysis list \
  --resource-group "my-rg" \
  --service-name "my-apic"

# Create a new analyzer configuration
az apic api-analysis create \
  --resource-group "my-rg" \
  --service-name "my-apic" \
  --config-name "my-custom-config"

# Show details of an analyzer configuration
az apic api-analysis show \
  --resource-group "my-rg" \
  --service-name "my-apic" \
  --config-name "my-custom-config"
```

## 🎨 Understanding the Ruleset Structure

The `ruleset.yml` file in this repository demonstrates various types of rules:

### 🔧 Built-in Spectral Rules
```yaml
extends: [['spectral:oas', all], 'spectral:asyncapi']
```
Extends standard OpenAPI and AsyncAPI rules from Spectral.

### 📝 Custom Function Rules
```yaml
functions:
  - greeting
  - descriptionValidation
  - noDefaultResponse
  - requireJsonExamples
```
References to custom JavaScript functions in the `functions/` directory.

### 🛡️ Security & Standards Rules

| Rule | Purpose | Severity |
|------|---------|----------|
| `https-only-servers` | 🔒 Ensures all servers use HTTPS | error |
| `require-contact` | 📧 Requires contact email in API info | error |
| `require-license` | ⚖️ Requires license information | error |
| `require-429` | 🚦 Ensures 429 (rate limit) responses | warn |

### 🎯 Custom Validation Rules

| Rule | Function | Purpose |
|------|----------|---------|
| `shortAlnumDescription` | `descriptionValidation` | Validates descriptions are alphanumeric and under 20 chars |
| `no-default-response` | `noDefaultResponse` | Prevents using 'default' responses |
| `json-requestbody-examples` | `requireJsonExamples` | Requires examples in JSON request bodies |

### 🏗️ Structure & Format Rules

| Rule | Purpose |
|------|---------|
| `no-trailing-slash-paths` | Prevents trailing slashes in path definitions |
| `pagination-couple` | Ensures limit/offset parameters are used together |
| `opid-camel` | Enforces camelCase for operationId |

## 🔍 Custom Functions Explained

### 📏 `descriptionValidation.js`
```javascript
// Validates API and operation descriptions
// ✅ Must be alphanumeric only
// ✅ Must be less than 20 characters
// ❌ Fails: "My API with spaces!"
// ✅ Passes: "MyAPIv1"
```

**Usage in ruleset:**
```yaml
shortAlnumDescription:
  description: "Descriptions must be alphanumeric and < 20 chars"
  severity: error
  given:
    - $.info.description          # API-level
    - $.paths[*][*].description   # operation-level
  then:
    function: descriptionValidation
```

### 🚫 `noDefaultResponse.js`
```javascript
// Prevents use of 'default' response codes
// ❌ Fails: responses: { default: {...} }
// ✅ Passes: responses: { 200: {...}, 400: {...} }
```

**Usage in ruleset:**
```yaml
no-default-response:
  given: $.paths[*][*].responses
  then:
    function: noDefaultResponse
  severity: error
```

### 📚 `requireJsonExamples.js`
```javascript
// Ensures JSON request bodies include examples
// ❌ Fails: content: { "application/json": { schema: {...} } }
// ✅ Passes: content: { "application/json": { schema: {...}, example: {...} } }
```

**Usage in ruleset:**
```yaml
json-requestbody-examples:
  description: "Require examples on all application/json request bodies"
  severity: error
  given: $.paths[*][*].requestBody
  then:
    function: requireJsonExamples
```

### 👋 `greeting.js`
```javascript
// Demo function showing basic structure
// Returns a greeting message for any input
```

**Usage in ruleset:**
```yaml
greetingRule:
  message: "{{error}}"
  given: "$.greeting.firstName"
  then:
    function: greeting
```

## 🧪 Testing Custom Functions

You can test custom functions locally using Node.js:

```javascript
// test-function.js
import descriptionValidation from './functions/descriptionValidation.js';

const context = { path: ['info', 'description'] };
const result = descriptionValidation('My API Description!', {}, context);
console.log(result); // Shows validation errors
```

## 💡 Best Practices

### 🎯 Rule Design
- ✅ Use clear, descriptive rule names
- ✅ Provide helpful error messages
- ✅ Set appropriate severity levels
- ✅ Document the purpose of each rule

### 🔧 Custom Functions
- ✅ Handle edge cases gracefully
- ✅ Return consistent error objects
- ✅ Use meaningful error messages
- ✅ Include path information for context

### 📋 Governance
- ✅ Start with warning severity for new rules
- ✅ Gradually increase to error as teams adapt
- ✅ Regular review and updates
- ✅ Team training and documentation

## 🛠️ Development Workflow

1. **Export** current ruleset from an Azure API Center analyzer configuration
2. **Create branch** for your changes
3. **Edit** rules and functions locally
4. **Test** functions with sample data
5. **Validate** YAML syntax
6. **Import** to test analyzer configuration
7. **Test** with real API definitions
8. **Import** to production analyzer configuration

## 📖 Additional Resources

- 📚 [Azure API Center Documentation](https://docs.microsoft.com/azure/api-center/)
- 🔍 [Spectral Documentation](https://meta.stoplight.io/docs/spectral/)
- 🌐 [OpenAPI Specification](https://swagger.io/specification/)
- ⚡ [Azure CLI API Center Extension](https://docs.microsoft.com/cli/azure/apic)

## 🤝 Contributing

Contributions are welcome! Please:
1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. ✨ Make your changes
4. ✅ Test thoroughly
5. 📝 Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

🎉 **Happy API Governance!** 🎉

For questions or support, please open an issue in this repository.
