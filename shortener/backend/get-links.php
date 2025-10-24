<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

$conn = getDBConnection();

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT id, short_code, original_url, clicks, status, created_at 
                            FROM links 
                            WHERE user_id = ?
                            ORDER BY created_at DESC 
                            LIMIT 50");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    echo json_encode(['success' => true, 'links' => []]);
    $conn->close();
    exit;
}

$links = [];
while ($row = $result->fetch_assoc()) {
    $links[] = [
        'id' => $row['id'],
        'short_url' => BASE_URL . $row['short_code'],
        'short_code' => $row['short_code'],
        'original_url' => $row['original_url'],
        'clicks' => $row['clicks'],
        'status' => $row['status'],
        'created_at' => $row['created_at']
    ];
}

echo json_encode(['success' => true, 'links' => $links]);

$stmt->close();
$conn->close();
?>
