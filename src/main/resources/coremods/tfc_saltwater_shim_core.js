function initializeCoreMod() {
    var Opcodes = Java.type('org.objectweb.asm.Opcodes');
    var MethodNode = Java.type('org.objectweb.asm.tree.MethodNode');
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode');
    var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');

    var rockSpike = 'net/dries007/tfc/common/blocks/rock/RockSpikeBlock';
    var leaves = 'net/dries007/tfc/common/blocks/wood/TFCLeavesBlock';
    var propertiesDesc = 'Lnet/minecraft/world/level/block/state/BlockBehaviour$Properties;';
    var extendedPropertiesDesc = 'Lnet/dries007/tfc/common/blocks/ExtendedProperties;';
    var registryWoodDesc = 'Lnet/dries007/tfc/util/registry/RegistryWood;';
    var supplierDesc = 'Ljava/util/function/Supplier;';
    var oldRockSpikeCtorDesc = '(' + propertiesDesc + ')V';
    var newRockSpikeCtorDesc = '(' + propertiesDesc + supplierDesc + ')V';
    var oldLeavesCtorDesc = '(' + extendedPropertiesDesc + 'I' + supplierDesc + supplierDesc + ')V';
    var newLeavesCtorDesc = '(' + extendedPropertiesDesc + registryWoodDesc + supplierDesc + supplierDesc + ')V';

    return {
        'tfc_rock_spike_legacy_constructor': {
            'target': {
                'type': 'CLASS',
                'name': 'net.dries007.tfc.common.blocks.rock.RockSpikeBlock'
            },
            'transformer': function(classNode) {
                for (var i = 0; i < classNode.methods.size(); i++) {
                    var existing = classNode.methods.get(i);
                    if (existing.name === '<init>' && existing.desc === oldRockSpikeCtorDesc) {
                        return classNode;
                    }
                }

                var method = new MethodNode(Opcodes.ACC_PUBLIC, '<init>', oldRockSpikeCtorDesc, null, null);
                method.instructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                method.instructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                method.instructions.add(new MethodInsnNode(
                    Opcodes.INVOKESTATIC,
                    'com/codex/tfcsaltwatershim/RockSpikeCompat',
                    'anchor',
                    '()' + supplierDesc,
                    false
                ));
                method.instructions.add(new MethodInsnNode(
                    Opcodes.INVOKESPECIAL,
                    rockSpike,
                    '<init>',
                    newRockSpikeCtorDesc,
                    false
                ));
                method.instructions.add(new InsnNode(Opcodes.RETURN));
                method.maxStack = 3;
                method.maxLocals = 2;
                classNode.methods.add(method);
                return classNode;
            }
        },
        'tfc_leaves_legacy_constructor': {
            'target': {
                'type': 'CLASS',
                'name': 'net.dries007.tfc.common.blocks.wood.TFCLeavesBlock'
            },
            'transformer': function(classNode) {
                var hasOldConstructor = false;
                var hasNewConstructor = false;
                for (var i = 0; i < classNode.methods.size(); i++) {
                    var existing = classNode.methods.get(i);
                    if (existing.name === '<init>' && existing.desc === oldLeavesCtorDesc) {
                        hasOldConstructor = true;
                    }
                    if (existing.name === '<init>' && existing.desc === newLeavesCtorDesc) {
                        hasNewConstructor = true;
                    }
                }
                if (hasOldConstructor || !hasNewConstructor) {
                    return classNode;
                }

                var method = new MethodNode(Opcodes.ACC_PUBLIC, '<init>', oldLeavesCtorDesc, null, null);
                method.instructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                method.instructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                method.instructions.add(new VarInsnNode(Opcodes.ILOAD, 2));
                method.instructions.add(new MethodInsnNode(
                    Opcodes.INVOKESTATIC,
                    'com/codex/tfcsaltwatershim/LeavesCompat',
                    'wood',
                    '(I)' + registryWoodDesc,
                    false
                ));
                method.instructions.add(new VarInsnNode(Opcodes.ALOAD, 3));
                method.instructions.add(new VarInsnNode(Opcodes.ALOAD, 4));
                method.instructions.add(new MethodInsnNode(
                    Opcodes.INVOKESPECIAL,
                    leaves,
                    '<init>',
                    newLeavesCtorDesc,
                    false
                ));
                method.instructions.add(new InsnNode(Opcodes.RETURN));
                method.maxStack = 5;
                method.maxLocals = 5;
                classNode.methods.add(method);
                return classNode;
            }
        }
    };
}
