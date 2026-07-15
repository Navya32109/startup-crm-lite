const BASE_URL = 'http://localhost:5000/api';

async function runVerification() {
  console.log('=== RUNNING COMPREHENSIVE BACKEND VERIFICATION WORKFLOW ===');
  
  const testEmail = `verify_user_${Date.now()}@example.com`;
  const password = 'Password123!';
  let token = '';

  try {
    // 1. Health Check
    console.log('\n[STEP 1] Testing GET /health ...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status} | OK:`, JSON.stringify(healthData));
    if (healthRes.status !== 200 || healthData.status !== 'OK') {
      throw new Error('Health check endpoint failed');
    }

    // 2. Leads placeholder check
    console.log('\n[STEP 2] Testing GET /leads (placeholder) ...');
    const leadsRes = await fetch(`${BASE_URL}/leads`);
    const leadsData = await leadsRes.json();
    console.log(`Status: ${leadsRes.status} | Data:`, JSON.stringify(leadsData));
    if (leadsRes.status !== 200 || !leadsData.message) {
      throw new Error('Leads route failed');
    }

    // 3. Register user
    console.log('\n[STEP 3] Registering user POST /auth/register ...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Verify Tester', email: testEmail, password })
    });
    const regData = await regRes.json();
    console.log(`Status: ${regRes.status} | Payload:`, JSON.stringify(regData));
    if (regRes.status !== 201 || !regData.success || !regData.token) {
      throw new Error('User registration failed');
    }
    token = regData.token;

    // 4. Authenticate user
    console.log('\n[STEP 4] Logging in user POST /auth/login ...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password })
    });
    const loginData = await loginRes.json();
    console.log(`Status: ${loginRes.status} | Payload:`, JSON.stringify(loginData));
    if (loginRes.status !== 200 || !loginData.success || !loginData.token) {
      throw new Error('Login failed');
    }
    const sessionToken = loginData.token;

    // 5. Fetch profile (Protected)
    console.log('\n[STEP 5] Getting profile details GET /auth/profile ...');
    const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    const profileData = await profileRes.json();
    console.log(`Status: ${profileRes.status} | Profile:`, JSON.stringify(profileData));
    if (profileRes.status !== 200 || !profileData.success || profileData.user.email !== testEmail) {
      throw new Error('Profile fetch failed');
    }

    // 6. Update profile (Protected)
    console.log('\n[STEP 6] Updating profile name PUT /auth/profile ...');
    const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}` 
      },
      body: JSON.stringify({ name: 'Verify Tester Updated' })
    });
    const updateData = await updateRes.json();
    console.log(`Status: ${updateRes.status} | Updated profile:`, JSON.stringify(updateData));
    if (updateRes.status !== 200 || !updateData.success || updateData.user.name !== 'Verify Tester Updated') {
      throw new Error('Profile update failed');
    }

    // 7. Logout (Protected)
    console.log('\n[STEP 7] Logging out POST /auth/logout ...');
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    const logoutData = await logoutRes.json();
    console.log(`Status: ${logoutRes.status} | Payload:`, JSON.stringify(logoutData));
    if (logoutRes.status !== 200 || !logoutData.success) {
      throw new Error('Logout failed');
    }

    console.log('\n=== VERIFICATION RESULT: ALL BACKEND COMPONENTS ARE WORKING 100% CORRECTLY ===');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:', error.message);
    process.exit(1);
  }
}

runVerification();
