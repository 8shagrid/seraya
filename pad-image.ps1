Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile('b:\10_DEVELOPMENT\projects\seraya\assets\img\logo.png')
$size = [Math]::Max($src.Width, $src.Height)
$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$x = ($size - $src.Width) / 2
$y = ($size - $src.Height) / 2
$g.DrawImage($src, $x, $y, $src.Width, $src.Height)
$bmp.Save('b:\10_DEVELOPMENT\projects\seraya\assets\img\favicon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$src.Dispose()
