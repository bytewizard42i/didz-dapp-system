/** DIDz.io — demoLand Auth Module */
const DIO_STORAGE='didz_io_demo_users',DIO_SESSION='didz_io_session';
function dioReadUsers(){try{return JSON.parse(localStorage.getItem(DIO_STORAGE)||'[]')}catch{return[]}}
function dioWriteUsers(u){localStorage.setItem(DIO_STORAGE,JSON.stringify(u))}
function dioGetSession(){try{return JSON.parse(localStorage.getItem(DIO_SESSION))}catch{return null}}
function dioSetSession(s){localStorage.setItem(DIO_SESSION,JSON.stringify(s))}
function dioClearSession(){localStorage.removeItem(DIO_SESSION)}
function dioSignup(d){const u=dioReadUsers();if(u.some(x=>x.email.toLowerCase()===d.email.toLowerCase()))throw new Error('Account exists.');u.push(d);dioWriteUsers(u);const s={userId:'demo-'+d.email,displayName:d.firstName+' '+d.lastName,email:d.email,authMethod:d.signupMethod,authenticatedAt:new Date().toISOString()};dioSetSession(s);return s}
function dioLogin(m,e){const u=dioReadUsers(),f=u.find(x=>x.email.toLowerCase()===(e||'').toLowerCase());const s={userId:f?'demo-'+f.email:'user-001',displayName:f?f.firstName+' '+f.lastName:'Demo User',email:f?f.email:'demo@didz.io',authMethod:m,authenticatedAt:new Date().toISOString()};dioSetSession(s);return s}
function dioLogout(){dioClearSession();window.location.href='/login.html'}
function dioRequireAuth(){const s=dioGetSession();if(!s){window.location.href='/login.html';return null}return s}
const DIO_SIM={'email':['Deriving key...','Key derived','Session established!'],'pgp-key':['Scanning...','NitroKey detected','PGP verified!'],'yubikey':['Waiting for YubiKey...','YubiKey 5 detected','FIDO2 verified!'],'did-wallet':['Connecting DID wallet...','DID resolved...','Verified!'],'trezor':['Scanning for Trezor...','Trezor 5 detected','Ed25519 confirmed!'],'biometric':['Initializing WebAuthn...','Biometric scanned...','FIDO2 verified!'],'chrome-oauth':['Redirecting to Google...','Token received','Confirmed!'],'brave-oauth':['Connecting to Brave...','BAT linked','Confirmed!']};
async function dioRunSim(m,cb){const s=DIO_SIM[m]||['Connecting...','Done!'];for(const x of s){cb(x);await new Promise(r=>setTimeout(r,900))}}
