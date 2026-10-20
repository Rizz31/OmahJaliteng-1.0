/**
 * Lightweight WebGL Depth Parallax Shader
 * Displaces RGB image/video based on a grayscale depth map texture.
 * Zero three.js, purely vanilla WebGL (~2KB).
 */

const VERT_SHADER = `
attribute vec2 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;

void main() {
  v_uv = a_uv;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SHADER = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform sampler2D u_depth;
uniform vec2 u_offset; // Parallax shift (-0.03 to 0.03)

void main() {
  // Grayscale depth: 1.0 = near (white), 0.0 = far (dark)
  float depth = texture2D(u_depth, v_uv).r;
  
  // Edge-gap protection: slightly scale around center (0.95x scale = 1.05x zoom)
  vec2 centered = (v_uv - 0.5) * 0.95 + 0.5;
  
  // Parallax displacement: near pixels move more than far pixels
  vec2 displacement = (depth - 0.5) * u_offset;
  vec2 uv = clamp(centered + displacement, 0.002, 0.998);
  
  gl_FragColor = texture2D(u_image, uv);
}
`;

export interface DepthShaderController {
  setOffset: (x: number, y: number) => void;
  updateVideoTexture: () => void;
  destroy: () => void;
}

export function initDepthShader(
  canvas: HTMLCanvasElement,
  imageSource: HTMLImageElement | HTMLVideoElement,
  depthMapUrl: string,
  onReady?: () => void,
  onError?: () => void
): DepthShaderController | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
  });

  if (!gl) {
    onError?.();
    return null;
  }

  // Compile shaders
  const createShader = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };

  const vs = createShader(gl.VERTEX_SHADER, VERT_SHADER);
  const fs = createShader(gl.FRAGMENT_SHADER, FRAG_SHADER);
  if (!vs || !fs) {
    onError?.();
    return null;
  }

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    onError?.();
    return null;
  }

  gl.useProgram(prog);

  // Full-screen quad
  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  // pos.x, pos.y, uv.x, uv.y
  const verts = new Float32Array([
    -1, -1,  0,  1,
     1, -1,  1,  1,
    -1,  1,  0,  0,
    -1,  1,  0,  0,
     1, -1,  1,  1,
     1,  1,  1,  0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  const aUv = gl.getAttribLocation(prog, 'a_uv');
  gl.enableVertexAttribArray(aPos);
  gl.enableVertexAttribArray(aUv);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 16, 8);

  const uImageLoc = gl.getUniformLocation(prog, 'u_image');
  const uDepthLoc = gl.getUniformLocation(prog, 'u_depth');
  const uOffsetLoc = gl.getUniformLocation(prog, 'u_offset');

  gl.uniform1i(uImageLoc, 0);
  gl.uniform1i(uDepthLoc, 1);

  // Textures
  const imgTex = gl.createTexture();
  const depthTex = gl.createTexture();

  const setupTexParams = () => {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };

  // Upload image texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, imgTex);
  setupTexParams();
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageSource);
  } catch {
    // If video not ready yet, placeholder
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([50, 30, 20, 255]));
  }

  let depthLoaded = false;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animFrameId: number;

  const render = () => {
    // Smooth dampening
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uOffsetLoc, currentX, currentY);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  // Load depth map image
  const depthImg = new Image();
  depthImg.crossOrigin = 'anonymous';
  depthImg.onload = () => {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, depthTex);
    setupTexParams();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, depthImg);
    depthLoaded = true;
    onReady?.();
    render();
  };
  depthImg.onerror = () => {
    onError?.();
  };
  depthImg.src = depthMapUrl;

  const loop = () => {
    if (depthLoaded) {
      render();
    }
    animFrameId = requestAnimationFrame(loop);
  };
  animFrameId = requestAnimationFrame(loop);

  return {
    setOffset(x: number, y: number) {
      // Clamped subtle amplitude
      targetX = Math.max(-0.035, Math.min(0.035, x * 0.03));
      targetY = Math.max(-0.025, Math.min(0.025, y * 0.02));
    },
    updateVideoTexture() {
      if (!depthLoaded) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imgTex);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageSource);
      } catch {
        // ignore video texture frame skip
      }
    },
    destroy() {
      cancelAnimationFrame(animFrameId);
      gl.deleteProgram(prog);
      gl.deleteBuffer(quadBuf);
      gl.deleteTexture(imgTex);
      gl.deleteTexture(depthTex);
    },
  };
}
