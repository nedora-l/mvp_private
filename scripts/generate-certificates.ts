// This script generates self-signed SSL certificates for HTTPS in development mode
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const certsDir = path.join(process.cwd(), 'certificates');

// Create certificates directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
  console.log('Created certificates directory');
}

try {
  // Use OpenSSL to generate a self-signed certificate
  // Note: OpenSSL must be installed on your system for this to work
  console.log('Generating self-signed certificates...');
  
  // Generate private key
  execSync(`openssl genrsa -out ${path.join(certsDir, 'localhost-key.pem')} 2048`);
  
  // Generate certificate signing request (CSR)
  execSync(`openssl req -new -key ${path.join(certsDir, 'localhost-key.pem')} -out ${path.join(certsDir, 'localhost-csr.pem')} -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`);
  
  // Generate self-signed certificate valid for 365 days
  execSync(`openssl x509 -req -days 365 -in ${path.join(certsDir, 'localhost-csr.pem')} -signkey ${path.join(certsDir, 'localhost-key.pem')} -out ${path.join(certsDir, 'localhost.pem')}`);
  
  console.log('Successfully generated SSL certificates in the certificates directory');
  console.log('You can now run the development server with HTTPS enabled');
} catch (error) {
  console.error('Error generating certificates:', error);
  console.log('Make sure OpenSSL is installed on your system');
  process.exit(1);
}