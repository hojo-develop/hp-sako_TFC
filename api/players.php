<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(503);
    echo json_encode(['message' => 'microCMS is not configured. Copy config.sample.php to config.php and set credentials.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$config = require $configFile;
$domain = preg_replace('/[^a-zA-Z0-9-]/', '', (string)($config['service_domain'] ?? ''));
$endpoint = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($config['endpoint'] ?? 'players'));
$apiKey = (string)($config['api_key'] ?? '');

if ($domain === '' || $apiKey === '') {
    http_response_code(503);
    echo json_encode(['message' => 'microCMS configuration is incomplete.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = isset($_GET['id']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$_GET['id']) : '';
$topOnly = isset($_GET['top']) && $_GET['top'] === '1';

$base = "https://{$domain}.microcms.io/api/v1/{$endpoint}";
if ($id !== '') {
    $url = $base . '/' . rawurlencode($id);
} else {
    $query = [
        'limit' => $topOnly ? 4 : 100,
        'orders' => '-publishedAt',
    ];
    if ($topOnly) {
        $query['filters'] = 'showOnTop[equals]true';
    }
    $url = $base . '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => [
        'X-MICROCMS-API-KEY: ' . $apiKey,
        'Accept: application/json',
    ],
]);
$body = curl_exec($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($body === false || $status < 200 || $status >= 300) {
    http_response_code($status >= 400 ? $status : 502);
    echo json_encode(['message' => 'Failed to fetch microCMS.', 'detail' => $error], JSON_UNESCAPED_UNICODE);
    exit;
}

echo $body;
