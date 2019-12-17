import React, { PureComponent } from 'react';
import * as THREE from 'three';
// import checkProps from '@jam3/react-check-extra-props';
// import PropTypes from 'prop-types';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import buffer from './buffer.glsl';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// import animate from '../../util/gsap-animate';
// import dom from '../../util/dom';
// import PropTypes from 'prop-types';\
// import classnames from 'classnames';
// import checkProps from '@jam3/react-check-extra-props';
// import { BaseLink } from '@jam3/react-ui';

export default class LandingBg extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.addTexture();
    this.sceneSetup();
    this.renderBufferSceneSetup();
    this.addSceneObjects();
    this.addRbSceneObjects();
    this.addListeners();
    this.rAF();
  }

  componentWillUnmount() {
    // this.controls.dispose();
    this.removeListeners();
  }

  sceneSetup = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.autoClearColor = false;

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();

    this.mousePosition = new THREE.Vector3();

    // this.controls = new OrbitControls(this.camera, this.el);
    this.el.appendChild(this.renderer.domElement); // mount using React ref
  };

  renderBufferSceneSetup = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.bufferRenderer = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false
    });

    this.writeBuffer = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false
    });

    this.rbCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.rbScene = new THREE.Scene();
  };

  getCanvasRelativePosition = event => {
    const rect = this.el.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      // y: event.clientY - rect.top
      y: rect.height - event.clientY
    };
  };

  mousedown = () => {
    this.mousePosition.setZ(1);
  };

  mouseup = () => {
    this.mousePosition.setZ(0);
  };

  mousemove = e => {
    // const pos = this.getCanvasRelativePosition(e);
    // const x = (pos.x / this.el.clientWidth) * 2 - 1;
    // const y = (pos.y / this.el.clientHeight) * -2 + 1;
    // this.mousePosition.setX(x);
    // this.mousePosition.setY(y);

    // console.log(`${x}-${y}`);
    // this.mousePosition.unproject(this.camera);
    this.mousePosition.setX(e.clientX);
    this.mousePosition.setY(this.el.clientHeight - e.clientY);
    this.mousePosition.unproject(this.camera);

    // console.log(`${e.clientX}-${this.el.clientHeight - e.clientY}`);
  };

  touchmove = e => {
    // event.preventDefault();
    this.mousemove(e.touches[0]);
  };

  addListeners = () => {
    window.addEventListener('mousedown', this.mousedown);
    window.addEventListener('mouseup', this.mouseup);
    window.addEventListener('mousemove', this.mousemove);
    // window.addEventListener('touchmove', this.touchmove, { passive: false });
  };

  removeListeners = () => {
    window.cancelAnimationFrame(this.requestID);
    window.removeEventListener('mousedown', this.mousedown);
    window.removeEventListener('mouseup', this.mouseup);
    window.removeEventListener('mousemove', this.mousemove);
  };

  addTexture = () => {
    this.textureSize = {
      x: 1600,
      y: 900
    };
    const loader = new THREE.TextureLoader();
    const localBg = './assets/images/landingBg.jpg';
    // this.texture = loader.load('https://source.unsplash.com/collection/151521/1600x900');
    this.texture = this.props.imageBg ? this.props.imageBg : loader.load(localBg);
    // loader.setCrossOrigin('');

    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
  };

  addSceneObjects = () => {
    const plane = new THREE.PlaneBufferGeometry(2, 2);

    const planeMaterial = new THREE.ShaderMaterial({
      // wireframe: true,
      // side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        iChannel0: { type: 't', value: this.texture },
        iChannel1: { type: 't', value: null },
        iResolution: { value: new THREE.Vector3() },
        iTime: { value: 0 },
        iMouse: { value: new THREE.Vector4() },
        textureSize: { value: new THREE.Vector2(this.textureSize.x, this.textureSize.y) }
      }
    });

    this.planeMesh = new THREE.Mesh(plane, planeMaterial);

    this.scene.add(this.planeMesh);
  };

  addRbSceneObjects = () => {
    const rbPlane = new THREE.PlaneBufferGeometry(2, 2);

    const rbPlaneMaterial = new THREE.ShaderMaterial({
      // wireframe: true,
      // side: THREE.DoubleSide,
      vertexShader,
      fragmentShader: buffer,
      uniforms: {
        iChannel0: { type: 't', value: null },
        iChannel1: { type: 't', value: this.texture },
        iResolution: { value: new THREE.Vector3() },
        iTime: { value: 0 },
        iMouse: { value: new THREE.Vector4() },
        start: { value: false },
        reset: { value: false },
        textureSize: { value: new THREE.Vector2(this.textureSize.x, this.textureSize.y) }
      }
    });

    this.rbPlaneMesh = new THREE.Mesh(rbPlane, rbPlaneMaterial);
    setTimeout(() => {
      this.rbPlaneMesh.material.uniforms.start.value = true;
    }, 2000);

    this.rbScene.add(this.rbPlaneMesh);
  };

  resizeRendererToDisplaySize = renderer => {
    const canvas = renderer.domElement;
    // const pixelRatio = window.devicePixelRatio;
    // const width = (canvas.clientWidth * pixelRatio) | 0;
    // const height = (canvas.clientHeight * pixelRatio) | 0;
    const width = canvas.clientWidth | 0;
    const height = canvas.clientHeight | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  };

  rAF = time => {
    time *= 0.001;
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.rbCamera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;

      this.planeMesh.material.uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
      this.rbPlaneMesh.material.uniforms.iResolution.value.set(canvas.width, canvas.height, 1);

      this.rbCamera.updateProjectionMatrix();
      this.camera.updateProjectionMatrix();

      // this.rbPlaneMesh.material.uniforms.reset.value = true;
      // setTimeout(() => {
      //   this.rbPlaneMesh.material.uniforms.reset.value = false;
      // }, 500);
    }

    this.rbPlaneMesh.material.uniforms.iMouse.value.lerp(this.mousePosition, 0.08);
    this.rbPlaneMesh.material.uniforms.iTime.value = time;

    // this.planeMesh.material.uniforms.iMouse.value = this.mousePosition;
    this.planeMesh.material.uniforms.iTime.value = time;

    this.renderer.setRenderTarget(this.bufferRenderer);
    this.renderer.render(this.rbScene, this.rbCamera);
    this.renderer.setRenderTarget(null);

    this.rbPlaneMesh.material.uniforms.iChannel0.value = this.bufferRenderer.texture;
    const temp = this.bufferRenderer;
    this.bufferRenderer = this.writeBuffer;
    this.writeBuffer = temp;

    this.planeMesh.material.uniforms.iChannel1.value = this.bufferRenderer.texture;
    this.renderer.render(this.scene, this.camera);

    this.requestID = window.requestAnimationFrame(this.rAF);
  };

  render() {
    return <div className="Landing__bg" ref={ref => (this.el = ref)} />;
  }
}
