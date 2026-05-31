# Mini serveur HTTP statique pour preview GéoWatch
$port = 3333
$root = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port"

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.ico'  = 'image/x-icon'
  '.txt'  = 'text/plain; charset=utf-8'
  '.md'   = 'text/markdown; charset=utf-8'
  '.webmanifest' = 'application/manifest+json; charset=utf-8'
}

try {
  while ($listener.IsListening) {
    try {
      $ctx = $listener.GetContext()
      $req = $ctx.Request
      $res = $ctx.Response
      $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
      if ($path -eq '/') { $path = '/index.html' }
      $file = Join-Path $root $path.TrimStart('/')

      Write-Host "$($req.HttpMethod) $path"

      if (Test-Path $file -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $bytes = [IO.File]::ReadAllBytes($file)
        $res.ContentType = $ct
        $res.ContentLength64 = $bytes.Length
        $res.AddHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        if ($req.HttpMethod -ne 'HEAD' -and $bytes.Length -gt 0) {
          $res.OutputStream.Write($bytes, 0, $bytes.Length)
        }
      } else {
        $res.StatusCode = 404
        if ($req.HttpMethod -ne 'HEAD') {
          $msg = [Text.Encoding]::UTF8.GetBytes("Not Found: $path")
          $res.ContentLength64 = $msg.Length
          $res.OutputStream.Write($msg, 0, $msg.Length)
        }
      }
      $res.Close()
    } catch {
      Write-Host "Error: $_"
      try { $res.Close() } catch {}
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
