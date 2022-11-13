import gsap from 'gsap';
import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Mesh, MeshLambertMaterial, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';

export class textAnim {
    targets: NodeListOf<Element>;
    lightTarget: HTMLElement;
    canvas: HTMLElement;
    text!: string;
    fontSize!: number;
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
    meshArray: Mesh[];
    scene!: Scene;
    camera!: PerspectiveCamera;
    renderer!: WebGLRenderer;
    fontLoader!: FontLoader;
    geometry!: TextGeometry;
    material!: MeshLambertMaterial;
    mesh!: Mesh;
    pointLight!: PointLight;
    rect!: DOMRect;
    offsetX!: number;
    offsetY!: number;
    mouseX!: number;
    mouseY!: number;

    constructor(targets: NodeListOf<Element>, lightTarget: HTMLElement, canvas: HTMLElement) {
        this.targets = targets;
        this.lightTarget = lightTarget;
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

        this.meshArray = [];

        this.init();
    }

    init() {
        this.setScene();
        this.setCamera();
        this.setRenderer();
        this.setFontLoader();
        this.setLight();
        this.onMouseMove();
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

    setFontLoader() {
        this.fontLoader = new FontLoader();
        this.fontLoader.load('../fonts/Bely_Display_Regular.json', (font) => {
            this.targets.forEach(target => {
                this.text = target.textContent!.trimEnd();
                this.fontSize = Number(getComputedStyle(target).fontSize.replace(/[^0-9.]/g, ''));
                this.setMesh(this.text, font, this.fontSize);

                this.meshArray.push(this.mesh);
            });
            this.animate();
        });
    }

    setMesh(text: string, font: Font, fontSize: number) {
        this.geometry = new TextGeometry(text, {
            font: font,
            size: fontSize * .74,
            height: 1,
        });

        this.material = new THREE.MeshLambertMaterial({
            color: '#ebe3e4',
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);
    }

    setLight() {
        this.pointLight = new THREE.PointLight(0xffffff, 1, this.windowSize.width, 2.0);
        this.pointLight.position.set(0, 0, 200);
        this.scene.add(this.pointLight);
    }

    offset(target: Element, mesh: Mesh) {
        this.rect = target.getBoundingClientRect();

        this.offsetX = this.rect.left - this.windowSize.width / 2;
        this.offsetY = -this.rect.top + this.windowSize.height / 2 - this.rect.height / 1.2;
        mesh.position.set(this.offsetX, this.offsetY, this.mesh.position.z);
    }

    onMouseMove() {
        this.lightTarget.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - (this.windowSize.width / 2);
            this.mouseY = -event.clientY + (this.windowSize.height / 2);

            gsap.to(this.pointLight.position, 5, {
                x: this.mouseX,
                y: this.mouseY,
                ease: 'Power4.easeOut',
            });
        });
    }

    animate() {
        this.renderer.render(this.scene, this.camera);

        this.targets.forEach((target, index) => {
            this.offset(target, this.meshArray[index]);
        });

        requestAnimationFrame(this.animate.bind(this));
    }

    onResize() {
        window.addEventListener('resize' , () => {
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