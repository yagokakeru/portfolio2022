import * as THREE from 'three';
import gsap from 'gsap';
import { Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Texture, TextureLoader, Vector3, WebGLRenderer } from 'three';

import vertexShader from '../shaders/postHoverAnimVert.glsl';
import fragmentShader from '../shaders/postHoverAnimFrag.glsl';

export class postHoverAnim {
    windowSize: {
        width: number;
        height: number;
    }
    cameraParam: {
        fov: number;
        aspect: number;
        near: number;
        far: number;
    }
    fovRad: number;
    cameraDistance: number;
    itemsWrapper: HTMLElement | null;
    targetItems: Element[] | null;
    scene: Scene | undefined;
    camera: PerspectiveCamera | undefined;
    renderer: WebGLRenderer | undefined;
    loader: TextureLoader | undefined;
    texture: Texture | undefined;
    geometry: PlaneGeometry | undefined;
    material: ShaderMaterial | undefined;
    mesh: Mesh | undefined;
    items: {
        element: Element;
        img: HTMLImageElement | null;
        index: number;
        texture: Texture | null;
    }[] | undefined;
    currentItem: {
        element: Element;
        img: HTMLImageElement | null;
        index: number;
        texture: Texture | null;
    } | undefined;
    position: Vector3;
    shiftNum: number;

    constructor(itemsWrapper: HTMLElement, targetItems: NodeListOf<Element>) {
        this.windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.cameraParam = {
            fov: 50,
            aspect: this.windowSize.width / this.windowSize.height,
            near: 0.1,
            far: 2000,
        }
        this.fovRad = (this.cameraParam.fov / 2) * (Math.PI / 180);
        this.cameraDistance = (this.windowSize.height / 2) / Math.tan(this.fovRad);

        this.itemsWrapper = itemsWrapper;

        this.targetItems = [...targetItems];

        this.position = new THREE.Vector3(0, 0, 0);

        this.shiftNum = .75;
        
        this.init();
        this.setEventListeners();
    }

    init() {
        this.itemElements()
        this.setScene();
        this.setCamera();
        this.setRender();
        this.textureLoader();
        this.setMesh();

        this.animate();
    }

    setScene() {
        this.scene = new THREE.Scene();
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera(
            this.cameraParam.fov,
            this.cameraParam.aspect,
            this.cameraParam.near,
            this.cameraParam.far
        );
        this.camera.position.z = this.cameraDistance;
    }

    setRender() {
        const webgl01DOM = document.querySelector('.webgl01') as HTMLElement;
        this.renderer = new THREE.WebGLRenderer({
            canvas: webgl01DOM,
            alpha: true,
        });
        this.renderer.setSize(this.windowSize.width, this.windowSize.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    setMesh() {
        this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTexture: { value: null },
                uAlpha: { value: 0.0 },
                uOffset: { value: new THREE.Vector2(0.0, 0.0) },
            },
            transparent: true,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        if(this.scene !== undefined){
            this.scene.add(this.mesh);
        }
    }

    textureLoader() {
        this.loader = new THREE.TextureLoader();
        if(this.items !== undefined){
            this.items.forEach((item, index) => {
                let textureSrc;
                if(item.img !== null){
                    textureSrc = item.img.src;
                }
                if(this.items !== undefined && this.loader !== undefined && textureSrc !== undefined){
                    this.items[index].texture = this.loader.load(textureSrc);
                }
            });
        }
    }

    animate() {
        if(this.renderer !== undefined && this.scene !== undefined && this.camera !== undefined){
            this.renderer.render(this.scene, this.camera);
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    itemElements() {
        if(this.targetItems !== null) {
            this.items = this.targetItems.map((item: Element, index: number) => ({
                element: item,
                img: item.querySelector('img'),
                index: index,
                texture: null,
            }));
        }else {
            //
        }
    }

    setEventListeners() {
        if(this.items !== undefined && this.itemsWrapper !== null) {
            this.items.forEach((item, index) => {
                item.element.addEventListener('mouseover', this.onMouseJudgment.bind(this, index), false);
            });

            window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
            this.itemsWrapper.addEventListener('mouseleave', this.onMouseLeave.bind(this), false);
        }

        window.addEventListener('resize', this.onResize.bind(this), false);
    }

    onMouseJudgment(index: number) {
        this.onMouseOver();
        if( this.currentItem && this.currentItem.index === index ) return;
        this.onTargetChange(index);
    }

    onTargetChange(index: number) {
        if(this.items !== undefined && this.material !== undefined ) {
            this.currentItem = this.items[index];

            this.material.uniforms.uTexture.value = this.currentItem.texture;

            if(this.currentItem.img !== null && this.mesh !== undefined){
                const rectW = this.currentItem.img.clientWidth;
                const rectH = this.currentItem.img.clientHeight;
                this.mesh.scale.x = rectW;
                this.mesh.scale.y = rectH;
            }
        }
    }

    onMouseOver() {
        if(this.material !== undefined){
            gsap.to(this.material.uniforms.uAlpha, .5, {
                value: .5,
                ease: 'Power4.easeOut',
            })
        }
    }

    onMouseLeave() {
        if(this.material !== undefined){
            gsap.to(this.material.uniforms.uAlpha, .5, {
                value: 0.0,
                ease: 'Power4.easeOut',
            })
        }
    }

    onMouseMove(event: MouseEvent) {
        let shiftX = Number(this.itemsWrapper?.clientWidth) * this.shiftNum;

        let mouseX = ((event.clientX + shiftX) / this.windowSize.width) * 2 - 1;
        let mouseY = -(event.clientY / this.windowSize.height) * 2 + 1;
        let x = this.map(mouseX, -1, 1, -this.windowSize.width / 2, this.windowSize.width / 2);
        let y = this.map(mouseY, -1, 1, -this.windowSize.height / 2, this.windowSize.height / 2);

        this.position = new THREE.Vector3(x, y, 0);
        if(this.mesh !== undefined) {
            gsap.to(this.mesh.position, 1, {
                x: x,
                y: y,
                ease: 'Power4.easeOut',
                onUpdate: this.onPositionUpdate.bind(this),
            });
        }
    }

    onPositionUpdate() {
        if(this.mesh !== undefined && this.material !== undefined) {
            let offset = this.mesh.position.clone().sub(this.position).multiplyScalar(-0.001);
            this.material.uniforms.uOffset.value = offset;
        }
    }

    map(mouse: number, in_min: number, in_max: number, out_min: number, out_max: number) {
        return ((mouse - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    }

    onResize() {
        if(this.renderer !== undefined && this.camera !== undefined) {
            this.windowSize.width = window.innerWidth;
            this.windowSize.height = window.innerHeight;

            this.renderer.setSize(this.windowSize.width, this.windowSize.height);
            this.camera.aspect = this.windowSize.width / this.windowSize.height;
            this.cameraDistance = (this.windowSize.height / 2) / Math.tan(this.fovRad);
            this.camera.position.z = this.cameraDistance;
            this.camera.updateProjectionMatrix();
        }else{
            //
        }

        if(this.windowSize.width > 960){
            this.shiftNum = .75;
        }else if(this.windowSize.width > 599){
            this.shiftNum = .5;
        }else{
            //
        }
    }
}