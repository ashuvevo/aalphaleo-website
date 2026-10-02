<?php
declare(strict_types=1);

/**
 * Copy to config.php and set your Hostinger mailbox password.
 * In hPanel: Emails → contactus@aalphaleo.com → use that account password for smtp_pass.
 */
return [
    'recipient_email' => 'contactus@aalphaleo.com',
    'from_email' => 'contactus@aalphaleo.com',
    'from_name' => 'Aalphaleo Website',

    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 465,
    'smtp_user' => 'contactus@aalphaleo.com',
    'smtp_pass' => '', // Required on Hostinger — set after upload in out/api/config.php
];
