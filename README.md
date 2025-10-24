# 🔗 Sniply - URL Shortener

A modern, beautiful URL shortening service built with PHP, MySQL, and vanilla JavaScript. Shorten your long URLs into easy-to-share short links with click tracking and user management.

![Sniply](https://img.shields.io/badge/version-1.0.0-blue)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange)

## ✨ Features

- 🎨 **Beautiful Dark Theme UI** - Modern glassmorphism design with gradient accents
- 🔗 **URL Shortening** - Convert long URLs into short, shareable links
- 📊 **Click Tracking** - Monitor how many times your links are clicked
- 👤 **User Authentication** - Register and login to manage your links
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🎯 **User-Specific Links** - Each user sees only their own shortened URLs
- ⚡ **Fast & Lightweight** - No heavy frameworks, pure vanilla JavaScript

## 🚀 How It Works

1. **Shorten a URL**: Paste any long URL into the input field and click "Shorten Now!"
2. **Get Short Link**: Receive a short link like `localhost/shortener/abc123`
3. **Share**: Copy and share your short link anywhere
4. **Track Clicks**: See how many people clicked your link
5. **Manage**: View all your shortened links in one place

## 📋 Prerequisites

Before running this project, make sure you have:

- **XAMPP** (or any PHP server with MySQL)
  - PHP 7.4 or higher
  - MySQL 5.7 or higher
  - Apache Server

## 🛠️ Installation & Setup

### Step 1: Download XAMPP
If you don't have XAMPP installed:
1. Download from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Install XAMPP on your computer
3. Start **Apache** and **MySQL** from XAMPP Control Panel

### Step 2: Clone/Download Project
1. Copy the `shortener` folder to your XAMPP's `htdocs` directory
   - Usually located at: `C:\xampp\htdocs\` (Windows) or `/Applications/XAMPP/htdocs/` (Mac)

### Step 3: Configure Database (Optional)
The database will be created automatically, but if you want to customize:

1. Open `backend/config.php`
2. Update these settings if needed:
```php
define('DB_HOST', 'localhost');     // Database host
define('DB_USER', 'root');          // Database username
define('DB_PASS', '');              // Database password (empty by default)
define('DB_NAME', 'url_shortener'); // Database name
define('BASE_URL', 'http://localhost/shortener/'); // Your project URL
```

### Step 4: Run the Project
1. Make sure Apache and MySQL are running in XAMPP
2. Open your web browser
3. Go to: `http://localhost/shortener/`
4. That's it! The database will be created automatically on first run
