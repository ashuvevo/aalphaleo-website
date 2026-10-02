<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
$config = file_exists($configPath)
    ? require $configPath
    : require __DIR__ . '/config.example.php';

require_once __DIR__ . '/mailer.php';

$recipientEmail = (string) ($config['recipient_email'] ?? 'contactus@aalphaleo.com');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

function read_payload(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw ?: '', true);
        return is_array($data) ? $data : [];
    }

    return $_POST;
}

function sanitize_field(string $value, int $maxLength = 5000): string
{
    $value = trim($value);
    if (strlen($value) > $maxLength) {
        $value = substr($value, 0, $maxLength);
    }

    return str_replace(["\r", "\n"], ' ', $value);
}

function sanitize_header_value(string $value, int $maxLength = 200): string
{
    $value = trim($value);
    if (strlen($value) > $maxLength) {
        $value = substr($value, 0, $maxLength);
    }

    return str_replace(["\r", "\n"], '', $value);
}

$data = read_payload();

if (!empty($data['_honeypot'])) {
    echo json_encode(['success' => true]);
    exit;
}

$name = sanitize_header_value((string) ($data['name'] ?? ''), 120);
$email = sanitize_header_value((string) ($data['email'] ?? ''), 200);
$phone = sanitize_field((string) ($data['phone'] ?? ''), 40);
$service = sanitize_field((string) ($data['service'] ?? ''), 120);
$message = trim((string) ($data['message'] ?? ''));

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields correctly.']);
    exit;
}

if (strlen($message) > 5000) {
    $message = substr($message, 0, 5000);
}

if (empty($config['smtp_pass'])) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'message' => 'Contact form email is not configured yet. Please email ' . $recipientEmail . ' directly.',
    ]);
    exit;
}

$subject = 'New website enquiry from ' . $name;
$bodyLines = [
    'You received a new enquiry from the Aalphaleo website contact form.',
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'Phone: ' . ($phone !== '' ? $phone : 'Not provided'),
    'Service: ' . ($service !== '' ? $service : 'Not specified'),
    '',
    'Message:',
    $message,
    '',
    'Submitted at: ' . gmdate('Y-m-d H:i:s') . ' UTC',
    'IP address: ' . sanitize_header_value($_SERVER['REMOTE_ADDR'] ?? 'unknown', 45),
];

$sent = deliver_contact_mail(
    $config,
    $recipientEmail,
    $subject,
    implode("\r\n", $bodyLines),
    $email,
    $name
);

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to send your message right now. Please email ' . $recipientEmail . ' directly.',
    ]);
    exit;
}

echo json_encode(['success' => true]);
