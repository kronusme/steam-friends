<?php

set_time_limit(0);

$url = (string)$_POST['url'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_ENCODING , "gzip");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// Ignore SSL warnings and questions
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

$r = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
echo $r;