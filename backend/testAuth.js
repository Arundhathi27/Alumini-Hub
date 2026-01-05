const http = require('http');

const postRequest = (data, path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (d) => { body += d; });
            res.on('end', () => {
                resolve({ status: res.statusCode, body: JSON.parse(body) });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
};

const runTests = async () => {
    console.log('--- Starting Auth Tests ---');

    // 1. Test Admin Login (Should Success)
    try {
        const adminData = JSON.stringify({ email: 'admin@example.com', password: 'user@123' });
        const adminRes = await postRequest(adminData, '/api/auth/login');
        console.log(`[TEST 1] Admin Login: ${adminRes.status === 200 ? 'PASS' : 'FAIL'} (Status: ${adminRes.status})`);
        if (adminRes.status === 200) console.log('       Token received:', !!adminRes.body.token);
    } catch (e) { console.error('[TEST 1] FAILED connection', e.message); }

    // 2. Test Pending Alumni Login (Should Fail 403)
    try {
        const pendingData = JSON.stringify({ email: 'pending@example.com', password: 'user@123' });
        const pendingRes = await postRequest(pendingData, '/api/auth/login');
        console.log(`[TEST 2] Pending Alumni Login: ${pendingRes.status === 403 ? 'PASS' : 'FAIL'} (Status: ${pendingRes.status}) - ${pendingRes.body.message}`);
    } catch (e) { console.error('[TEST 2] FAILED connection', e.message); }

    // 3. Test Invalid Password (Should Fail 401)
    try {
        const invalidData = JSON.stringify({ email: 'admin@example.com', password: 'wrongpassword' });
        const invalidRes = await postRequest(invalidData, '/api/auth/login');
        console.log(`[TEST 3] Invalid Password: ${invalidRes.status === 401 ? 'PASS' : 'FAIL'} (Status: ${invalidRes.status})`);
    } catch (e) { console.error('[TEST 3] FAILED connection', e.message); }

    console.log('--- Tests Complete ---');
};

// Wait for server to start ideally, but here we run it manually
// I will run this in a separate command *after* starting the server
runTests();
