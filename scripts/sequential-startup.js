#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load .env file before starting services
dotenv.config({ path: path.join(__dirname, '../.env') });

// Startup order optimized for low-end laptops
// 1. Config server first (centralized configuration) - others depend on it
// 2. Discovery service (Eureka registry) - others depend on it
// 3. Auth service - core authentication
// 4. User service - user management
// 5. Patient & Doctor services - domain services
// 6. Appointment, Telemedicine & Notification services - dependent services
// 7. Gateway - API entry point after routed services have registered
const services = [
  { name: 'config-service', waitTime: 6000 },
  { name: 'discovery-service', waitTime: 8000 },
  { name: 'auth-service', waitTime: 6000 },
  { name: 'user-service', waitTime: 6000 },
  { name: 'patient-service', waitTime: 5000 },
  { name: 'doctor-service', waitTime: 5000 },
  { name: 'appointment-service', waitTime: 5000 },
  { name: 'telemedicine-service', waitTime: 5000 },
  { name: 'notification-service', waitTime: 5000 },
  { name: 'symptom-checker-service', waitTime: 5000 },
  { name: 'gateway', waitTime: 6000 }
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
      console.log(`✅ ${service.name} started. Waiting ${service.waitTime / 1000}s before next service...`);
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
