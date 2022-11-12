import * as THREE from 'three';
import { Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Texture, TextureLoader, WebGLRenderer } from 'three';

import { locoScroll } from './locomotiveScroll';
import vertexShader from '../shaders/scrollImageVert.glsl';
import fragmentShader from '../shaders/scrollImageFrag.glsl';

export class scrollImage {
    targets:NodeListOf<HTMLImageElement>;
    itemTargets: HTMLImageElement[];
    canvas: HTMLElement;
    imagePlaneArray: any[];
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
    scene!: Scene;
    camera!: PerspectiveCamera;
    renderer!: WebGLRenderer;
    textureLoader!: TextureLoader;
    texture!: Texture;
    geometry!: PlaneGeometry;
    material!: ShaderMaterial;
    mesh!: Mesh;
    targetScrollY: number;
    currentScrollY: number;
    scrollOffset: number;

    constructor(itemTargets: NodeListOf<HTMLImageElement>, canvas: HTMLElement) {
        this.targets = itemTargets
        this.itemTargets = [...itemTargets];
        this.canvas = canvas;
        this.imagePlaneArray = [];

        this.windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.cameraParam = {
            fov: 50,
            aspect: this.windowSize.width / this.windowSize.height,
            near: 0.1,
            far: 1000
        }
        this.fovRad = (this.cameraParam.fov / 2) * (Math.PI / 180);
        this.cameraDistance = (this.windowSize.height / 2) / Math.tan(this.fovRad);

        this.targetScrollY = 0;
        this.currentScrollY = 0;
        this.scrollOffset = 0;

        this.init();
    }
    
    init() {
        this.setScene();
        this.setCamera();
        this.setRenderer();
        this.setTextureLoader();
        this.main();
        this.onResize()
    }

    setScene() {
        this.scene = new THREE.Scene();
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera(
            this.cameraParam.fov,
            this.cameraParam.aspect,
            this.cameraParam.near,
            this.cameraParam.far,
        )
        this.camera.position.z = this.cameraDistance;
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
        });
        this.renderer.setSize(this.windowSize.width, this.windowSize.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    setTextureLoader() {
        this.textureLoader = new THREE.TextureLoader();
    }

    lerp(start: number, end: number, multiplier: number) {
        return (1 - multiplier) * start + multiplier * end;
    };

    updateScroll() {
        locoScroll.on('scroll', (event: { scroll: { y: number; }; }) => {
            this.targetScrollY = event.scroll.y;
        });
        this.currentScrollY = this.lerp(this.currentScrollY, this.targetScrollY, 0.1);

        this.scrollOffset = this.targetScrollY - this.currentScrollY;
    };

    createMesh(img: HTMLImageElement) {
        this.texture = this.textureLoader.load(img.src);

        this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTexture: { value: this.texture },
                uTime: { value: 0 },
            }
        });

        const mesh = new THREE.Mesh(this.geometry, this.material);

        return mesh;
    };

    loop() {
        this.updateScroll();
        this.imagePlaneArray.forEach((plane, index) => {
            plane.setParams();
            plane.mesh.material.uniforms.uTime.value = this.scrollOffset;
        });
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.loop.bind(this));
    };

    main() {
        window.addEventListener('load', () => {
            this.itemTargets.forEach(img => {
                this.mesh = this.createMesh(img);
                this.scene.add(this.mesh);

                const imagePlane = new ImagePlane(this.targets, this.canvas, this.mesh, img);
                imagePlane.setParams();

                this.imagePlaneArray.push(imagePlane);
            });
            this.loop();
        });
    }

    onResize() {
        window.addEventListener('resize', () => {
            this.windowSize.width = window.innerWidth;
            this.windowSize.height = window.innerHeight;

            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.windowSize.width, this.windowSize.height);

            this.camera.aspect = this.windowSize.width / this.windowSize.height;
            this.camera.updateProjectionMatrix();

            this.cameraDistance = (this.windowSize.height / 2) / Math.tan(this.fovRad);
            this.camera.position.z = this.cameraDistance;
        });
    }
}

class ImagePlane extends scrollImage {
    refImage: HTMLImageElement;
    mesh: Mesh;
    windowSize: {
        width: number;
        height: number;
    }
    constructor(itemTargets: NodeListOf<HTMLImageElement>, canvas: HTMLElement, mesh: Mesh, img: HTMLImageElement) {
        super(itemTargets, canvas);
        this.refImage = img;
        this.mesh = mesh;
        this.windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    setParams() {
        const rect = this.refImage.getBoundingClientRect();

        this.mesh.scale.x = rect.width;
        this.mesh.scale.y = rect.height;

        const x = rect.left - this.windowSize.width / 2 + rect.width / 2;
        const y = -rect.top + this.windowSize.height / 2 - rect.height / 2;
        this.mesh.position.set(x, y, this.mesh.position.z);
    }
}