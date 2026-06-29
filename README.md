# TFC/Beneath Compatibility Shim

Compatibility shim for a Minecraft 1.21.1 NeoForge TerraFirmaCraft addon pack.

This mod is intentionally small and does not patch downloaded mod jars on disk. It uses a separate NeoForge mod jar with Mixins, a coremod runtime transform, and a data override.

## What It Fixes

- TerraFirmaCraft 4.2.x early `tfc:salt_water` `DeferredHolder` access during block-state cache baking.
- TerraFirmaCraft registry holders that are queried during addon registration before their `DeferredHolder` is bound.
- Beneath `2.0.1` and `2.0.2` for NeoForge 1.21.1.
- The Beneath `2.0.1` `NoSuchMethodError` for `RockSpikeBlock(BlockBehaviour.Properties)` by adding that legacy constructor at runtime only.
- The Beneath `2.0.2` `NoSuchMethodError` for `TFCLeavesBlock(ExtendedProperties, int, Supplier, Supplier)` by adding that legacy constructor at runtime only.
- The Beneath `2.0.1` worldgen configured feature data that references the removed `tfc:geode` feature type.
- TerraFirmaCraft `4.2.x` new-world creation stalls caused by the default `spawn_distance: 4000` initial spawn-biome search. The shim caps that runtime search distance at 512 blocks so world creation can finish without generating distant region data up front.

## Target Versions

- Minecraft `1.21.1`
- NeoForge `21.1.x`
- TerraFirmaCraft `4.2.0`, `4.2.1`, and `4.2.4`
- Beneath `2.0.1` / `Beneath-NeoForge-1.21.1-2.0.1.jar`
- Beneath `2.0.2` / `Beneath-NeoForge-1.21.1-2.0.2.jar`

Other Beneath versions may work if they hit the same TFC API mismatch, but this shim was created for the exact versions listed above.

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
