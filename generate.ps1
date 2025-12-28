param([string]$Name = "file")

New-Item -ItemType Directory -Force -Name $Name
New-Item -ItemType File -Force -Path "$Name\$Name.schema.ts"
New-Item -ItemType File -Force -Path "$Name\$Name.controller.ts"
New-Item -ItemType File -Force -Path "$Name\$Name.service.ts"
New-Item -ItemType File -Force -Path "$Name\$Name.route.ts"

Write-Output "Carpeta y archivos creados en $Name\"
