package com.codex.tfcsaltwatershim;

import java.util.function.Supplier;

import net.dries007.tfc.common.blocks.wood.Wood;
import net.dries007.tfc.util.registry.RegistryWood;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.grower.TreeGrower;
import net.minecraft.world.level.block.state.properties.BlockSetType;
import net.minecraft.world.level.block.state.properties.WoodType;
import net.minecraft.world.level.material.MapColor;

public final class LeavesCompat {
    private LeavesCompat() {
    }

    public static RegistryWood wood(int autumnIndex) {
        return new LegacyLeavesWood(autumnIndex);
    }

    private record LegacyLeavesWood(int autumnIndex) implements RegistryWood {
        @Override
        public String getSerializedName() {
            return "tfc_beneath_compat_legacy_leaves";
        }

        @Override
        public MapColor woodColor() {
            return MapColor.COLOR_RED;
        }

        @Override
        public MapColor barkColor() {
            return MapColor.COLOR_RED;
        }

        @Override
        public TreeGrower tree() {
            return null;
        }

        @Override
        public Supplier<Integer> ticksToGrow() {
            return () -> 0;
        }

        @Override
        public Supplier<Block> getBlock(Wood.BlockType type) {
            return () -> Blocks.AIR;
        }

        @Override
        public BlockSetType getBlockSet() {
            return BlockSetType.OAK;
        }

        @Override
        public WoodType getVanillaWoodType() {
            return WoodType.OAK;
        }

        @Override
        public boolean isConifer() {
            return false;
        }

        @Override
        public float getFlowerOffset() {
            return 0.0F;
        }
    }
}
