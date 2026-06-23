# TFC Salt Water Shim

Compatibility shim for a Minecraft 1.21.1 NeoForge TerraFirmaCraft addon pack.

This mod is intentionally small and does not patch downloaded mod jars on disk. It uses a separate NeoForge mod jar with Mixins, a coremod runtime transform, and a data override.

## What It Fixes

- TerraFirmaCraft 4.2.0 early `tfc:salt_water` `DeferredHolder` access during block-state cache baking.
- TerraFirmaCraft registry holders that are queried during addon registration before their `DeferredHolder` is bound.
- Beneath code compiled against the older `RockSpikeBlock(Properties)` constructor by adding that constructor at runtime only.
- Beneath worldgen configured feature data that references the removed `tfc:geode` feature type.

## Target Versions

- Minecraft `1.21.1`
- NeoForge `21.1.x`
- TerraFirmaCraft `4.2.0`
- Beneath versions compiled against TFC APIs from before the `RockSpikeBlock(Properties, Supplier)` constructor change.

## Build

This repo currently uses a simple PowerShell build script instead of a Gradle project. It compiles against the jars in a local CurseForge Minecraft install and does not vendor Minecraft, NeoForge, TFC, or any other mod jar.

```powershell
.\scripts\build.ps1
```

By default the script looks for:

```text
%USERPROFILE%\curseforge\minecraft\Install
%USERPROFILE%\curseforge\minecraft\Instances\tfm default
```

Override those paths when needed:

```powershell
.\scripts\build.ps1 -MinecraftInstall "C:\path\to\minecraft\Install" -InstanceDir "C:\path\to\instance"
```

The built jar is written to `build\libs`.

## Install

Copy the built jar into the modpack's `mods` folder alongside TerraFirmaCraft and Beneath.

Do not remove the real mods this shim supports. This jar only supplies compatibility glue.
