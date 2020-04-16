$ErrorActionPreference = "SilentlyContinue";
$IsRunning = Invoke-Expression "docker inspect -f '{{.State.Running}}' bc-redis"
$ErrorActionPreference = "Continue";

if($IsRunning -eq "true"){
    Write-Host "Redis container is already running" -ForegroundColor Green
}
else {
    Write-Host "Redis container not running"
    docker run --rm --name bc-redis -p 6379:6379 -d redis > $null
    Write-Host "Redis container now running" -ForegroundColor Green
}
