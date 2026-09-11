$files = Get-ChildItem -Path .\src -Recurse -Include *.ts,*.tsx

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $original = $content

    $content = $content -replace '@/generated/prisma/enums', '@/generated/prisma'
    $content = $content -replace '@/generated/prisma/client', '@/generated/prisma'
    $content = $content -replace '\.\./generated/prisma/client', '../generated/prisma'
    $content = $content -replace '\.\./\.\./generated/prisma/client', '../../generated/prisma'

    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}