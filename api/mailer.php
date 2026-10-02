<?php
declare(strict_types=1);

function smtp_read_response($socket): string
{
    $response = '';
    while ($line = fgets($socket, 515)) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }

    return $response;
}

function smtp_expect($socket, array $codes): bool
{
    $response = smtp_read_response($socket);
    $code = (int) substr($response, 0, 3);

    return in_array($code, $codes, true);
}

function smtp_command($socket, string $command, array $expectedCodes): bool
{
    fwrite($socket, $command . "\r\n");

    return smtp_expect($socket, $expectedCodes);
}

function smtp_send_mail(array $config, string $to, string $subject, string $body, string $replyToEmail, string $replyToName): bool
{
    $host = (string) ($config['smtp_host'] ?? '');
    $port = (int) ($config['smtp_port'] ?? 465);
    $user = (string) ($config['smtp_user'] ?? '');
    $pass = (string) ($config['smtp_pass'] ?? '');
    $fromEmail = (string) ($config['from_email'] ?? $user);
    $fromName = (string) ($config['from_name'] ?? 'Website');

    if ($host === '' || $user === '' || $pass === '') {
        return false;
    }

    $socket = @stream_socket_client(
        "ssl://{$host}:{$port}",
        $errno,
        $errstr,
        30,
        STREAM_CLIENT_CONNECT,
        stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'allow_self_signed' => false,
            ],
        ])
    );

    if (!$socket) {
        return false;
    }

    stream_set_timeout($socket, 30);

    if (!smtp_expect($socket, [220])) {
        fclose($socket);
        return false;
    }

    $hostname = gethostname() ?: 'localhost';
    if (
        !smtp_command($socket, "EHLO {$hostname}", [250])
        || !smtp_command($socket, 'AUTH LOGIN', [334])
        || !smtp_command($socket, base64_encode($user), [334])
        || !smtp_command($socket, base64_encode($pass), [235])
        || !smtp_command($socket, "MAIL FROM:<{$fromEmail}>", [250])
        || !smtp_command($socket, "RCPT TO:<{$to}>", [250, 251])
        || !smtp_command($socket, 'DATA', [354])
    ) {
        fclose($socket);
        return false;
    }

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $encodedReplyName = '=?UTF-8?B?' . base64_encode($replyToName) . '?=';

    $message = implode("\r\n", [
        "From: {$encodedFromName} <{$fromEmail}>",
        "To: <{$to}>",
        "Reply-To: {$encodedReplyName} <{$replyToEmail}>",
        "Subject: {$encodedSubject}",
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'Date: ' . date('r'),
        '',
        $body,
        '',
    ]);

    fwrite($socket, $message . "\r\n.\r\n");

    if (!smtp_expect($socket, [250])) {
        fclose($socket);
        return false;
    }

    smtp_command($socket, 'QUIT', [221]);
    fclose($socket);

    return true;
}

function php_mail_send(array $config, string $to, string $subject, string $body, string $replyToEmail, string $replyToName): bool
{
    $fromEmail = (string) ($config['from_email'] ?? 'contactus@aalphaleo.com');
    $fromName = (string) ($config['from_name'] ?? 'Website');

    ini_set('sendmail_from', $fromEmail);

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $replyToName . ' <' . $replyToEmail . '>',
    ];

    return @mail(
        $to,
        $subject,
        $body,
        implode("\r\n", $headers),
        '-f' . $fromEmail
    );
}

function deliver_contact_mail(array $config, string $to, string $subject, string $body, string $replyToEmail, string $replyToName): bool
{
    if (!empty($config['smtp_pass'])) {
        return smtp_send_mail($config, $to, $subject, $body, $replyToEmail, $replyToName);
    }

    return php_mail_send($config, $to, $subject, $body, $replyToEmail, $replyToName);
}
