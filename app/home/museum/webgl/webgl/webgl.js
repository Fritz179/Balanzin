const maxQuad = 8192
const maxVerices = 4 * maxQuad
const maxIndexes = 6 * maxQuad

class Program {
  constructor(gl, program) {
    this.gl = gl
    this.program = program
    this.uniforms = new Map()

    this.vao = this.createVAO(['a_Destination', 2], ['a_Source', 2], ['a_Color', 4])

    this.getUniformLocations()
    this.indexes = this.createIndexBuffer(maxIndexes)

    this.currentQuad = 0

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA)
  }

  getUniformLocations() {
    const count = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < count; i++) {
      const info = this.gl.getActiveUniform(this.program, i);

      const location = this.gl.getUniformLocation(this.program, info.name);
      this.uniforms.set(info.name, {type: info.type, location});
    }
  }

  createIndexBuffer(count) {
    const data = []

    for (let i = 0; i < count / 6; i++) {
      [0, 1, 2, 0, 2, 3].forEach(offset => {
        data.push(i * 4 + offset)
      })
    }

    const indexes = new Uint32Array(data);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indexes, this.gl.STATIC_DRAW);

    buffer.length = data.length
    buffer.type = this.gl.UNSIGNED_INT

    return buffer
  }

  createVAO(...args) {
    const map = new Map(args)

    this.stride = 0
    map.forEach(length => this.stride += length);

    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, maxVerices * this.stride * 4, this.gl.STATIC_DRAW);
    this.buffer = new ArrayBuffer(maxVerices * this.stride * 4)
    this.view = new Float32Array(this.buffer)

    let offset = 0
    map.forEach((length, name) => {
      const location = this.gl.getAttribLocation(this.program, name);
      this.gl.vertexAttribPointer(location, length, this.gl.FLOAT, false, this.stride * 4, offset * 4);
      this.gl.enableVertexAttribArray(location);
      offset += length
    })

    return vao
  }

  drawImage(x, y, w, h, img) {
    this.loadVertices([
      x, y, 0, 0, 1, 1, 1, 1,
      x, y + h, 0, 1, 1, 1, 1, 1,
      x + w, y + h, 1, 1, 1, 1, 1, 1,
      x + w, y, 1, 0, 1, 1, 1, 1
    ])
  }

  loadVertices(vertices) {
    if (this.currentQuad >= maxQuad) {
      this.render(true)
    }
    this.view.set(vertices, this.currentQuad * this.stride * 4) // view is't in bytes

    this.currentQuad++
  }

  setUniform(name, ...args) {
    const data = args.flat(Infinity)

    const uniform = this.uniforms.get(name)
    if (!uniform) return console.warn(`Invalid uniform name: ${name}`)

    switch (uniform.type) {
      case this.gl.FLOAT:
        this.gl.uniform1fv(uniform.location, [data]);
        break;
      case this.gl.FLOAT_VEC2:
        this.gl.uniform2fv(uniform.location, data);
        break;
      case this.gl.FLOAT_VEC3:
        this.gl.uniform3fv(uniform.location, data);
        break;
      case this.gl.FLOAT_VEC4:
        this.gl.uniform4fv(uniform.location, data);
        break;
      case this.gl.BOOL:
      case this.gl.INT:
        this.gl.uniform1iv(uniform.location, [data]);
        break;
      case this.gl.BOOL_VEC2:
      case this.gl.INT_VEC2:
        this.gl.uniform2iv(uniform.location, data);
        break;
      case this.gl.BOOL_VEC3:
      case this.gl.INT_VEC3:
        this.gl.uniform3iv(uniform.location, data);
        break;
      case this.gl.BOOL_VEC4:
      case this.gl.INT_VEC4:
        this.gl.uniform4iv(uniform.location, data);
        break;
      case this.gl.FLOAT_MAT2:
        this.gl.uniformMatrix2fv(uniform.location, false, data)
        break;
      case this.gl.FLOAT_MAT3:
        this.gl.uniformMatrix3fv(uniform.location, false, data)
        break;
      case this.gl.FLOAT_MAT4:
        this.gl.uniformMatrix4fv(uniform.location, false, data)
        break;

      default:
        console.error(uniform);

     }
  }

  loadImage(path) {
    return new Promise(resolve => {
      const image = new Image();
      image.src = path;

      image.onload = () => {
        const texture = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        resolve()
      }

      image.onerror = () => console.warn(`Erorr loading: ${path}`);
    })
  }

  render(reset = true) {

    // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexes);
    // this.gl.bindVertexArray(this.vao)

    const quadLength = this.stride * 4 * 4
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.buffer)

    this.gl.drawElements(this.gl.TRIANGLES, this.currentQuad * 6, this.indexes.type, 0);

    if (reset) this.currentQuad = 0
  }

  clear(r = 1, g, b, a = 1) {
    this.gl.clearColor(r, g ?? r, b ?? r, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}

export default class WebGl {
  constructor(w, h) {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);

    this.canvas.width = w
    this.canvas.height = h

    this.gl = this.canvas.getContext('webgl2', { antialias: false }, 'false');
    // this.gl = this.canvas.getContext('webgl2');
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
  }

  createProgram(vertShaderSource, fragShaderSource) {
    if (vertShaderSource.match(/.glsl$/)) {
      return new Promise(resolve => {
        Promise.all([fetch(vertShaderSource), fetch(fragShaderSource)]).then(([v, f]) => {
          Promise.all([v.text(), f.text()]).then(([v, f]) => {
            resolve(this.createProgram(v, f))
          })
        })
      })
    }

    const vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.gl.shaderSource(vertShader, vertShaderSource);
    this.gl.shaderSource(fragShader, fragShaderSource);

    this.gl.compileShader(vertShader);
    this.gl.compileShader(fragShader);

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertShader);
    this.gl.attachShader(program, fragShader);

    this.gl.linkProgram(program);

    this.gl.useProgram(program);

    return new Program(this.gl, program)
  }
}
