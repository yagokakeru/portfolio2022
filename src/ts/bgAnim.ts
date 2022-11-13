import gsap from 'gsap';
import * as THREE from 'three';
import { Clock, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from 'three';

import vertexShader from '../shaders/bgAnimVert.glsl';
import fragmentShader from '../shaders/bgAnimFrag.glsl';

export class bgAnim {
    canvas: HTMLElement;
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
    clock: Clock;
    scene!: Scene;
    camera!: PerspectiveCamera;
    renderer!: WebGLRenderer;
    geometry!: PlaneGeometry;
    material!: ShaderMaterial; 
    mesh!: Mesh;
    time! : number;

    constructor(canvas: HTMLElement) {
        this.canvas = canvas;

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

        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.setScene();
        this.setCamera();
        this.setRenderer();
        this.setMesh();
        this.uniformsChenge();
        this.animete();
        this.onResize();
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
        );
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

    setMesh() {
        this.geometry = new THREE.PlaneGeometry(this.windowSize.width, this.windowSize.height, 16, 16);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uFrequency: { value: new THREE.Vector2(this.windowSize.width / 3, this.windowSize.height / 2) },
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#ebe3e4') },
                uSizeW: { value: 0.9 },
                uSizeH: { value: 1.0 },
            },
            transparent: true,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);
    }

    uniformsChenge() {
        gsap.registerEffect({
            name: 'uniformsChenge',
            defaults: { duration: 5, value: 1.0 },
            effect: (targets: HTMLElement, config: any) => {
                return gsap.to(targets, config.duration, { value: config.value, repeat: -1, yoyo: true });
            },
        });

        gsap.effects.uniformsChenge(this.material.uniforms.uSizeW);
        gsap.effects.uniformsChenge(this.material.uniforms.uSizeH, { value: 0.9 });
    }

    animete() {
        this.time = this.clock.getElapsedTime();
        this.material.uniforms.uTime.value = this.time;

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animete.bind(this));
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