function initializeCoreMod() {
    var Opcodes = Java.type('org.objectweb.asm.Opcodes');
    var MethodNode = Java.type('org.objectweb.asm.tree.MethodNode');
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode');
    var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');

    var rockSpike = 'net/dries007/tfc/common/blocks/rock/RockSpikeBlock';
    var propertiesDesc = 'Lnet/minecraft/world/level/block/state/BlockBehaviour$Properties;';
    var supplierDesc = 'Ljava/util/function/Supplier;';
    var oldCtorDesc = '(' + propertiesDesc + ')V';
    var newCtorDesc = '(' + propertiesDesc + supplierDesc + ')V';

    return {
        'tfc_rock_spike_legacy_constructor': {
            'target': {
                'type': 'CLASS',
                'name': 'net.dries007.tfc.common.blocks.rock.RockSpikeBlock'
            },
            'transformer': function(classNode) {
                for (var i = 0; i < classNode.methods.size(); i++) {
                    var existing = classNode.methods.get(i);
                    if (existing.name === '<init>' && existing.desc === oldCtorDesc) {
                        return classNode;
                    }
                }

                var method = new MethodNode(Opcodes.ACC_PUBLIC, '<init>', oldCtorDesc, null, null);
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
                    newCtorDesc,
                    false
                ));
                method.instructions.add(new InsnNode(Opcodes.RETURN));
                method.maxStack = 3;
                method.maxLocals = 2;
                classNode.methods.add(method);
                return classNode;
            }
        }
    };
}
