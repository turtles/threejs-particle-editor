import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';
import "../../three/lib/enableThree";
import "../../three/lib/particles/GPUParticleSystem";
import "../../three/lib/controls/OrbitControls";

@Component({
    selector: 'three-scene',
    templateUrl: './three-scene.component.html',
    styleUrls: ['./three-scene.component.css']
})
export class ThreeSceneComponent implements AfterViewInit {
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private cameraTarget: THREE.Vector3;
    public scene: THREE.Scene;
    public clock: THREE.Clock;
    public particleSystem: THREE.GPUParticleSystem;
    public controls: THREE.OrbitControls;

    public fieldOfView: number = 60;
    public nearClippingPane: number = 1;
    public farClippingPane: number = 1100;

    public tick: number = 0;

    public options: any;
    public spawnerOptions: any;



    @ViewChild('canvas')
    private canvasRef: ElementRef;

    constructor() {
      this.render = this.render.bind(this);
      this.animate = this.animate.bind(this);
    }

    private get canvas(): HTMLCanvasElement {
      return this.canvasRef.nativeElement;
    }

    private createScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color( 0x000000 );
      this.scene.add(new THREE.AxisHelper(200));

      this.clock = new THREE.Clock();
    }

    private createLight() {
      var light = new THREE.PointLight(0xffffff, 1, 1000);
      light.position.set(0, 0, 100);
      this.scene.add(light);

      var light = new THREE.PointLight(0xffffff, 1, 1000);
      light.position.set(0, 0, -100);
      this.scene.add(light);
    }

    private createCamera() {
      let aspectRatio = this.getAspectRatio();
      this.camera = new THREE.PerspectiveCamera(
          this.fieldOfView,
          aspectRatio,
          this.nearClippingPane,
          this.farClippingPane
      );

      // Set position and look at
      this.camera.position.x = 10;
      this.camera.position.y = 10;
      this.camera.position.z = 100;
    }

    private getAspectRatio(): number {
      let height = this.canvas.clientHeight;
      if (height === 0) {
          return 0;
      }
      return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private startRendering() {
      this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true
      });
      this.renderer.setPixelRatio(devicePixelRatio);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(0xffffff, 1);
      this.renderer.autoClear = true;

      let sceneComponent: ThreeSceneComponent = this;
    }

    public render() {
      this.renderer.render( this.scene, this.camera );
    }

    private animate() {
      requestAnimationFrame(this.animate);

      let delta = this.clock.getDelta();
      this.tick += delta;
      if (this.tick < 0) this.tick = 0;

      for ( var x = 0; x < this.spawnerOptions.spawnRate * delta; x++ ) {
				// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
				// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
				this.particleSystem.spawnParticle( this.options );
			}

      this.particleSystem.update(this.tick);

      this.render();
    }

    public addParticleSystem() {
      this.particleSystem = new THREE.GPUParticleSystem( {
            maxParticles: 250000
      } );
      this.scene.add(this.particleSystem);

      this.options = {
				position: new THREE.Vector3(),
				positionRandomness: .3,
				velocity: new THREE.Vector3(),
				velocityRandomness: .5,
				color: 0xaa88ff,
				colorRandomness: .2,
				turbulence: .5,
				lifetime: 2,
				size: 5,
				sizeRandomness: 1
			};
      this.spawnerOptions = {
        spawnRate: 15000,
				horizontalSpeed: 1.5,
				verticalSpeed: 1.33,
				timeScale: 1
      };
    }

    public addControls() {
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.addEventListener('change', this.render);
    }

    /* EVENTS */
    public onMouseDown(event: MouseEvent) {
      console.log("onMouseDown");
    }

    public onMouseUp(event: MouseEvent) {
        console.log("onMouseUp");
    }


    @HostListener('window:resize', ['$event'])
    public onResize(event: Event) {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

      this.camera.aspect = this.getAspectRatio();
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.render();
    }

    @HostListener('document:keypress', ['$event'])
    public onKeyPress(event: KeyboardEvent) {
      console.log("onKeyPress: " + event.key);
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
      this.createScene();
      this.createLight();
      this.createCamera();
      this.startRendering();
      this.addControls();
      this.addParticleSystem();

      this.animate();
    }

}
