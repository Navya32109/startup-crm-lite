const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== RUNNING LEAD CRUD API TEST WORKFLOW ===\n');

  // Generate test users
  const user1Email = `user1_${Date.now()}@example.com`;
  const user2Email = `user2_${Date.now()}@example.com`;
  const password = 'Password123!';

  let user1Token = '';
  let user2Token = '';
  let leadId = '';

  try {
    // ----------------------------------------------------
    // 1. REGISTER & LOGIN USER 1
    // ----------------------------------------------------
    console.log('[Auth] Registering User 1...');
    const reg1Res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User One', email: user1Email, password })
    });
    const reg1Data = await reg1Res.json();
    if (reg1Res.status !== 201 || !reg1Data.token) {
      throw new Error(`Failed to register User 1: ${JSON.stringify(reg1Data)}`);
    }
    user1Token = reg1Data.token;
    console.log('User 1 registered and token acquired.\n');

    // ----------------------------------------------------
    // 2. REGISTER & LOGIN USER 2
    // ----------------------------------------------------
    console.log('[Auth] Registering User 2...');
    const reg2Res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Two', email: user2Email, password })
    });
    const reg2Data = await reg2Res.json();
    if (reg2Res.status !== 201 || !reg2Data.token) {
      throw new Error(`Failed to register User 2: ${JSON.stringify(reg2Data)}`);
    }
    user2Token = reg2Data.token;
    console.log('User 2 registered and token acquired.\n');

    // ----------------------------------------------------
    // 3. CREATE LEAD (VALID)
    // ----------------------------------------------------
    console.log('[POST /api/leads] Creating valid lead as User 1...');
    const createLeadPayload = {
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john.doe@acme.com',
      phone: '+1234567890',
      status: 'New',
      source: 'LinkedIn',
      notes: 'Initial contact made.'
    };
    const createRes = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      },
      body: JSON.stringify(createLeadPayload)
    });
    const createData = await createRes.json();
    console.log(`Status: ${createRes.status} | Success: ${createData.success}`);
    if (createRes.status !== 201 || !createData.success || !createData.data._id) {
      throw new Error(`Create Lead failed: ${JSON.stringify(createData)}`);
    }
    leadId = createData.data._id;
    console.log(`Lead created successfully. ID: ${leadId}\n`);

    // ----------------------------------------------------
    // 4. CREATE LEAD (INVALID - VALIDATION FAILURES)
    // ----------------------------------------------------
    console.log('[POST /api/leads] Testing validations (empty name, invalid email, invalid status)...');
    const invalidPayload = {
      name: '', // should fail (empty/min length 2)
      company: 'Acme Corp',
      email: 'invalid-email-format', // should fail
      status: 'Super-Invalid-Status', // should fail
      source: 'LinkedIn'
    };
    const invalidRes = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      },
      body: JSON.stringify(invalidPayload)
    });
    const invalidData = await invalidRes.json();
    console.log(`Status: ${invalidRes.status} | Success: ${invalidData.success}`);
    console.log('Errors returned:', JSON.stringify(invalidData.errors));
    if (invalidRes.status !== 400 || invalidData.success !== false) {
      throw new Error(`Validation check failed: Expected status 400, got ${invalidRes.status}`);
    }
    console.log('Validations successfully intercepted invalid inputs.\n');

    // ----------------------------------------------------
    // 5. GET LEADS (PAGINATED & FILTERED)
    // ----------------------------------------------------
    console.log('[GET /api/leads] Retrieving all leads for User 1...');
    const getRes = await fetch(`${BASE_URL}/leads`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const getData = await getRes.json();
    console.log(`Status: ${getRes.status} | Found Leads Count: ${getData.data.length}`);
    if (getRes.status !== 200 || !getData.success || getData.data.length !== 1) {
      throw new Error(`Get Leads failed: ${JSON.stringify(getData)}`);
    }

    console.log('[GET /api/leads] Testing Search filter ("Acme")...');
    const searchRes = await fetch(`${BASE_URL}/leads?search=Acme`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const searchData = await searchRes.json();
    console.log(`Status: ${searchRes.status} | Search matches: ${searchData.data.length}`);
    if (searchData.data.length !== 1) {
      throw new Error('Search did not match Acme');
    }

    console.log('[GET /api/leads] Testing Search filter negative ("NotExist")...');
    const searchNegRes = await fetch(`${BASE_URL}/leads?search=NotExist`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const searchNegData = await searchNegRes.json();
    console.log(`Status: ${searchNegRes.status} | Search matches: ${searchNegData.data.length}`);
    if (searchNegData.data.length !== 0) {
      throw new Error('Search should have returned 0 results');
    }

    console.log('[GET /api/leads] Testing Status filter ("New")...');
    const statusFilterRes = await fetch(`${BASE_URL}/leads?status=New`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const statusFilterData = await statusFilterRes.json();
    console.log(`Status: ${statusFilterRes.status} | Status matches: ${statusFilterData.data.length}`);
    if (statusFilterData.data.length !== 1) {
      throw new Error('Status filter did not match New');
    }
    console.log('Query parameters (search, status) work correctly.\n');

    // ----------------------------------------------------
    // 6. GET LEAD BY ID
    // ----------------------------------------------------
    console.log(`[GET /api/leads/${leadId}] Retrieving specific lead by ID...`);
    const getByIdRes = await fetch(`${BASE_URL}/leads/${leadId}`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const getByIdData = await getByIdRes.json();
    console.log(`Status: ${getByIdRes.status} | Name: ${getByIdData.data.name}`);
    if (getByIdRes.status !== 200 || getByIdData.data.name !== 'John Doe') {
      throw new Error('Get Lead By ID failed');
    }
    console.log('Get Lead By ID works correctly.\n');

    // ----------------------------------------------------
    // 7. UPDATE LEAD (PREVENT OWNER CHANGE)
    // ----------------------------------------------------
    console.log(`[PUT /api/leads/${leadId}] Updating lead fields and attempting owner change...`);
    const updatePayload = {
      name: 'John Doe Updated',
      company: 'Acme LLC',
      owner: '65eef1234567890abcdef123' // Try to malicious change owner
    };
    const updateRes = await fetch(`${BASE_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      },
      body: JSON.stringify(updatePayload)
    });
    const updateData = await updateRes.json();
    console.log(`Status: ${updateRes.status} | Updated Name: ${updateData.data.name}`);
    if (updateRes.status !== 200 || updateData.data.name !== 'John Doe Updated' || updateData.data.company !== 'Acme LLC') {
      throw new Error('Update Lead failed');
    }
    // Verify owner was NOT changed
    if (updateData.data.owner === '65eef1234567890abcdef123') {
      throw new Error('Security vulnerability: Owner field was successfully changed!');
    }
    console.log('Update Lead and Owner field protection works correctly.\n');

    // ----------------------------------------------------
    // 8. UPDATE LEAD STATUS (PATCH)
    // ----------------------------------------------------
    console.log(`[PATCH /api/leads/${leadId}/status] Updating status to "Won"...`);
    const statusPatchRes = await fetch(`${BASE_URL}/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      },
      body: JSON.stringify({ status: 'Won' })
    });
    const statusPatchData = await statusPatchRes.json();
    console.log(`Status: ${statusPatchRes.status} | Updated status: ${statusPatchData.data.status}`);
    if (statusPatchRes.status !== 200 || statusPatchData.data.status !== 'Won') {
      throw new Error('PATCH status update failed');
    }

    console.log(`[PATCH /api/leads/${leadId}/status] Testing extra fields (should fail)...`);
    const statusPatchExtraRes = await fetch(`${BASE_URL}/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      },
      body: JSON.stringify({ status: 'Lost', extraField: 'hacked' })
    });
    const statusPatchExtraData = await statusPatchExtraRes.json();
    console.log(`Status: ${statusPatchExtraRes.status} | Success: ${statusPatchExtraData.success}`);
    if (statusPatchExtraRes.status !== 400) {
      throw new Error('Expected 400 Bad Request for extra fields on status update');
    }
    console.log('PATCH Status update and restriction works correctly.\n');

    // ----------------------------------------------------
    // 9. OWNER ISOLATION TEST (USER 2 ACCESS USER 1 LEAD)
    // ----------------------------------------------------
    console.log(`[Security] Attempting to access User 1's lead as User 2...`);
    const user2GetRes = await fetch(`${BASE_URL}/leads/${leadId}`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log(`GET status: ${user2GetRes.status}`);
    if (user2GetRes.status !== 404) {
      throw new Error(`Owner isolation vulnerability on GET! Expected 404, got ${user2GetRes.status}`);
    }

    const user2PutRes = await fetch(`${BASE_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user2Token}`
      },
      body: JSON.stringify({ name: 'Hacked by User 2' })
    });
    console.log(`PUT status: ${user2PutRes.status}`);
    if (user2PutRes.status !== 404) {
      throw new Error(`Owner isolation vulnerability on PUT! Expected 404, got ${user2PutRes.status}`);
    }

    const user2DeleteRes = await fetch(`${BASE_URL}/leads/${leadId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log(`DELETE status: ${user2DeleteRes.status}`);
    if (user2DeleteRes.status !== 404) {
      throw new Error(`Owner isolation vulnerability on DELETE! Expected 404, got ${user2DeleteRes.status}`);
    }
    console.log('Security check passed: User 2 cannot see, edit, or delete User 1\'s leads.\n');

    // ----------------------------------------------------
    // 10. LEAD STATS AGGREGATION
    // ----------------------------------------------------
    console.log('[GET /api/leads/stats] Retrieving dashboard stats for User 1...');
    const statsRes = await fetch(`${BASE_URL}/leads/stats`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const statsData = await statsRes.json();
    console.log(`Status: ${statsRes.status} | Payload:`, JSON.stringify(statsData.data));
    if (statsRes.status !== 200 || !statsData.success) {
      throw new Error('Lead stats endpoint failed');
    }
    const s = statsData.data;
    if (s.totalLeads !== 1 || s.wonLeads !== 1 || s.conversionRate !== 100 || s.statusCounts.Won !== 1) {
      throw new Error(`Stats metrics mismatch. Got: ${JSON.stringify(s)}`);
    }
    console.log('Lead statistics dashboard aggregation works correctly.\n');

    // ----------------------------------------------------
    // 11. LEAD MONTHLY STATS AGGREGATION
    // ----------------------------------------------------
    console.log('[GET /api/leads/monthly-stats] Retrieving monthly stats for User 1...');
    const monthlyRes = await fetch(`${BASE_URL}/leads/monthly-stats`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const monthlyData = await monthlyRes.json();
    console.log(`Status: ${monthlyRes.status} | Months returned: ${monthlyData.data.length}`);
    console.log('Payload:', JSON.stringify(monthlyData.data));
    if (monthlyRes.status !== 200 || !monthlyData.success || monthlyData.data.length !== 6) {
      throw new Error('Monthly stats endpoint failed');
    }
    // Verify chronological month names and that totals reflect the newly created lead in the current month
    const currentMonthData = monthlyData.data[5];
    if (currentMonthData.total !== 1 || currentMonthData.won !== 1) {
      throw new Error(`Current month stats mismatch. Expected total=1 won=1, got total=${currentMonthData.total} won=${currentMonthData.won}`);
    }
    console.log('Monthly stats aggregation works correctly.\n');

    // ----------------------------------------------------
    // 12. DELETE LEAD
    // ----------------------------------------------------
    console.log(`[DELETE /api/leads/${leadId}] Deleting the lead as User 1...`);
    const deleteRes = await fetch(`${BASE_URL}/leads/${leadId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const deleteData = await deleteRes.json();
    console.log(`Status: ${deleteRes.status} | Success: ${deleteData.success} | Message: ${deleteData.message}`);
    if (deleteRes.status !== 200 || !deleteData.success || deleteData.message !== 'Lead deleted successfully') {
      throw new Error(`Delete Lead failed: ${JSON.stringify(deleteData)}`);
    }

    // Verify it is gone
    console.log(`[GET /api/leads/${leadId}] Verifying lead deletion...`);
    const verifyGoneRes = await fetch(`${BASE_URL}/leads/${leadId}`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log(`Status: ${verifyGoneRes.status}`);
    if (verifyGoneRes.status !== 404) {
      throw new Error(`Lead should have been deleted, but got status ${verifyGoneRes.status}`);
    }
    console.log('Delete Lead works correctly.\n');

    console.log('========================================================================');
    console.log('🏆 SUCCESS: ALL 8 LEAD CRUD API ENDPOINTS TESTED AND CONFIRMED 100% CORRECT!');
    console.log('========================================================================');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
    process.exit(1);
  }
}

runTests();
