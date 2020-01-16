import Smooth from 'smooth-scrolling';
const { clamp01, inverseLerp } = require('canvas-sketch-util/math');

class Custom extends Smooth {
  constructor(opt) {
    super(opt);
    this.createExtraBound();
    this.resizing = false;
    this.cache = null;
    this.dom.divs = opt.divs;
    // this.cb = opt.cb.bind(this) || null;
    this.footer = opt.footer;
  }

  createExtraBound() {
    ['getCache', 'inViewport'].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  resize() {
    this.resizing = true;
    this.getCache();
    super.resize();
    this.resizing = false;
  }

  getCache() {
    this.cache = [];
    this.dom.divs.forEach((el, index) => {
      el.style.transform = 'none';
      const scrollY = this.vars.target;
      const bounding = el.getBoundingClientRect();
      const bounds = {
        el: el,
        state: true,
        top: bounding.top + scrollY,
        left: bounding.left,
        center: bounding.height / 2,
        bottom: bounding.bottom + scrollY,
        speed: el.getAttribute('data-scroll-speed') || null
      };
      this.cache.push(bounds);
    });
    this.vars.bounding =
      this.dom.section.getBoundingClientRect().height +
      this.footer.getBoundingClientRect().height -
      (this.vars.native ? 0 : this.vars.height);
  }

  run() {
    this.dom.divs.forEach(this.inViewport);
    this.dom.section.style[this.prefix] = this.getTransform(this.vars.current * -1);
    if (!this.resizing) {
      this.cb && this.cb();
    }
    super.run();
  }

  inViewport(el, index) {
    if (!this.cache || this.resizing) return;
    const cache = this.cache[index];
    const current = this.vars.current;
    // const transform = (cache.top + cache.center - current) * (cache.speed / 10);
    const transform = (cache.top - current) * (cache.speed / 10);
    const top = Math.round(cache.top + transform - current);
    const bottom = Math.round(cache.bottom + transform - current);
    const opacityMinHeight = this.vars.height - 30;
    const opacityMaxHeight = this.vars.height - 300;
    const height = this.vars.height + 500;
    const inview = bottom > 0 && top < height;
    const opacity = clamp01(inverseLerp(opacityMinHeight, opacityMaxHeight, top));
    if (inview) {
      el.style.opacity = opacity;
      if (cache.speed) {
        el.style[this.prefix] = this.getTransform(transform);
      }
    } else {
      if (cache.speed) {
        // el.style[this.prefix] = 'none'
      }
    }
  }
}

export default Custom;
