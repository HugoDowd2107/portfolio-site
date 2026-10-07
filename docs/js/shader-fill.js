// Vanilla port of the Figma MCP shader runtime's <ShaderFill> (procedural shaders only,
// no HTML-in-Canvas input). Mirrors useShaderRuntime.ts / webgpu.ts: one shared device,
// a DPI-independent output texture, and a re-render on every canvas resize.
// If WebGPU is unavailable the canvas is removed, leaving the CSS fallback underneath.

let devicePromise = null;

// Acquiring a GPUDevice is expensive, so every canvas shares one. On failure the cache
// is cleared so a later call can retry.
function acquireDevice() {
  if (!devicePromise) {
    devicePromise = (async () => {
      const gpu = navigator.gpu;
      if (!gpu) throw new Error('WebGPU unsupported.');
      const adapter = await gpu.requestAdapter();
      if (!adapter) throw new Error('Failed to get WebGPU adapter.');
      return adapter.requestDevice();
    })();
    devicePromise.catch(() => { devicePromise = null; });
  }
  return devicePromise;
}

// Shaders read texture.width/height in CSS pixels; keep the physical size alongside.
function makeDpiIndependent(texture, dpi, logicalWidth, logicalHeight) {
  if (texture.physicalWidth !== undefined && texture.physicalHeight !== undefined) {
    return texture;
  }
  const physicalWidth = texture.width;
  const physicalHeight = texture.height;
  Object.defineProperty(texture, 'width', { value: logicalWidth, writable: false, configurable: true, enumerable: true });
  Object.defineProperty(texture, 'height', { value: logicalHeight, writable: false, configurable: true, enumerable: true });
  texture.dpi = dpi;
  texture.physicalWidth = physicalWidth;
  texture.physicalHeight = physicalHeight;
  return texture;
}

const FORMAT = 'rgba8unorm';

function createInputTexture(device, canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpi = canvas.width / rect.width;
  return makeDpiIndependent(
    device.createTexture({
      size: [canvas.width, canvas.height, 1],
      format: FORMAT,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    }),
    dpi,
    rect.width,
    rect.height,
  );
}

export async function mountShaderFill(canvas, shader) {
  let device;
  try {
    device = await acquireDevice();
  } catch (e) {
    console.warn('Failed to acquire WebGPU device', e);
    canvas.remove();
    return;
  }

  const runtime = { context: null, input: null, state: {}, ready: false };

  function render() {
    if (!runtime.ready || !runtime.input) return;
    try {
      const dpi = runtime.input.dpi;
      const outputTexture = runtime.context.getCurrentTexture();
      const output = makeDpiIndependent(outputTexture, dpi, outputTexture.width / dpi, outputTexture.height / dpi);
      shader.render(device, {
        gpu: { device, context: runtime.context, format: FORMAT },
        input: runtime.input,
        output,
        time: 0,
        deltaTime: 0,
        frame: 0,
        mousePosition: { x: 0, y: 0, down: false },
        renderScale: 1,
        params: shader.params,
        state: runtime.state,
      });
    } catch (e) {
      // Treated as transient, matching the upstream runtime
      console.warn('Failed to render effect', e);
    }
  }

  try {
    const context = canvas.getContext('webgpu');
    if (!context) throw new Error('Failed to get WebGPU context.');
    context.configure({ device, format: FORMAT, alphaMode: 'premultiplied' });
    runtime.context = context;
    runtime.input = createInputTexture(device, canvas);
    shader.setup(device, {
      gpu: { device, context, format: FORMAT },
      input: runtime.input,
      output: null,
      params: shader.params,
      state: runtime.state,
    });
    runtime.ready = true;
  } catch (e) {
    console.warn('Failed to initialize shader runtime', e);
    runtime.input?.destroy();
    canvas.remove();
    return;
  }

  // Track device-pixel size so the output stays crisp
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.devicePixelContentBoxSize?.[0]) {
        canvas.width = Math.max(entry.devicePixelContentBoxSize[0].inlineSize, 1);
        canvas.height = Math.max(entry.devicePixelContentBoxSize[0].blockSize, 1);
      } else if (entry.contentBoxSize?.[0]) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(Math.round(entry.contentBoxSize[0].inlineSize * dpr), 1);
        canvas.height = Math.max(Math.round(entry.contentBoxSize[0].blockSize * dpr), 1);
      }
    }
    runtime.input?.destroy();
    try {
      runtime.input = createInputTexture(device, canvas);
    } catch (e) {
      console.warn('Failed to create texture after resizing', e);
      return;
    }
    render();
  });
  try {
    resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
  } catch {
    resizeObserver.observe(canvas);
  }

  render();
}
