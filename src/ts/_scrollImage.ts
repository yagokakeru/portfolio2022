import * as THREE from 'three';
import { Camera, Mesh, PlaneGeometry, Scene, ShaderMaterial, Texture, TextureLoader, WebGLRenderer } from 'three';
import gsap from 'gsap';

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
    camera!: Camera;
    renderer!: WebGLRenderer;
    items!: {
        img: HTMLImageElement;
        width: number;
        height: number;
        top: number;
        left: number;
        texture: Texture | null;
    }[];
    textureLoader!: TextureLoader;
    texture!: Texture;
    geometry!: PlaneGeometry;
    material!: ShaderMaterial;
    mesh!: Mesh;
    meshPosX!: number;
    meshPosY!: number;
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
        // this.setItem();
        this.setTextureLoader();
        // this.setMesh();
        // this.updateScroll();
        // this.animate();
        this.main();
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

        // this.items.forEach((item, index) => {
        //     this.items[index].texture = this.textureLoader.load(item.img.src);
        //     this.setMesh(item);
        // });
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
        const texture = this.textureLoader.load(img.src);

        const uniforms = {
            uTexture: { value: texture },
            uImageAspect: { value: img.naturalWidth / img.naturalHeight },
            uPlaneAspect: { value: img.clientWidth / img.clientHeight },
            uTime: { value: 0 },
        };
        this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
        this.material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        const mesh = new THREE.Mesh(this.geometry, this.material);

        return mesh;
    };

    loop() {
        this.updateScroll();
        this.imagePlaneArray.forEach((plane, index) => {
            plane.update(this.scrollOffset);
            plane.mesh.material.uniforms.uTime.value = this.scrollOffset;
        });
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.loop.bind(this));
    };

    main() {
        window.addEventListener('load', () => {
            const imageArray = this.itemTargets;
            for (const img of imageArray) {
                this.mesh = this.createMesh(img);
                this.scene.add(this.mesh);

                const imagePlane = new ImagePlane(this.targets, this.canvas, this.mesh, img);
                imagePlane.setParams();

                this.imagePlaneArray.push(imagePlane);
            }
            this.loop();
        });
    }

    // リサイズ（負荷軽減のためリサイズが完了してから発火する）
//     window.addEventListener('resize', () => {
//     if (timeoutId) clearTimeout(timeoutId);

//     timeoutId = setTimeout(resize, 200);
// });
//     };

// main();

// リサイズ処理
// let timeoutId = 0;
// const resize = () => {
//     // three.jsのリサイズ
//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     canvasSize.width = width;
//     canvasSize.height = height;

//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(width, height);

//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();

//     // カメラの距離を計算し直す
//     const fov = 60;
//     const fovRad = (fov / 2) * (Math.PI / 180);
//     const dist = canvasSize.height / 2 / Math.tan(fovRad);
//     camera.position.z = dist;
// };

    // init() {
    //     this.setScene();
    //     this.setCamera();
    //     this.setRenderer();
    //     this.setItem();
    //     this.setTextureLoader();
    //     // this.setMesh();
    //     this.updateScroll();
    //     this.animate();
    // }

    // setScene() {
    //     this.scene = new THREE.Scene();
    // }

    // setCamera() {
    //     this.camera = new THREE.PerspectiveCamera(
    //         this.cameraParam.fov,
    //         this.cameraParam.aspect,
    //         this.cameraParam.near,
    //         this.cameraParam.far,
    //     )
    //     this.camera.position.z = this.cameraDistance;
    // }

    // setRenderer() {
    //     this.renderer = new THREE.WebGLRenderer({
    //         canvas: this.canvas,
    //         alpha: true,
    //     });
    //     this.renderer.setSize(this.windowSize.width, this.windowSize.height);
    //     this.renderer.setPixelRatio(window.devicePixelRatio);
    // }

    // setItem() {
    //     this.items = this.itemTargets.map((itemTarget: HTMLImageElement) => ({
    //         img: itemTarget,
    //         width: itemTarget.getBoundingClientRect().width,
    //         height: itemTarget.getBoundingClientRect().height,
    //         top: itemTarget.getBoundingClientRect().top,
    //         left: itemTarget.getBoundingClientRect().left,
    //         texture: null,
    //     }));
    // }

    // setTextureLoader() {
    //     this.textureLoader = new THREE.TextureLoader();

    //     this.items.forEach((item, index) => {
    //         this.items[index].texture = this.textureLoader.load(item.img.src);
    //         this.setMesh(item);
    //     });
    // }

    // setMesh(item: any) {
    //     this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    //     this.material = new THREE.ShaderMaterial({
    //         vertexShader: vertexShader,
    //         fragmentShader: fragmentShader,
    //         uniforms: {
    //             uTexture: { value: item.texture },
    //             uImageAspect: { value: item.img.naturalWidth / item.img.naturalHeight },
    //             uPlaneAspect: { value: item.img.clientWidth / item.img.clientHeight },
    //             uTime: { value: 0 },
    //         },
    //         transparent: true,
    //     });
    //     this.mesh = new THREE.Mesh(this.geometry, this.material);
    //     this.mesh.scale.x = item.width;
    //     this.mesh.scale.y = item.height;
    //     this.meshPosX = item.left - this.canvas.clientWidth / 2 + item.width / 2;
    //     this.meshPosY = -item.top + this.canvas.clientHeight / 2 - item.height / 2;
    //     this.mesh.position.x = this.meshPosX;
    //     this.mesh.position.y = this.meshPosY;

    //     this.scene.add(this.mesh);
    // }

    // updateScroll() {
    //     locoScroll.on('scroll', (event: { delta: { y: number; }; }) => {
    //         this.targetScrollY = event.delta.y;
    //         this.mesh.position.y = this.meshPosY + this.targetScrollY;
    //     });
    // };

    // animate() {
    //     this.renderer.render(this.scene, this.camera);

    //     requestAnimationFrame(this.animate.bind(this));
    // }
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

    update(offset: number) {
        this.setParams();

        // this.material.uniforms.uTime.value = offset;
    }
}