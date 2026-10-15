<?php
/**
 * Script de procesamiento de cotizaciones para Electroflash
 * Maneja campos de texto y múltiples archivos adjuntos
 */

// 1. Configuración del correo
$destinatario = "electroflashperu@gmail.com";
$asunto = "⚡ Nueva Solicitud de Cotización Técnica - Electroflash";

// 2. Validar que la solicitud sea POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanear entradas para evitar inyecciones
    $fullName   = filter_var($_POST['fullName'], FILTER_SANITIZE_STRING);
    $company    = filter_var($_POST['company'], FILTER_SANITIZE_STRING) ?: 'No especificada';
    $docType    = filter_var($_POST['docType'], FILTER_SANITIZE_STRING);
    $docNumber  = filter_var($_POST['docNumber'], FILTER_SANITIZE_STRING);
    $phone      = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
    $email      = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $serviceType = filter_var($_POST['serviceType'], FILTER_SANITIZE_STRING);
    $details    = filter_var($_POST['details'], FILTER_SANITIZE_STRING);

    // 3. Construir el cuerpo del mensaje
    $cuerpo = "Has recibido una nueva solicitud de cotización desde la Landing Page:\n\n";
    $cuerpo .= "--------------------------------------------------\n";
    $cuerpo .= "CLIENTE: $fullName\n";
    $cuerpo .= "EMPRESA: $company\n";
    $cuerpo .= "DOCUMENTO: $docType - $docNumber\n";
    $cuerpo .= "TELÉFONO: $phone\n";
    $cuerpo .= "CORREO: $email\n";
    $cuerpo .= "SERVICIO: $serviceType\n";
    $cuerpo .= "--------------------------------------------------\n";
    $cuerpo .= "DETALLES TÉCNICOS:\n$details\n";
    $cuerpo .= "--------------------------------------------------\n";

    // 4. Configurar cabeceras para correo con adjuntos (MIME)
    $boundary = md5(time());
    $headers = "From: no-reply@electroflash.pe\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // Cuerpo del mensaje en el MIME
    $message = "--$boundary\r\n";
    $message .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
    $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $message .= $cuerpo . "\r\n";

    // 5. Procesar archivos adjuntos
    if (isset($_FILES['attachments'])) {
        $files = $_FILES['attachments'];

        // Recorrer cada archivo subido
        foreach ($files['name'] as $key => $name) {
            if ($files['error'][$key] == 0) {
                $fileTmpPath = $files['tmp_name'][$key];
                $fileType = $files['type'][$key];
                $fileData = file_get_contents($fileTmpPath);
                $encodedFile = chunk_split(base64_encode($fileData));

                $message .= "--$boundary\r\n";
                $message .= "Content-Type: $fileType; name=\"$name\"\r\n";
                $message .= "Content-Disposition: attachment; filename=\"$name\"\r\n";
                $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
                $message .= $encodedFile . "\r\n";
            }
        }
    }

    $message .= "--$boundary--";

    // 6. Enviar el correo
    if (mail($destinatario, $asunto, $message, $headers)) {
        // Redirigir a una página de éxito (puedes crear una gracias.html)
        echo "<script>alert('Solicitud enviada con éxito. Nos contactaremos pronto.'); window.location.href='/index.html';</script>";
    } else {
        echo "<script>alert('Error al enviar el correo. Por favor intente más tarde.'); window.history.back();</script>";
    }

} else {
    // Si alguien intenta acceder al archivo directamente
    header("Location: index.html");
    exit;
}
?>
