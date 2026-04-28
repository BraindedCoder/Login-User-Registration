// Redirect if already logged in
(function () {
    const session = Auth.getSession();
    if (session) window.location.href = Auth.dashboardFor(session.role);
})();

const form = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const pwEl = document.getElementById('password');
const emailErr = document.getElementById('emailErr');
const pwErr = document.getElementById('pwErr');
const errorBox = document.getElementById('errorBox');
const submitBtn = document.getElementById('submitBtn');
const togglePw = document.getElementById('togglePw');

togglePw.addEventListener('click', () => {
    const isText = pwEl.type === 'text';
    pwEl.type = isText ? 'password' : 'text';
    togglePw.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
});

function clearErrors() {
    emailErr.textContent = '';
    pwErr.textContent = '';
    errorBox.style.display = 'none';
    emailEl.classList.remove('is-err');
    pwEl.classList.remove('is-err');
}

function validate() {
    let ok = true;
    if (!emailEl.value.trim()) {
        emailErr.textContent = 'Email is required.';
        emailEl.classList.add('is-err');
        ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        emailErr.textContent = 'Enter a valid email.';
        emailEl.classList.add('is-err');
        ok = false;
    }
    if (!pwEl.value) {
        pwErr.textContent = 'Password is required.';
        pwEl.classList.add('is-err');
        ok = false;
    }
    return ok;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;

    submitBtn.textContent = 'Signing in…';
    submitBtn.classList.add('loading');

    setTimeout(() => {
        const result = Auth.login(emailEl.value.trim(), pwEl.value);
        if (!result.ok) {
            errorBox.textContent = result.error;
            errorBox.style.display = 'block';
            submitBtn.textContent = 'Sign in';
            submitBtn.classList.remove('loading');
            return;
        }
        window.location.href = Auth.dashboardFor(result.session.role);
    }, 600);
});
