param(
    [string] $MinecraftInstall = "$env:USERPROFILE\curseforge\minecraft\Install",
    [string] $InstanceDir = "$env:USERPROFILE\curseforge\minecraft\Instances\tfm default",
    [string] $Version = "1.4.0"
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Classes = Join-Path $Root "build\classes"
$Libs = Join-Path $Root "build\libs"
$JarOut = Join-Path $Libs "tfc-saltwater-shim-$Version.jar"
$ModsDir = Join-Path $InstanceDir "mods"

function FirstPath([string] $Pattern, [string] $Label) {
    $Match = Get-ChildItem -Path $Pattern -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
    if (-not $Match) {
        throw "Could not find $Label at pattern: $Pattern"
    }
    return $Match.FullName
}

$ClientJar = FirstPath (Join-Path $MinecraftInstall "libraries\net\minecraft\client\1.21.1-*\client-1.21.1-*-srg.jar") "Minecraft 1.21.1 client SRG jar"
$NeoForgeJar = FirstPath (Join-Path $MinecraftInstall "libraries\net\neoforged\neoforge\21.1.*\neoforge-21.1.*-universal.jar") "NeoForge universal jar"
$LoaderJar = FirstPath (Join-Path $MinecraftInstall "libraries\net\neoforged\fancymodloader\loader\*\loader-*.jar") "FancyModLoader jar"
$MergeToolJar = FirstPath (Join-Path $MinecraftInstall "libraries\net\neoforged\mergetool\*\mergetool-*-api.jar") "MergeTool API jar"
$MixinJar = FirstPath (Join-Path $MinecraftInstall "libraries\org\spongepowered\mixin\*\mixin-*.jar") "Mixin jar"
$DfuJar = FirstPath (Join-Path $MinecraftInstall "libraries\com\mojang\datafixerupper\*\datafixerupper-*.jar") "DataFixerUpper jar"
$TfcJar = FirstPath (Join-Path $ModsDir "TerraFirmaCraft-NeoForge-1.21.1-4.2.0.jar") "TerraFirmaCraft 4.2.0 jar"

Remove-Item -LiteralPath $Classes -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $JarOut -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $Classes, $Libs | Out-Null

$Classpath = @(
    $ClientJar,
    $NeoForgeJar,
    $LoaderJar,
    $MergeToolJar,
    $MixinJar,
    $DfuJar,
    $TfcJar
) -join ";"

$Sources = Get-ChildItem -Path (Join-Path $Root "src\main\java") -Filter "*.java" -Recurse | ForEach-Object { $_.FullName }
javac -proc:none --release 21 -cp $Classpath -d $Classes @Sources
if ($LASTEXITCODE -ne 0) {
    throw "javac failed with exit code $LASTEXITCODE"
}

Copy-Item -Path (Join-Path $Root "src\main\resources\*") -Destination $Classes -Recurse -Force
jar --create --file $JarOut -C $Classes .
if ($LASTEXITCODE -ne 0) {
    throw "jar failed with exit code $LASTEXITCODE"
}

Write-Host "Built $JarOut"
