package com.codex.tfcsaltwatershim.mixin;

import net.dries007.tfc.util.registry.RegistryHolder;
import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceKey;
import net.neoforged.neoforge.registries.DeferredHolder;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Overwrite;
import org.spongepowered.asm.mixin.Shadow;

@Mixin(RegistryHolder.class)
public interface RegistryHolderMixin<R, T extends R> {
    @Shadow
    DeferredHolder<R, T> holder();

    /**
     * Addons can ask TFC registry holders for a block/item during another
     * register event, after the object is in the live registry but before the
     * DeferredHolder is bound. Look in the live registry before failing.
     */
    @Overwrite
    default T get() {
        final DeferredHolder<R, T> holder = holder();
        if (holder.isBound()) {
            return holder.get();
        }

        final ResourceKey<R> key = holder.getKey();
        @SuppressWarnings("unchecked")
        final Registry<R> registry = (Registry<R>) BuiltInRegistries.REGISTRY.get(key.registry());
        if (registry != null) {
            @SuppressWarnings("unchecked")
            final T value = (T) registry.get(key.location());
            if (value != null) {
                return value;
            }
        }

        return holder.get();
    }
}
