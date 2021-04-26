class AnimatedEntity extends Entity {
    constructor(mesh) {
        super(SkeletonUtils.clone(mesh));
    }
}