# Changelog

## 1.5.0

- Added compatibility for TerraFirmaCraft `1.21.1-4.2.4` with Beneath `1.21.1-2.0.2`.
- Added a runtime-only legacy constructor bridge for `TFCLeavesBlock(ExtendedProperties, int, Supplier, Supplier)`, which Beneath `2.0.2` still calls during wart leaf registration.
- Kept all existing compatibility fixes from `1.4.0`, including the TFC spawn search cap, salt water holder fallback, registry holder fallback, Beneath rock spike bridge, and Beneath amethyst geode data override.
- Still does not modify TerraFirmaCraft, Beneath, or any other downloaded mod jar on disk.

## 1.4.0

- Added a runtime cap for TerraFirmaCraft's initial spawn biome search distance to avoid very slow new-world creation.
- Targeted the long world creation delay seen with TerraFirmaCraft `1.21.1-4.2.0` and Beneath `1.21.1-2.0.1`.
