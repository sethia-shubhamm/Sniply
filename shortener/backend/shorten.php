<?php
session_start();
header('Content-Type: application/json');

try {
    require_once __DIR__ . '/config.php';
    
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['url']) || empty($input['url'])) {
        echo json_encode(['success' => false, 'message' => 'URL is required']);
        exit;
    }

    $originalUrl = filter_var($input['url'], FILTER_SANITIZE_URL);

    if (!filter_var($originalUrl, FILTER_VALIDATE_URL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid URL format']);
        exit;
    }

    function generateShortCode($length = 6) {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        $shortCode = '';
        for ($i = 0; $i < $length; $i++) {
            $shortCode .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $shortCode;
    }

    $conn = getDBConnection();
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

    if ($userId) {
        $stmt = $conn->prepare("SELECT short_code FROM links WHERE original_url = ? AND user_id = ?");
        $stmt->bind_param("si", $originalUrl, $userId);
    } else {
        $stmt = $conn->prepare("SELECT short_code FROM links WHERE original_url = ? AND user_id IS NULL");
        $stmt->bind_param("s", $originalUrl);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $shortCode = $row['short_code'];
    } else {
        do {
            $shortCode = generateShortCode();
            $stmt = $conn->prepare("SELECT id FROM links WHERE short_code = ?");
            $stmt->bind_param("s", $shortCode);
            $stmt->execute();
            $result = $stmt->get_result();
        } while ($result->num_rows > 0);

        if ($userId) {
            $stmt = $conn->prepare("INSERT INTO links (user_id, short_code, original_url) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $userId, $shortCode, $originalUrl);
        } else {
            $stmt = $conn->prepare("INSERT INTO links (short_code, original_url) VALUES (?, ?)");
            $stmt->bind_param("ss", $shortCode, $originalUrl);
        }
        
        if (!$stmt->execute()) {
            echo json_encode(['success' => false, 'message' => 'Failed to create short link']);
            $conn->close();
            exit;
        }
    }

    $shortUrl = BASE_URL . $shortCode;

    echo json_encode([
        'success' => true,
        'short_url' => $shortUrl,
        'short_code' => $shortCode,
        'original_url' => $originalUrl
    ]);

    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
