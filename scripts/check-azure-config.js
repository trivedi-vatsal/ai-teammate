#!/usr/bin/env node

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const dotenv = require("dotenv");
const path = require("path");

async function checkAzureConfig() {
  console.log('🔍 Checking Azure OpenAI Configuration...\n');

  // Load environment variables from .env file
  const envPath = path.join(__dirname, '..', '.env');
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    console.log('📝 No .env file found, checking system environment variables...\n');
  } else {
    console.log('✅ Loaded configuration from .env file\n');
  }

  // Check environment variables
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const modelName = process.env.AZURE_OPENAI_MODEL_NAME;

  console.log('📋 Environment Variables Check:');
  console.log(`✅ AZURE_OPENAI_ENDPOINT: ${endpoint ? '✓ Set' : '❌ Missing'}`);
  console.log(`✅ AZURE_OPENAI_API_KEY: ${apiKey ? '✓ Set' : '❌ Missing'}`);
  console.log(`✅ AZURE_OPENAI_MODEL_NAME: ${modelName ? '✓ Set' : '❌ Missing'}\n`);

  if (!endpoint || !apiKey || !modelName) {
    console.error('❌ Missing required environment variables!');
    console.log('\n📝 Option 1: Create a .env file in the project root:');
    console.log('AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/');
    console.log('AZURE_OPENAI_API_KEY=your-api-key-here');
    console.log('AZURE_OPENAI_MODEL_NAME=gpt-4');
    console.log('\n📝 Option 2: Set environment variables:');
    console.log('export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"');
    console.log('export AZURE_OPENAI_API_KEY="your-api-key-here"');
    console.log('export AZURE_OPENAI_MODEL_NAME="gpt-4"');
    process.exit(1);
  }

  try {
    // Test Azure OpenAI client initialization
    console.log('🔧 Testing Azure OpenAI Client...');
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    console.log('✅ Client initialized successfully\n');

    // Test a simple API call
    console.log('🧪 Testing API Connection...');
    const result = await client.getChatCompletions(
      modelName,
      [
        {
          role: "user",
          content: "Hello! This is a test message to verify Azure OpenAI connection."
        }
      ],
      {
        maxTokens: 50,
        temperature: 0.1
      }
    );

    console.log('✅ API connection successful!');
    console.log(`📝 Response: ${result.choices[0].message.content}\n`);

    console.log('🎉 All checks passed! Azure OpenAI configuration is working correctly.');
    
  } catch (error) {
    console.error('❌ Error during Azure OpenAI test:');
    console.error(`   ${error.message}`);
    
    if (error.statusCode) {
      console.error(`   Status Code: ${error.statusCode}`);
    }
    
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Verify your endpoint URL is correct');
    console.log('2. Check if your API key is valid and not expired');
    console.log('3. Ensure your model name is correct');
    console.log('4. Verify your Azure OpenAI resource is active');
    console.log('5. Check if you have proper permissions');
    
    process.exit(1);
  }
}

// Run the check
if (require.main === module) {
  checkAzureConfig();
}

module.exports = { checkAzureConfig };
