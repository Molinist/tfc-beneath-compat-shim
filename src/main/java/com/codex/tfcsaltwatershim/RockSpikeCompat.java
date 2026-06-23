package com.codex.tfcsaltwatershim;

import java.util.function.Supplier;

import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.Blocks;

public final class RockSpikeCompat {
    private static final Supplier<Block> NETHERRACK_ANCHOR = () -> Blocks.NETHERRACK;

    private RockSpikeCompat() {
    }

    public static Supplier<? extends Block> anchor() {
        return NETHERRACK_ANCHOR;
    }
}
