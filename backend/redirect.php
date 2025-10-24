<?php
require_once __DIR__ . '/config.php';

// Get the short code from URL
$shortCode = isset($_GET['code']) ? $_GET['code'] : '';

if (empty($shortCode)) {
    header('Location: index.html');
    exit;
}

$conn = getDBConnection();

// Get original URL and update click count
$stmt = $conn->prepare("SELECT original_url, status FROM links WHERE short_code = ?");
$stmt->bind_param("s", $shortCode);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    if ($row['status'] === 'active') {
        // Update click count
        $updateStmt = $conn->prepare("UPDATE links SET clicks = clicks + 1 WHERE short_code = ?");
        $updateStmt->bind_param("s", $shortCode);
        $updateStmt->execute();
        $updateStmt->close();
        
        // Redirect to original URL
        header('Location: ' . $row['original_url']);
    } else {
        echo "This link has been deactivated.";
    }
} else {
    echo "Link not found.";
}

$stmt->close();
$conn->close();
?>
