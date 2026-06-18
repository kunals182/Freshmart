import https from 'https';

const bundleUrl = 'https://grocery-delivery-gs.vercel.app/assets/index-BL7cd3Wj.js';

https.get(bundleUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        // Search for 'Sign In' or login email/password input boxes
        // In the login form, there are usually placeholders or text like "Email Address" or "Password" or "Sign In"
        const keyword = 'Email Address';
        let idx = data.indexOf(keyword);
        if (idx !== -1) {
            console.log('--- LOGIN PAGE CONTEXT ---');
            console.log(data.substring(idx - 1000, idx + 1000));
        } else {
            console.log('Keyword "Email Address" not found');
            // search for "Password"
            let idx2 = data.indexOf('Password');
            if (idx2 !== -1) {
                 console.log('--- PASSWORD CONTEXT ---');
                 console.log(data.substring(idx2 - 1000, idx2 + 1000));
            }
        }
    });
}).on('error', (err) => {
    console.error('Error fetching bundle:', err);
});
