let currentStage = 1;
const totalStages = 3;

const formsContainer = document.querySelector('.forms');
const signInBtn = document.querySelector('.signIn');
const signUpBtn = document.querySelector('.signUp');
const signInForm = document.querySelector('#loginForm');
const registerForm = document.getElementById('registerForm');

function showPanel(panel) {
    if (!formsContainer) return;
    formsContainer.classList.toggle('show-signup', panel === 'signup');
    signInBtn?.classList.toggle('active', panel === 'signin');
    signUpBtn?.classList.toggle('active', panel === 'signup');
}

function showStage(stage) {
    document.querySelectorAll('.form-step').forEach((step) => {
        step.classList.toggle('active', step.id === `stage${stage}`);
    });
    currentStage = stage;
}

function bindButtons() {
    if (!signInBtn || !signUpBtn || !registerForm || !signInForm) {
        console.warn('Registration UI not fully loaded yet.');
    }

    signInBtn?.addEventListener('click', () => showPanel('signin'));
    signUpBtn?.addEventListener('click', () => showPanel('signup'));

    const stage1Next = document.querySelector('#stage1 .next-btn');
    if (!stage1Next) console.warn('Stage 1 Next button not found');
    stage1Next?.addEventListener('click', () => nextStage(1));

    const stage2Prev = document.querySelector('#stage2 .prev-btn');
    if (!stage2Prev) console.warn('Stage 2 Previous button not found');
    stage2Prev?.addEventListener('click', () => prevStage(2));

    const stage2Next = document.querySelector('#stage2 .next-btn');
    if (!stage2Next) console.warn('Stage 2 Next button not found');
    stage2Next?.addEventListener('click', () => nextStage(2));

    const stage3Prev = document.querySelector('#stage3 .prev-btn');
    if (!stage3Prev) console.warn('Stage 3 Previous button not found');
    stage3Prev?.addEventListener('click', () => prevStage(3));
}

function sanitizeInput(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function nextStage(stage) {
    if (stage === 1) {
        const staffName = registerForm.querySelector('#register-staff-name');
        const staffId = registerForm.querySelector('#register-staff-id');
        const staffEmail = registerForm.querySelector('#register-staff-email');
        if (!staffName?.value.trim() || !staffId?.value.trim() || !staffEmail?.value.trim()) {
            alert('Please fill in the teaching staff name, ID, and email.');
            return;
        }
    }

    if (stage === 2) {
        const password = registerForm.querySelector('#register-password');
        const confirmPassword = registerForm.querySelector('#confirm-password');
        if (!password?.value || !confirmPassword?.value) {
            alert('Please fill in both password fields.');
            return;
        }
        if (password.value !== confirmPassword.value) {
            alert('Confirmed passwords do not match.');
            return;
        }
    }

    const next = Math.min(totalStages, stage + 1);
    showStage(next);
}

function getFormFields() {
    return {
        staffName: registerForm.querySelector('#register-staff-name')?.value.trim(),
        staffId: registerForm.querySelector('#register-staff-id')?.value.trim(),
        password: registerForm.querySelector('#register-password')?.value,
        confirmPassword: registerForm.querySelector('#confirm-password')?.value,
        agreementChecked: registerForm.querySelector('#agree')?.checked,
        userId: signInForm.querySelector('#login-staff-id')?.value.trim(),
        loginPassword: signInForm.querySelector('#login-password')?.value,
    };
}

function validateRegister(event) {
    event.preventDefault();
    const fields = getFormFields();

    if (!fields.staffName || !fields.staffId) {
        showStage(1);
        alert('Please fill in the teaching staff name and ID.');
        return;
    }

    if (!fields.password || !fields.confirmPassword) {
        showStage(2);
        alert('Please fill in both password fields.');
        return;
    }

    if (fields.password !== fields.confirmPassword) {
        showStage(2);
        alert('Confirmed passwords do not match.');
        return;
    }

    if (!fields.agreementChecked) {
        showStage(3);
        alert('Please agree to the Terms and Conditions.');
        return;
    }

    const safeStaffName = sanitizeInput(fields.staffName);
    const safeStaffId = sanitizeInput(fields.staffId);
    console.log('Registering staff:', safeStaffName, safeStaffId);

    alert('Registration successful!');
    registerForm.reset();
    showStage(1);
    showPanel('signin');
}

function validateLogin(event) {
    event.preventDefault();
    const fields = getFormFields();

    if (!fields.userId || !fields.loginPassword) {
        alert('Please fill in all fields.');
        return;
    }

    const safeUserId = sanitizeInput(fields.userId);
    console.log('Login attempt for user:', safeUserId);

    alert('Login successful!');
}

registerForm?.addEventListener('submit', validateRegister);
signInForm?.addEventListener('submit', validateLogin);

window.addEventListener('DOMContentLoaded', () => {
    bindButtons();
    showPanel('signin');
});
