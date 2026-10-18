// Renders the project card shader backgrounds (params from the Figma design) to the
// WebP images the site uses in docs/images. The shaders are static, so a picture of each
// is identical to rendering it live. See README.md for how to run it.
import * as waterCaustic from './shaders/water-caustic.js';
import * as meshGradient from './shaders/mesh-gradient.js';

function shader(module, params) {
  return { setup: module.setup, render: module.render, manifest: module.manifest, params };
}

function point(x, y, r, g, b) {
  return { x, y, color: { r, g, b, a: 1 } };
}

const SHADERS = {
  water: shader(waterCaustic, {
    center: { x: 35, y: 27 },
    scale: 1.649999976158142,
    playhead: 38.619998931884766,
    highlightColor: { r: 0.36000001430511475, g: 0.8799999952316284, b: 0.8399999737739563, a: 1 },
    waterColor: { r: 0.2800000011920929, g: 0.46000000834465027, b: 0.8700000047683716, a: 1 },
    intensity: 0.3400000035762787,
  }),
  mesh: shader(meshGradient, {
    p00: point(0, 0, 0.6482630968093872, 0.39369094371795654, 0.9404342174530029),
    p10: point(33, 0, 0.5460253953933716, 0.44151487946510315, 0.9404751062393188),
    p20: point(67, 0, 0.6455451846122742, 0.3925083577632904, 0.9400657415390015),
    p30: point(100, 0, 0.5424982905387878, 0.44000935554504395, 0.9400013089179993),
    p01: point(0, 37.794254302978516, 0.47912514209747314, 0.5136827230453491, 0.9466580152511597),
    p11: point(40.01045227050781, 38.38066482543945, 0.5028151273727417, 0.506827175617218, 0.947284996509552),
    p21: point(74.01045227050781, 23.00003433227539, 0.5369579195976257, 0.4492681622505188, 0.941007673740387),
    p31: point(100, 37.794254302978516, 0.36951321363449097, 0.5205903649330139, 0.9400197863578796),
    p02: point(0, 71.79425811767578, 0.41018638014793396, 0.5943627953529358, 0.9539801478385925),
    p12: point(25.989545822143555, 72.38066101074219, 0.4746045470237732, 0.5731422901153564, 0.9552966952323914),
    p22: point(59.98954772949219, 57.00003433227539, 0.3663734197616577, 0.5359675884246826, 0.942115843296051),
    p32: point(100, 71.79425811767578, 0.2600427567958832, 0.5716513991355896, 0.9400415420532227),
    p03: point(0, 100, 0.343133807182312, 0.5582795143127441, 0.9438483119010925),
    p13: point(33, 100, 0.37355169653892517, 0.5465379357337952, 0.9442107081413269),
    p23: point(67, 100, 0.2239314168691635, 0.5920385122299194, 0.9405824542045593),
    p33: point(100, 100, 0.22007723152637482, 0.5900400280952454, 0.9400114417076111),
    tessellation: 174,
  }),
};

// Each image is 2x the largest size its card shows at. The mesh gradient is drawn in 0–1
// space, so one image stretches to any card shape. The water caustic's pattern depends
// on the card's shape, so each shape it fills gets its own image.
const OUTPUTS = [
  // Homepage card: 544 × 356
  { file: 'card-bg-water-home.webp', shader: 'water', width: 1088, height: 712 },
  // Helix case study hero: 828 wide, 24px padding around a 2080 × 1170 screenshot
  { file: 'card-bg-water-helix.webp', shader: 'water', width: 1656, height: 974 },
  { file: 'card-bg-mesh.webp', shader: 'mesh', width: 1088, height: 712 },
];

const FORMAT = 'rgba8unorm';
const QUALITY = 0.9;

function renderToWebP(device, { setup, render, params }, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('webgpu');
  context.configure({ device, format: FORMAT, alphaMode: 'premultiplied' });

  const state = {};
  const gpu = { device, context, format: FORMAT };
  setup(device, { gpu, input: null, output: null, params, state });
  render(device, {
    gpu,
    input: null,
    output: context.getCurrentTexture(),
    time: 0,
    deltaTime: 0,
    frame: 0,
    mousePosition: { x: 0, y: 0, down: false },
    renderScale: 1,
    params,
    state,
  });

  // Copied in the same task as the render, while the frame's texture is still current
  const copy = document.createElement('canvas');
  copy.width = width;
  copy.height = height;
  copy.getContext('2d').drawImage(canvas, 0, 0);
  return copy.toDataURL('image/webp', QUALITY);
}

const list = document.getElementById('outputs');
const adapter = await navigator.gpu?.requestAdapter();
if (!adapter) {
  list.textContent = 'This browser has no WebGPU. Try a recent Chrome.';
} else {
  const device = await adapter.requestDevice();
  for (const { file, shader: name, width, height } of OUTPUTS) {
    const url = renderToWebP(device, SHADERS[name], width, height);
    const item = document.createElement('li');
    item.innerHTML = `<a download="${file}" href="${url}">${file}</a> ${width} × ${height}<img src="${url}" alt="">`;
    list.append(item);
  }
  document.body.dataset.done = '';
}
