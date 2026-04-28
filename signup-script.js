// Redirect if already logged in
(function () {
    const session = Auth.getSession();
    if (session) window.location.href = Auth.dashboardFor(session.role);
})();

const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const errorBox = document.getElementById('errorBox');
const pwEl = document.getElementById('password');
const confirmEl = document.getElementById('confirmPassword');
const togglePw = document.getElementById('togglePw');

togglePw.addEventListener('click', () => {
    const isText = pwEl.type === 'text';
    pwEl.type = isText ? 'password' : 'text';
});

pwEl.addEventListener('input', () => {
    const val = pwEl.value;
    const wrap = document.getElementById('strengthWrap');
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');

    if (!val) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'flex';

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
        { pct: '25%', color: '#dc2626', label: 'Weak' },
        { pct: '50%', color: '#f59e0b', label: 'Fair' },
        { pct: '75%', color: '#3b82f6', label: 'Good' },
        { pct: '100%', color: '#16a34a', label: 'Strong' }
    ];
    const lvl = levels[score - 1] || levels[0];
    fill.style.width = lvl.pct;
    fill.style.background = lvl.color;
    text.textContent = lvl.label;
});

function setErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    const inputId = id.replace('Err', '');
    const input = document.getElementById(inputId);
    if (input) {
        if (msg) input.classList.add('is-err');
        else input.classList.remove('is-err');
    }
}

function clearErrors() {
    ['firstName', 'lastName', 'email', 'role', 'pw', 'confirm', 'terms']
        .forEach(id => setErr(id + 'Err', ''));
    errorBox.style.display = 'none';
}

function getSelectedRole() {
    const checked = document.querySelector('input[name="role"]:checked');
    return checked ? checked.value : null;
}

function validate() {
    let ok = true;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = getSelectedRole();
    const pw = pwEl.value;
    const confirm = confirmEl.value;
    const terms = document.getElementById('terms').checked;

    if (!firstName) { setErr('firstNameErr', 'First name is required.'); ok = false; }
    if (!lastName)  { setErr('lastNameErr', 'Last name is required.'); ok = false; }
    if (!email) {
        setErr('emailErr', 'Email is required.'); ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErr('emailErr', 'Enter a valid email address.'); ok = false;
    }
    if (!role) { setErr('roleErr', 'Please select a role.'); ok = false; }
    if (!pw) {
        setErr('pwErr', 'Password is required.'); ok = false;
    } else if (pw.length < 8) {
        setErr('pwErr', 'Password must be at least 8 characters.'); ok = false;
    }
    if (!confirm) {
        setErr('confirmErr', 'Please confirm your password.'); ok = false;
    } else if (pw !== confirm) {
        setErr('confirmErr', 'Passwords do not match.'); ok = false;
    }
    if (!terms) { setErr('termsErr', 'You must agree to continue.'); ok = false; }

    return ok;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;

    submitBtn.textContent = 'Creating account…';
    submitBtn.classList.add('loading');

    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('email').value.trim();
    const password  = pwEl.value;
    const role      = getSelectedRole();

    setTimeout(() => {
        const result = Auth.register({ firstName, lastName, email, password, role });
        if (!result.ok) {
            errorBox.textContent = result.error;
            errorBox.style.display = 'block';
            submitBtn.textContent = 'Create account';
            submitBtn.classList.remove('loading');
            return;
        }
        Auth.login(email, password);
        window.location.href = Auth.dashboardFor(role);
    }, 700);
});
