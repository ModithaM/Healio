#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Startup order optimized for low-end laptops
// 1. Config server first (centralized configuration) - others depend on it
// 2. Discovery service (Eureka registry) - others depend on it
// 3. Auth service - core authentication
// 4. User service - user management
// 5. Gateway - API entry point (after core services are ready)
// 6. Patient & Doctor services - domain services
// 7. Appointment & Telemedicine services - dependent services
const services = [
  { name: 'config-service', port: 8888, waitTime: 6000 },
  { name: 'discovery-service', port: 8761, waitTime: 8000 },
  { name: 'auth-service', port: 8081, waitTime: 6000 },
  { name: 'user-service', port: 8082, waitTime: 6000 },
  { name: 'gateway', port: 8080, waitTime: 6000 },
  { name: 'patient-service', port: 8083, waitTime: 5000 },
  { name: 'doctor-service', port: 8084, waitTime: 5000 },
  { name: 'appointment-service', port: 8085, waitTime: 5000 },
  { name: 'telemedicine-service', port: 8086, waitTime: 5000 }
];

let runningProcesses = [];

const startService = (service, index) => {
  return new Promise((resolve) => {
    console.log(`\n[${index + 1}/${services.length}] Starting ${service.name}...`);
    
    const proc = spawn('mvn', ['spring-boot:run'], {
      cwd: path.join(__dirname, '../services', service.name),
      stdio: 'inherit',
      shell: true
    });

    runningProcesses.push(proc);

    proc.on('error', (err) => {
      console.error(`❌ Error starting ${service.name}:`, err.message);
      resolve();
    });

    // Wait for service to start and stabilize
    setTimeout(() => {
      console.log(`✅ ${service.name} started (port: ${service.port}). Waiting ${service.waitTime / 1000}s before next service...`);
      resolve();
    }, service.waitTime);
  });
};

const startAllServices = async () => {
  console.log('🚀 Starting Healio microservices (sequential mode)');
  console.log('═'.repeat(70));

  for (let i = 0; i < services.length; i++) {
    await startService(services[i], i);
  }

  console.log('\n' + '═'.repeat(70));
  console.log('✅ All services started!');
  console.log('\nService URLs:');
  services.forEach(service => {
    console.log(`  • ${service.name}: http://localhost:${service.port}`);
  });
  console.log('\n📋 To stop all services, press Ctrl+C or run: npm run stop');
  console.log('═'.repeat(70) + '\n');
};

// Handle graceful shutdown
const handleShutdown = () => {
  console.log('\n\n⏹️  Shutting down all services...');
  runningProcesses.forEach(proc => {
    try {
      proc.kill();
    } catch (e) {
      // Process already terminated
    }
  });
  process.exit(0);
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

startAllServices().catch((err) => {
  console.error('Fatal error:', err);
  handleShutdown();
});
