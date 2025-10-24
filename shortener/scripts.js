
document.getElementById('shortenBtn').addEventListener('click', function() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    
    if (!url) {
        showNotification('Please enter a URL', 'error');
        return;
    }
    
    if (!isValidURL(url)) {
        showNotification('Please enter a valid URL', 'error');
        return;
    }
    
    // Call PHP backend to shorten URL
    fetch('backend/shorten.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(text => {
        try {
            const data = JSON.parse(text);
            if (data.success) {
                addLinkToTable(data.original_url, data.short_url, data.short_code);
                urlInput.value = '';
                showNotification('Link shortened successfully!', 'success');
            } else {
                showNotification(data.message || 'Failed to shorten URL', 'error');
            }
        } catch (e) {
            console.error('JSON Parse Error:', text);
            showNotification('Server error occurred', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to shorten URL', 'error');
    });
});

// Handle Enter key press in input
document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('shortenBtn').click();
    }
});

// Copy short link functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-copy')) {
        const row = e.target.closest('tr');
        const shortLink = row.querySelector('.short-link span').textContent;
        
        navigator.clipboard.writeText(shortLink)
            .then(() => {
                showNotification('Link copied to clipboard!', 'success');
                
                // Visual feedback
                const btn = e.target.closest('.btn-copy');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.color = '#10b981';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.color = '';
                }, 2000);
            })
            .catch(() => {
                showNotification('Failed to copy link', 'error');
            });
    }
});

// Open link in new tab
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-icon') && !e.target.closest('.btn-icon').classList.contains('disabled')) {
        const row = e.target.closest('tr');
        const originalLink = row.querySelector('.original-link span').textContent;
        window.open(originalLink, '_blank');
    }
});


// Helper Functions

function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function addLinkToTable(originalUrl, shortUrl, shortCode) {
    const tbody = document.getElementById('linksTableBody');
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
    }).replace(',', ' -');
    
    // Extract domain for favicon
    let domain = '';
    try {
        const url = new URL(originalUrl);
        domain = url.hostname;
    } catch (e) {
        domain = 'example.com';
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="short-link">
                <span>${shortUrl}</span>
                <button class="btn-copy" title="Copy">
                    <i class="far fa-copy"></i>
                </button>
            </div>
        </td>
        <td>
            <div class="original-link">
                <img src="https://www.google.com/s2/favicons?domain=${domain}" alt="favicon" class="favicon">
                <span>${originalUrl}</span>
            </div>
        </td>
        <td class="clicks">0</td>
        <td>
            <div class="status">
                <span class="status-badge active">Active</span>
                <button class="btn-icon" title="Open link">
                    <i class="fas fa-external-link-alt"></i>
                </button>
            </div>
        </td>
        <td class="date">${dateStr}</td>
    `;
    
    // Add fade-in animation
    row.style.opacity = '0';
    tbody.insertBefore(row, tbody.firstChild);
    
    setTimeout(() => {
        row.style.transition = 'opacity 0.5s ease';
        row.style.opacity = '1';
    }, 10);
}

// Load existing links on page load
function loadExistingLinks() {
    fetch('backend/get-links.php')
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (!data.success) return;
                if (data.links && data.links.length > 0) {
                    data.links.forEach(link => {
                    const date = new Date(link.created_at);
                    const dateStr = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: '2-digit', 
                        year: 'numeric' 
                    }).replace(',', ' -');
                    
                    let domain = '';
                    try {
                        const url = new URL(link.original_url);
                        domain = url.hostname;
                    } catch (e) {
                        domain = 'example.com';
                    }
                    
                    const tbody = document.getElementById('linksTableBody');
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <div class="short-link">
                                <span>${link.short_url}</span>
                                <button class="btn-copy" title="Copy">
                                    <i class="far fa-copy"></i>
                                </button>
                            </div>
                        </td>
                        <td>
                            <div class="original-link">
                                <img src="https://www.google.com/s2/favicons?domain=${domain}" alt="favicon" class="favicon">
                                <span>${link.original_url}</span>
                            </div>
                        </td>
                        <td class="clicks">${link.clicks}</td>
                        <td>
                            <div class="status">
                                <span class="status-badge ${link.status}">${link.status.charAt(0).toUpperCase() + link.status.slice(1)}</span>
                                <button class="btn-icon ${link.status === 'inactive' ? 'disabled' : ''}" title="Open link">
                                    <i class="fas ${link.status === 'active' ? 'fa-external-link-alt' : 'fa-ban'}"></i>
                                </button>
                            </div>
                        </td>
                        <td class="date">${dateStr}</td>
                    `;
                    tbody.appendChild(row);
                    });
                }
            } catch (e) {
                console.error('JSON Parse Error:', text);
            }
        })
        .catch(error => {
            console.error('Error loading links:', error);
        });
}

function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3366ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auth Modal Management
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// Open modals
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});

registerBtn.addEventListener('click', () => {
    registerModal.classList.add('active');
});

// Close modals
closeLoginModal.addEventListener('click', () => {
    loginModal.classList.remove('active');
});

closeRegisterModal.addEventListener('click', () => {
    registerModal.classList.remove('active');
});

// Close on background click
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }
});

registerModal.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        registerModal.classList.remove('active');
    }
});

// Switch between modals
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    registerModal.classList.add('active');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.remove('active');
    loginModal.classList.add('active');
});

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            loginModal.classList.remove('active');
            updateUIForLoggedInUser(data.user);
            loadExistingLinks();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Login failed', 'error');
    }
});

// Handle Registration
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch('backend/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            registerModal.classList.remove('active');
            updateUIForLoggedInUser(data.user);
            loadExistingLinks();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Registration failed', 'error');
    }
});

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const navButtons = document.getElementById('navButtons');
    navButtons.innerHTML = `
        <div class="user-menu">
            <div class="user-info">
                <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                <span class="user-name">${user.username}</span>
            </div>
            <button class="btn-logout" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    `;
    
    // Add logout handler
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Handle Logout
async function handleLogout() {
    try {
        const response = await fetch('backend/logout.php');
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            // Clear the table
            document.getElementById('linksTableBody').innerHTML = '';
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    } catch (error) {
        showNotification('Logout failed', 'error');
    }
}

// Check session on page load
async function checkSession() {
    try {
        const response = await fetch('backend/check-session.php');
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            if (data.success && data.loggedIn) {
                updateUIForLoggedInUser(data.user);
            }
        } catch (e) {
            console.error('Session check JSON parse error:', text);
        }
    } catch (error) {
        console.error('Session check failed:', error);
    }
}

// Initialize
console.log('Sniply URL Shortener initialized!');
checkSession();
loadExistingLinks();
