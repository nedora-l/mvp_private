// This script generates self-signed SSL certificates for HTTPS in development using Node.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(process.cwd(), 'certificates');

// Create certificates directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
  console.log('Created certificates directory');
}

try {
  // Try to directly use the selfsigned module
  let selfsigned;
  try {
    selfsigned = require('selfsigned');
  } catch (e) {
    console.log('Installing selfsigned package...');
    execSync('npm install selfsigned --no-save', { stdio: 'inherit' });
    selfsigned = require('selfsigned');
  }

  console.log('Generating self-signed certificates using Node.js...');
  
  // Generate a self-signed certificate with all needed attributes
  const attrs = [
    { name: 'commonName', value: 'localhost' },
    { name: 'countryName', value: 'US' },
    { name: 'stateOrProvinceName', value: 'State' },
    { name: 'localityName', value: 'City' },
    { name: 'organizationName', value: 'Development' }
  ];
  
  // Set more explicit options for better browser compatibility
  const options = {
    days: 365,
    keySize: 2048,
    algorithm: 'sha256'
  };
  
  const pems = selfsigned.generate(attrs, options);
  
  // Write the certificate files
  fs.writeFileSync(path.join(certsDir, 'localhost-key.pem'), pems.private);
  fs.writeFileSync(path.join(certsDir, 'localhost.pem'), pems.cert);
  
  console.log('Successfully generated SSL certificates');
  console.log(`Certificate files created in: ${certsDir}`);
  console.log('You can now run the development server with HTTPS enabled');
} catch (error) {
  console.error('Error generating certificates:', error);
  process.exit(1);
}