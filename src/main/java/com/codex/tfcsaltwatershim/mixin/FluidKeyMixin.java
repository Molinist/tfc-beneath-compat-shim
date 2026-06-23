package com.codex.tfcsaltwatershim.mixin;

import net.dries007.tfc.common.fluids.FluidProperty;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.level.material.Fluid;
import net.minecraft.world.level.material.Fluids;
import net.neoforged.neoforge.registries.DeferredHolder;
import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Overwrite;
import org.spongepowered.asm.mixin.Shadow;

@Mixin(FluidProperty.FluidKey.class)
public abstract class FluidKeyMixin {
    @Shadow
    @Final
    private ResourceLocation name;

    @Shadow
    @Final
    private DeferredHolder<Fluid, Fluid> fluid;

    /**
     * TFC 4.2.0 can ask block-state cache baking for tfc:salt_water before the
     * NeoForge DeferredHolder has bound it. Treat that early pass as empty
     * instead of crashing; once bound, the original value is returned.
     */
    @Overwrite
    public Fluid getFluid() {
        if (fluid.isBound()) {
            return fluid.get();
        }
        return BuiltInRegistries.FLUID.getOptional(name).orElse(Fluids.EMPTY);
    }
}
