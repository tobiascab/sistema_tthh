$url = "http://localhost:8090/api/v1/documentos/subir"
$filePath = "c:\SISTEMA_TTHH_V2\prueba.txt"
$metadata = '{"empleadoId": 2, "categoria": "PERSONAL", "nombre": "Prueba.txt", "descripcion": "Documento de prueba"}'

$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$fileHeader = "--$boundary$LF" +
              "Content-Disposition: form-data; name=`"file`"; filename=`"prueba.txt`"$LF" +
              "Content-Type: text/plain$LF$LF"
$fileFooter = "$LF"

$metadataHeader = "--$boundary$LF" +
                  "Content-Disposition: form-data; name=`"metadata`"$LF$LF" +
                  "$metadata$LF"

$footer = "--$boundary--$LF"

$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($fileHeader) +
             $fileBytes +
             [System.Text.Encoding]::UTF8.GetBytes($fileFooter + $metadataHeader + $footer)

try {
    $request = [System.Net.HttpWebRequest]::Create($url)
    $request.Method = "POST"
    $request.ContentType = "multipart/form-data; boundary=$boundary"
    $request.ContentLength = $bodyBytes.Length
    
    $stream = $request.GetRequestStream()
    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
    $stream.Close()

    $response = $request.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
    $responseText = $reader.ReadToEnd()
    
    Write-Host "Response: $responseText"
} catch {
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Details: $($reader.ReadToEnd())"
    }
}
