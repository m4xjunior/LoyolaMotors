// ============================================================
// COMPONENTE ORB - Background animado WebGL (ReactBits)
// Fonte: https://reactbits.dev/backgrounds/orb
// Dependencia: npm install ogl
// ============================================================
//
// COMO USAR:
// <Orb
//   hue={13}              // Cor do orb (0-360 graus). 0=roxo, 13=vermelho, 120=verde, 240=azul
//   hoverIntensity={2.64} // Intensidade da distorcao ao passar o mouse (0=nenhuma, 5=muito forte)
//   rotateOnHover={false}  // Se o orb gira quando o mouse esta em cima (true/false)
//   forceHoverState={true} // Forca o efeito de hover permanentemente (true/false)
//   backgroundColor="#111111" // Cor de fundo atras do orb (hex)
// />
//
// O container pai DEVE ter width e height definidos para o orb aparecer.
// ============================================================

import { Mesh, Program, Renderer, Triangle, Vec3 } from 'ogl'; // Biblioteca WebGL leve
import { useEffect, useRef } from 'react';
import './Orb.css';

export default function Orb({
  hue = 0,                    // Matiz/cor do orb em graus (0-360). Ex: 0=roxo, 13=vermelho, 200=azul
  hoverIntensity = 0.2,       // Quanto o orb distorce ao passar o mouse (0 a ~5)
  rotateOnHover = true,        // Ativa rotacao do orb quando o mouse esta sobre ele
  forceHoverState = false,     // Forca o estado de hover (animacao distorcida) permanentemente
  backgroundColor = '#000000'  // Cor de fundo - deve combinar com o fundo da pagina
}) {
  const ctnDom = useRef(null); // Referencia ao container DOM onde o canvas WebGL sera inserido

  // ============================================================
  // SHADER DE VERTICE (GLSL) - Posiciona os pixels na tela
  // Nao precisa mexer aqui, e padrao para efeitos fullscreen
  // ============================================================
  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // ============================================================
  // SHADER DE FRAGMENTO (GLSL) - Gera o efeito visual do orb
  // Aqui e onde a "magia" acontece. Cada pixel e calculado aqui.
  // ============================================================
  const frag = /* glsl */ `
    precision highp float;

    uniform float iTime;           // Tempo da animacao (incrementa automaticamente)
    uniform vec3 iResolution;      // Resolucao do canvas (largura, altura, proporcao)
    uniform float hue;             // Matiz/cor recebida da prop
    uniform float hover;           // Valor de hover (0=fora, 1=dentro) - transicao suave
    uniform float rot;             // Angulo de rotacao acumulado
    uniform float hoverIntensity;  // Intensidade da distorcao de hover
    uniform vec3 backgroundColor;  // Cor de fundo convertida para RGB normalizado
    varying vec2 vUv;

    // Converte RGB para espaco de cor YIQ (usado para rotacionar a matiz)
    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }

    // Converte YIQ de volta para RGB
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }

    // Ajusta a matiz de uma cor - e assim que a prop "hue" muda a cor do orb
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0; // Converte graus para radianos
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    // Funcao hash para gerar ruido pseudo-aleatorio (usado no efeito organico)
    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    // Ruido Simplex 3D - gera o movimento organico/fluido do orb
    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    // Extrai canal alpha da cor (para transparencia nas bordas do orb)
    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    // ============================================================
    // CORES BASE DO ORB - Voce pode alterar aqui para mudar as cores internas
    // Os valores vao de 0.0 a 1.0 (equivalente a 0-255 dividido por 255)
    // ============================================================
    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078); // Roxo vibrante
    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725); // Azul ciano
    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000); // Azul escuro

    const float innerRadius = 0.6;  // Raio interno do orb (0.0 a 1.0) - maior = orb maior
    const float noiseScale = 0.65;  // Escala do ruido - maior = textura mais detalhada

    // Funcoes de iluminacao - controlam o brilho e reflexos do orb
    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);        // Decaimento linear
    }
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);  // Decaimento quadratico (mais suave)
    }

    // Funcao principal de desenho - calcula a cor de cada pixel do orb
    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue); // Aplica o hue nas cores base
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);

      float ang = atan(uv.y, uv.x);           // Angulo do pixel em relacao ao centro
      float len = length(uv);                  // Distancia do pixel ao centro
      float invLen = len > 0.0 ? 1.0 / len : 0.0;

      float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114)); // Brilho do fundo

      // Gera ruido animado para o efeito organico
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);       // Iluminacao principal do orb

      v0 *= smoothstep(r0 * 1.05, r0, len);   // Borda suave do orb
      float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
      v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5; // Gradiente rotativo de cor

      // Ponto de luz que orbita ao redor do orb
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);         // Brilho do ponto orbital
      v1 *= light1(1.0, 50.0, d0);

      // Mascaras de suavizacao para as bordas
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

      // Mistura as cores baseado na posicao e tempo
      vec3 colBase = mix(color1, color2, cl);
      float fadeAmount = mix(1.0, 0.1, bgLuminance);

      // Versao escura (para fundos escuros)
      vec3 darkCol = mix(color3, colBase, v0);
      darkCol = (darkCol + v1) * v2 * v3;
      darkCol = clamp(darkCol, 0.0, 1.0);

      // Versao clara (para fundos claros)
      vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
      lightCol = mix(backgroundColor, lightCol, v0);
      lightCol = clamp(lightCol, 0.0, 1.0);

      // Mistura entre versao escura e clara baseado no brilho do fundo
      vec3 finalCol = mix(darkCol, lightCol, bgLuminance);

      return extractAlpha(finalCol);
    }

    // Processa cada pixel: centraliza, aplica rotacao e distorcao de hover
    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0; // Normaliza coordenadas (-1 a 1)

      // Aplica rotacao (quando rotateOnHover esta ativo)
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

      // Aplica distorcao ondulada no hover (controlada por hoverIntensity)
      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);

      return draw(uv);
    }

    // Ponto de entrada do shader - converte coordenadas e renderiza
    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

  // ============================================================
  // LOGICA DO COMPONENTE REACT
  // Inicializa o WebGL, gerencia eventos e loop de animacao
  // ============================================================
  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    // Cria o renderizador WebGL com transparencia
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0); // Fundo transparente
    container.appendChild(gl.canvas); // Insere o canvas no DOM

    // Cria a geometria (triangulo fullscreen) e o programa de shader
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },                    // Tempo (incrementa a cada frame)
        iResolution: {                           // Resolucao do canvas
          value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
        },
        hue: { value: hue },                    // Matiz da cor
        hover: { value: 0 },                    // Estado de hover (0 ou 1, com transicao suave)
        rot: { value: 0 },                      // Angulo de rotacao
        hoverIntensity: { value: hoverIntensity }, // Intensidade da distorcao
        backgroundColor: { value: hexToVec3(backgroundColor) } // Cor de fundo em RGB
      }
    });

    const mesh = new Mesh(gl, { geometry, program }); // Junta geometria + shader

    // Redimensiona o canvas quando a janela muda de tamanho
    function resize() {
      if (!container) return;
      const dpr = window.devicePixelRatio || 1; // Suporte a telas retina
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = width + 'px';
      gl.canvas.style.height = height + 'px';
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    let targetHover = 0;              // Estado alvo do hover (0=fora, 1=dentro)
    let lastTime = 0;                 // Ultimo timestamp para calcular delta time
    let currentRot = 0;               // Angulo de rotacao acumulado
    const rotationSpeed = 0.3;        // Velocidade de rotacao (radianos por segundo)

    // Detecta se o mouse esta sobre o orb (dentro do raio 0.8)
    const handleMouseMove = e => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;

      if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
        targetHover = 1;  // Mouse dentro do orb
      } else {
        targetHover = 0;  // Mouse fora do orb
      }
    };

    // Quando o mouse sai do container, desativa hover
    const handleMouseLeave = () => {
      targetHover = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Loop de animacao - roda ~60x por segundo
    let rafId;
    const update = t => {
      rafId = requestAnimationFrame(update);
      const dt = (t - lastTime) * 0.001;        // Delta time em segundos
      lastTime = t;
      program.uniforms.iTime.value = t * 0.001;  // Atualiza tempo do shader
      program.uniforms.hue.value = hue;           // Atualiza cor
      program.uniforms.hoverIntensity.value = hoverIntensity; // Atualiza intensidade
      program.uniforms.backgroundColor.value = hexToVec3(backgroundColor); // Atualiza fundo

      // Se forceHoverState=true, hover e sempre 1 (efeito ativo permanente)
      const effectiveHover = forceHoverState ? 1 : targetHover;
      // Transicao suave do hover (lerp com fator 0.1)
      program.uniforms.hover.value += (effectiveHover - program.uniforms.hover.value) * 0.1;

      // Rotaciona o orb se rotateOnHover esta ativo E o mouse esta sobre o orb
      if (rotateOnHover && effectiveHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }
      program.uniforms.rot.value = currentRot;

      renderer.render({ scene: mesh }); // Renderiza o frame
    };
    rafId = requestAnimationFrame(update); // Inicia o loop

    // Limpeza ao desmontar o componente (evita memory leaks)
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext(); // Libera contexto WebGL
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState, backgroundColor]);

  return <div ref={ctnDom} className="orb-container" />;
}

// ============================================================
// FUNCOES AUXILIARES - Conversao de cores
// ============================================================

// Converte HSL (matiz, saturacao, luminosidade) para RGB como Vec3
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Cinza (sem saturacao)
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return new Vec3(r, g, b);
}

// Converte cor hex (#ff3d24), rgb() ou hsl() para Vec3 (valores 0.0 a 1.0)
function hexToVec3(color) {
  // Formato hex: #rrggbb
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    return new Vec3(r, g, b);
  }

  // Formato rgb(r, g, b) ou rgba(r, g, b, a)
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return new Vec3(parseInt(rgbMatch[1]) / 255, parseInt(rgbMatch[2]) / 255, parseInt(rgbMatch[3]) / 255);
  }

  // Formato hsl(h, s%, l%) ou hsla(h, s%, l%, a)
  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    return hslToRgb(h, s, l);
  }

  return new Vec3(0, 0, 0); // Fallback: preto
}
