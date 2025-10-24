# 🔗 Sniply - URL Shortener

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
