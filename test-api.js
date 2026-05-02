const http = require('http');
const { URL } = require('url');

const baseUrl = new URL(process.env.BASE_URL || 'http://localhost:3000');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      protocol: baseUrl.protocol,
      hostname: baseUrl.hostname,
      port: baseUrl.port || (baseUrl.protocol === 'https:' ? 443 : 80),
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n=== Testing ${path} ===`);
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', data);
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error('Error:', err.message);
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log('Starting API tests...\n');
    
    // Test 1: Product category stats
    await testEndpoint('/api/v1/products/product-category');
    
    // Test 2: Get all products
    await testEndpoint('/api/v1/products');
    
    // Test 3: Get top 3 cheapest
    await testEndpoint('/api/v1/products/top-3-cheapest');
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();
