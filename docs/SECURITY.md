# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 3.x.x   | :white_check_mark: |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of AI Teammate seriously. If you discover a security vulnerability, please follow these guidelines:

### How to Report

1. **Do NOT create a public GitHub issue** for security vulnerabilities
2. Send an email to: **trivedivatsal005@gmail.com**
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Initial Assessment**: We'll provide an initial assessment within 5 business days
- **Regular Updates**: We'll keep you informed of our progress
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Security Best Practices

When using AI Teammate:

1. **Protect API Keys**: Never commit Azure OpenAI API keys to your repository
2. **Use Repository Secrets**: Store all sensitive information in GitHub repository secrets
3. **Limit Permissions**: Grant only necessary permissions to the GitHub token
4. **Regular Updates**: Keep the action updated to the latest version
5. **Monitor Usage**: Regularly check your Azure OpenAI usage and costs

### Responsible Disclosure

We follow responsible disclosure practices:
- We'll work with you to understand and resolve the issue
- We'll credit you for the discovery (unless you prefer to remain anonymous)
- We'll coordinate the timing of the disclosure

## Security Features

AI Teammate includes several security features:

- **No Code Execution**: Only analyzes code diffs, doesn't execute user code
- **Limited API Access**: Only requires read access to pull requests and write access to comments
- **Secure Dependencies**: Regular dependency updates and vulnerability scanning
- **Input Validation**: Validates all inputs before processing

Thank you for helping keep AI Teammate secure!
