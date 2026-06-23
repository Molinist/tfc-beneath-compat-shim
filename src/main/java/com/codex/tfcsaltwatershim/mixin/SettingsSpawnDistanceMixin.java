package com.codex.tfcsaltwatershim.mixin;

import net.dries007.tfc.world.settings.Settings;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

@Mixin(Settings.class)
public abstract class SettingsSpawnDistanceMixin {
    private static final int MAX_INITIAL_SPAWN_SEARCH_DISTANCE = 512;

    /**
     * TFC's initial world-spawn search samples the configured spawn radius
     * before the first world load. The default 4000 block radius can spend
     * minutes generating distant region data. Keep the search local; if no
     * spawnable biome is found, TFC already falls back to the configured center.
     */
    @Inject(method = "spawnDistance", at = @At("RETURN"), cancellable = true)
    private void tfc_saltwater_shim$capInitialSpawnSearchDistance(CallbackInfoReturnable<Integer> cir) {
        final int distance = cir.getReturnValue();
        if (distance > MAX_INITIAL_SPAWN_SEARCH_DISTANCE) {
            cir.setReturnValue(MAX_INITIAL_SPAWN_SEARCH_DISTANCE);
        }
    }
}
