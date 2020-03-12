const config = {
    active: true,
    seed: 1,
    skyType: 'atmosphere',
    skyColor: '#5200ff',
    horizonColor: '#ccc',
    lighting: 'distant',
    lightPosition: {
        x: 0,
        y: 0.02,
        z: -0.46
    },
    fog: 0.8,
    flatShading: false,
    playArea: 1,
    ground: 'hills',
    groundYScale: 4,
    groundTexture: 'color',
    groundColor: '#000',
    groundColor2: '#000',
    dressing: 'cylinders',
    dressingAmount: 2000,
    dressingColor: '#000',
    dressingScale: 0.1,
    dressingVariance: {
        x: 0.1,
        y: 100,
        z: 0.1
    },
    dressingUniformScale: true,
    dressingOnPlayArea: 0,
    shadow: true
}

/* global AFRAME, THREE */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * enviroGetSettings() - console function for printing out the current environment settings
 */
function enviroGetSettings() {
    document.querySelector('[environment]').components['environment'].logPreset();
}

AFRAME.registerComponent('environment', {
    schema: {
        active: {
            default: false
        },
        preset: {
            default: 'forest'
        },
        seed: {
            type: 'int',
            default: 1,
            min: 0,
            max: 1000
        },

        skyType: {
            default: 'color',
            oneOf: ['none', 'color', 'gradient', 'atmosphere']
        },
        skyColor: {
            type: 'color'
        },
        horizonColor: {
            type: 'color'
        },
        lighting: {
            default: 'distant',
            oneOf: ['none', 'distant', 'point']
        },
        shadow: {
            default: false
        },
        shadowSize: {
            default: 10
        },
        lightPosition: {
            type: 'vec3',
            default: {
                x: 0,
                y: 1,
                z: -0.2
            }
        },
        fog: {
            type: 'float',
            default: 0,
            min: 0,
            max: 1
        },

        flatShading: {
            default: false
        },
        playArea: {
            type: 'float',
            default: 1,
            min: 0.5,
            max: 10
        },

        ground: {
            default: 'hills',
            oneOf: ['none', 'flat', 'hills', 'canyon', 'spikes', 'noise']
        },
        groundYScale: {
            type: 'float',
            default: 3,
            min: 0,
            max: 50
        },
        groundTexture: {
            default: 'none',
            oneOf: ['none', 'checkerboard', 'squares', 'walkernoise']
        },
        groundColor: {
            type: 'color',
            default: '#553e35'
        },
        groundColor2: {
            type: 'color',
            default: '#694439'
        },

        dressing: {
            default: 'mushrooms',
            oneOf: ['none', 'cubes', 'pyramids', 'cylinders', 'hexagons', 'stones', 'trees', 'mushrooms', 'towers', 'apparatus', 'arches', 'torii']
        },
        dressingAmount: {
            type: 'int',
            default: 10,
            min: 0,
            max: 1000
        },
        dressingColor: {
            type: 'color',
            default: '#795449'
        },
        dressingScale: {
            type: 'float',
            default: 5,
            min: 0,
            max: 100
        },
        dressingVariance: {
            type: 'vec3',
            default: {
                x: 1,
                y: 1,
                z: 1
            }
        },
        dressingUniformScale: {
            default: true
        },
        dressingOnPlayArea: {
            type: 'float',
            default: 0,
            min: 0,
            max: 1
        },

        grid: {
            default: 'none',
            oneOf: ['none', '1x1', '2x2', 'crosses', 'dots', 'xlines', 'ylines']
        },
        gridColor: {
            type: 'color',
            default: '#ccc'
        }
    },

    multiple: false,

    presets: {
        'none': {},
        'forest': config
    },

    init: function () {
        // stage ground diameter (and sky radius)
        this.STAGE_SIZE = 200;

        // data for dressing meshes
        this.assets = {
            'mushrooms': [
                {
                    type: 'lathe',
                    noise: 0.02,
                    segments: 14,
                    vertices: [0.000001, 0.006, 0.13, 0.018, 0.341, 0.084, 0.437, 0.144, 0.492, 0.234, 0.484, 0.246, 0.276, 0.232, 0.107, 0.284, 0.046, 0.346, 0.062, 0.852, 0.097, 0.956, 0.166, 0.998]
                },
                {
                    type: 'lathe',
                    noise: 0.02,
                    segments: 10,
                    vertices: [0.000001, 0.562, 0.091, 0.572, 0.172, 0.61, 0.223, 0.666, 0.256, 0.74, 0.258, 0.806, 0.246, 0.824, 0.062, 0.826, 0.065, 0.948, 0.097, 0.998]
                },
                {
                    type: 'lathe',
                    noise: 0.02,
                    segments: 10,
                    vertices: [0.000001, 0.768, 0.099, 0.772, 0.219, 0.802, 0.306, 0.844, 0.352, 0.886, 0.352, 0.908, 0.118, 0.904, 0.107, 0.93, 0.115, 0.966, 0.14, 0.996]
                }
            ],
            'trees': [
                {
                    type: 'lathe',
                    noise: 0.015,
                    segments: 6,
                    vertices: [0.000001, 0.826, 0.054, 0.832, 0.105, 0.854, 0.136, 0.9, 0.136, 0.958, 0.118, 0.994]
                },
                {
                    type: 'lathe',
                    noise: 0.015,
                    segments: 14,
                    vertices: [0.000001, 0.01, 0.069, 0.022, 0.13, 0.068, 0.178, 0.18, 0.189, 0.32, 0.191, 0.59, 0.193, 0.75, 0.138, 0.79, 0.018, 0.808, 0.018, 0.996]
                },
                {
                    type: 'lathe',
                    noise: 0.015,
                    segments: 14,
                    vertices: [0.000001, 0.436, 0.126, 0.46, 0.201, 0.57, 0.219, 0.72, 0.154, 0.846, 0.028, 0.884, 0.034, 0.996]
                }
            ],
            'hexagons': [
                {
                    type: 'extrude',
                    vertices: [-0.198, -0.302, 0.197, -0.3, 0.372, 0, 0.199, 0.298, -0.202, 0.298, -0.368, 0]
                }
            ]
        };

        // scale down dressing meshes (coordinates were saved in integers for better compression)
        for (var i in this.assets) {
            for (var j = 0; j < this.assets[i].length; j++) {
                var asset = this.assets[i][j];
                if (asset.type != 'mesh') continue;
                for (var v = 0, len = asset.vertices.length; v < len; v++) {
                    asset.vertices[v] /= 1000.0;
                }
            }
        }

        // save current scene fog
        this.userFog = this.el.sceneEl.getAttribute('fog');

        // create sky
        this.sky = document.createElement('a-sky');
        this.sky.setAttribute('radius', this.STAGE_SIZE);
        this.sky.setAttribute('theta-length', 110);
        this.sky.classList.add('environment');

        // stars are created when needed
        this.stars = null;

        // create ground
        this.groundMaterial = null;
        this.ground = document.createElement('a-entity');
        this.ground.setAttribute('rotation', '-90 0 0');
        this.ground.classList.add('environmentGround');
        this.ground.classList.add('environment');
        this.groundCanvas = null;
        this.groundTexture = null;
        this.groundMaterial = null;
        this.groundGeometry = null;

        this.dressing = document.createElement('a-entity');
        this.dressing.classList.add('environmentDressing');
        this.dressing.classList.add('environment');

        this.gridCanvas = null;
        this.gridTexture = null;

        // create lights (one ambient hemisphere light, and one directional for the sun)
        this.hemilight = document.createElement('a-entity');
        this.hemilight.classList.add('environment');
        this.hemilight.setAttribute('position', '0 50 0');
        this.hemilight.setAttribute('light', {
            type: 'hemisphere',
            color: '#CEE4F0',
            intensity: 0.4
        });
        this.sunlight = document.createElement('a-entity');
        this.sunlight.classList.add('environment');
        this.sunlight.setAttribute('position', this.data.lightPosition);
        this.sunlight.setAttribute('light', {
            intensity: 0.6
        });

        // add everything to the scene
        this.el.appendChild(this.hemilight);
        this.el.appendChild(this.sunlight);
        this.el.appendChild(this.ground);
        this.el.appendChild(this.dressing);
        this.el.appendChild(this.sky);
    },

    // returns a fog color from a specific sky type and sun height
    getFogColor: function (skyType, sunHeight) {

        var fogColor;
        if (skyType == 'color' || skyType == 'none') {
            fogColor = new THREE.Color(this.data.skyColor);
        } else if (skyType == 'gradient') {
            fogColor = new THREE.Color(this.data.horizonColor);
        } else if (skyType == 'atmosphere') {
            var fogRatios = [1, 0.5, 0.22, 0.1, 0.05, 0];
            var fogColors = ['#C0CDCF', '#81ADC5', '#525e62', '#2a2d2d', '#141616', '#000'];

            if (sunHeight <= 0) return '#000';

            sunHeight = Math.min(1, sunHeight);

            for (var i = 0; i < fogRatios.length; i++) {
                if (sunHeight > fogRatios[i]) {
                    var c1 = new THREE.Color(fogColors[i - 1]);
                    var c2 = new THREE.Color(fogColors[i]);
                    var a = (sunHeight - fogRatios[i]) / (fogRatios[i - 1] - fogRatios[i]);
                    c2.lerp(c1, a);
                    fogColor = c2;
                    break;
                }
            }
        }
        // dim down the color
        fogColor.multiplyScalar(0.9);
        // mix it a bit with ground color
        fogColor.lerp(new THREE.Color(this.data.groundColor), 0.3);

        return '#' + fogColor.getHexString();
    },

    update: function (oldData) {
        // preset changed
        if (!oldData || (oldData.preset === undefined || oldData.preset !== this.data.preset)) {
            var newData = Object.assign({}, this.presets[this.data.preset]);
            if (!oldData || oldData.preset === undefined) {
                Object.assign(newData, this.el.components.environment.attrValue);
            }
            this.el.setAttribute('environment', newData);
            if (oldData) {
                return;
            } else {
                oldData = {};
            }
        }

        var skyType = this.data.skyType;
        var sunPos = new THREE.Vector3(this.data.lightPosition.x, this.data.lightPosition.y, this.data.lightPosition.z);
        sunPos.normalize();

        // update light colors and intensities
        if (this.sunlight) {
            this.sunlight.setAttribute('position', this.data.lightPosition);
            if (skyType != 'atmosphere') {
                // dim down the sky color for the light
                var skycol = new THREE.Color(this.data.skyColor);
                skycol.r = (skycol.r + 1.0) / 2.0;
                skycol.g = (skycol.g + 1.0) / 2.0;
                skycol.b = (skycol.b + 1.0) / 2.0;
                this.hemilight.setAttribute('light', {
                    'color': '#' + skycol.getHexString()
                });
                this.sunlight.setAttribute('light', {
                    'intensity': 0.6
                });
                this.hemilight.setAttribute('light', {
                    'intensity': 0.6
                });
            } else {
                this.sunlight.setAttribute('light', {
                    'intensity': 0.1 + sunPos.y * 0.5
                });
                this.hemilight.setAttribute('light', {
                    'intensity': 0.1 + sunPos.y * 0.5
                });
            }

            this.sunlight.setAttribute('light', {
                castShadow: this.data.shadow,
                shadowCameraLeft: -this.data.shadowSize,
                shadowCameraBottom: -this.data.shadowSize,
                shadowCameraRight: this.data.shadowSize,
                shadowCameraTop: this.data.shadowSize
            });
        }

        // update sky colors
        if (skyType != oldData.skyType ||
            this.data.skyColor != oldData.skyColor ||
            this.data.horizonColor != oldData.horizonColor) {

            this.sky.removeAttribute('material');

            var mat = {};
            mat.shader = {
                'none': 'flat',
                'color': 'flat',
                'gradient': 'gradientshader',
                'atmosphere': 'skyshader'
            }[skyType];
            if (this.stars) {
                this.stars.setAttribute('visible', skyType == 'atmosphere');
            }
            if (skyType == 'color') {
                mat.color = this.data.skyColor;
                mat.fog = false;
            } else if (skyType == 'gradient') {
                mat.topColor = this.data.skyColor;
                mat.bottomColor = this.data.horizonColor;
            }
            this.sky.setAttribute('material', mat);
        }

        // set atmosphere sun position and stars
        if (skyType == 'atmosphere') {
            this.sky.setAttribute('material', {
                'sunPosition': sunPos
            });
            this.setStars((1 - Math.max(0, (sunPos.y + 0.08) * 8)) * 2000);
        }

        // set fog color
        if (this.data.fog > 0) {
            this.el.sceneEl.setAttribute('fog', {
                color: this.getFogColor(skyType, sunPos.y),
                far: (1.01 - this.data.fog) * this.STAGE_SIZE * 2
            });
        } else {
            this.el.sceneEl.removeAttribute('fog');
        }

        // scene lights
        this.sunlight.setAttribute('light', {
            type: this.data.lighting == 'point' ? 'point' : 'directional'
        });
        this.sunlight.setAttribute('visible', this.data.lighting !== 'none');
        this.hemilight.setAttribute('visible', this.data.lighting !== 'none');

        // check if ground geometry needs to be calculated
        var updateGroundGeometry = !this.groundGeometry ||
            this.data.seed != oldData.seed ||
            this.data.ground != oldData.ground ||
            this.data.playArea != oldData.playArea ||
            this.data.flatShading != oldData.flatShading;

        // check if any parameter of the ground was changed, and update it
        if (updateGroundGeometry ||
            this.data.groundColor != oldData.groundColor ||
            this.data.groundColor2 != oldData.groundColor2 ||
            this.data.groundYScale != oldData.groundYScale ||
            this.data.groundTexture != oldData.groundTexture ||
            this.data.gridColor != oldData.gridColor ||
            this.data.grid != oldData.grid
        ) {
            this.updateGround(updateGroundGeometry);
            // set bounce light color to ground color
            if (this.hemilight) this.hemilight.setAttribute('light', {
                'groundColor': this.data.groundColor
            });
        }

        // update dressing
        if (this.data.seed != oldData.seed ||
            this.data.dressingOnPlayArea != oldData.dressingOnPlayArea ||
            this.data.dressing != oldData.dressing ||
            this.data.flatShading != oldData.flatShading ||
            this.data.dressingAmount != oldData.dressingAmount ||
            this.data.dressingScale != oldData.dressingScale ||
            this.data.dressingColor != oldData.dressingColor ||
            this.data.dressingVariance.x != oldData.dressingVariance.x ||
            this.data.dressingVariance.y != oldData.dressingVariance.y ||
            this.data.dressingVariance.z != oldData.dressingVariance.z ||
            this.data.dressingUniformScale != oldData.dressingUniformScale
        ) {
            this.updateDressing();
        }

        this.sky.setAttribute('visible', skyType !== 'none');

        this.el.setAttribute('visible', this.data.active);
        if (!this.data.active) {
            if (this.userFog) {
                this.el.sceneEl.setAttribute('fog', this.userFog);
            } else {
                this.el.sceneEl.removeAttribute('fog');
            }
        }

        // dump current component settings to console
        this.dumpParametersDiff();
    },

    // logs current parameters to console, for saving to a preset
    logPreset: function () {
        var str = '{';
        for (var i in this.schema) {
            if (i == 'preset') continue;
            str += i + ': ';
            var type = this.schema[i].type;
            if (type == 'vec3') {
                str += '{ x: ' + this.data[i].x + ', y: ' + this.data[i].y + ', z: ' + this.data[i].z + '}';
            } else if (type == 'string' || type == 'color') {
                str += '"' + this.data[i] + '"';
            } else {
                str += this.data[i];
            }
            str += ', ';
        }
        str += '}';
    },

    // dumps current component settings to console.
    dumpParametersDiff: function () {

        // trim number to 3 decimals
        function dec3(v) {
            return Math.floor(v * 1000) / 1000;
        }

        var params = [];
        var usingPreset = this.data.preset != 'none' ? this.presets[this.data.preset] : false;

        if (usingPreset) {
            params.push('preset: ' + this.data.preset);
        }

        for (var i in this.schema) {
            if (i == 'preset' || (usingPreset && usingPreset[i] === undefined)) {
                continue;
            }
            var def = usingPreset ? usingPreset[i] : this.schema[i].default;
            var data = this.data[i];
            var type = this.schema[i].type;
            if (type == 'vec3') {
                var coords = def;
                if (typeof (def) == 'string') {
                    def = def.split(' ');
                    coords = {
                        x: def[0],
                        y: def[1],
                        z: def[2]
                    };
                }
                if (dec3(coords.x) != dec3(data.x) || dec3(coords.y) != dec3(data.y) || dec3(coords.z) != dec3(data.z)) {
                    params.push(i + ': ' + dec3(data.x) + ' ' + dec3(data.y) + ' ' + dec3(data.z));
                }
            } else {
                if (def != data) {
                    if (this.schema[i].type == 'number') {
                        data = dec3(data);
                    }
                    params.push(i + ': ' + data);
                }
            }
        }
    },

    // Custom Math.random() with seed. Given this.data.seed and x, it always returns the same "random" number
    random: function (x) {
        return parseFloat('0.' + Math.sin(this.data.seed * 9999 * x).toString().substr(7));
    },


    // updates ground attributes, and geometry if required
    updateGround: function (updateGeometry) {

        var resolution = 64; // number of divisions of the ground mesh

        if (updateGeometry) {
            var visibleground = this.data.ground != 'none';
            this.ground.setAttribute('visible', visibleground);
            if (!visibleground) {
                return;
            }

            if (!this.groundGeometry) {
                this.groundGeometry = new THREE.PlaneGeometry(this.STAGE_SIZE + 2, this.STAGE_SIZE + 2, resolution - 1, resolution - 1);
            }
            var perlin = new PerlinNoise();
            var verts = this.groundGeometry.vertices;
            var numVerts = this.groundGeometry.vertices.length;
            var frequency = 10;
            var inc = frequency / resolution;

            for (var i = 0, x = 0, y = 0; i < numVerts; i++) {
                if (this.data.ground == 'flat') {
                    verts[i].z = 0;
                    continue;
                }

                var h;
                switch (this.data.ground) {
                    case 'hills':
                        {
                            h = Math.max(0, perlin.noise(x, y, 0));
                            break;
                        }
                    case 'canyon':
                        {
                            h = 0.2 + perlin.noise(x, y, 0) * 0.8;
                            h = Math.min(1, Math.pow(h, 2) * 10);
                            break;
                        }
                    case 'spikes':
                        {
                            h = this.random(i) < 0.02 ? this.random(i + 1) : 0;
                            break;
                        }
                    case 'noise':
                        {
                            h = this.random(i) < 0.35 ? this.random(i + 1) : 0;
                            break;
                        }
                }

                h += this.random(i + 2) * 0.1; // add some randomness

                // flat ground in the center
                var xx = x * 2 / frequency - 1;
                var yy = y * 2 / frequency - 1;
                var pa = this.data.playArea;
                xx = Math.max(0, Math.min(1, (Math.abs(xx) - (pa - 0.9)) * (1 / pa)));
                yy = Math.max(0, Math.min(1, (Math.abs(yy) - (pa - 0.9)) * (1 / pa)));
                h *= xx > yy ? xx : yy;
                if (h < 0.01) h = 0; // stick to the floor

                // set height
                verts[i].z = h;

                // calculate next x,y ground coordinates
                x += inc;
                if (x >= 10) {
                    x = 0;
                    y += inc;
                }
            }

            this.groundGeometry.computeFaceNormals();
            if (this.data.flatShading) {
                this.groundGeometry.computeFlatVertexNormals();
            } else {
                this.groundGeometry.computeVertexNormals();
            }

            this.groundGeometry.verticesNeedUpdate = true;
            this.groundGeometry.normalsNeedUpdate = true;
        }

        // apply Y scale. There's no need to recalculate the geometry for this. Just change scale
        this.ground.setAttribute('scale', {
            z: this.data.groundYScale
        });

        // update ground, playarea and grid textures.
        var groundResolution = 2048;
        var texMeters = 20; // ground texture of 20 x 20 meters
        var texRepeat = this.STAGE_SIZE / texMeters;

        if (!this.groundCanvas || this.groundCanvas.width != groundResolution) {
            this.gridCanvas = document.createElement('canvas');
            this.gridCanvas.width = groundResolution;
            this.gridCanvas.height = groundResolution;
            this.gridTexture = new THREE.Texture(this.gridCanvas);
            this.gridTexture.wrapS = THREE.RepeatWrapping;
            this.gridTexture.wrapT = THREE.RepeatWrapping;
            this.gridTexture.repeat.set(texRepeat, texRepeat);

            this.groundCanvas = document.createElement('canvas');
            this.groundCanvas.width = groundResolution;
            this.groundCanvas.height = groundResolution;
            this.groundTexture = new THREE.Texture(this.groundCanvas);
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(texRepeat, texRepeat);

            // ground material diffuse map is the regular ground texture and the grid texture
            // is used in the emissive map. This way, the grid is always equally visible, even at night.
            this.groundMaterialProps = {
                map: this.groundTexture,
                emissive: new THREE.Color(0xFFFFFF),
                emissiveMap: this.gridTexture
            };

            // use .shading for A-Frame < 0.7.0 and .flatShading for A-Frame >= 0.7.0
            if (new THREE.Material().hasOwnProperty('shading')) {
                this.groundMaterialProps.shading = this.data.flatShading ? THREE.FlatShading : THREE.SmoothShading;
            } else {
                this.groundMaterialProps.flatShading = this.data.flatShading;
            }

            this.groundMaterial = new THREE.MeshLambertMaterial(this.groundMaterialProps);
        }

        var groundctx = this.groundCanvas.getContext('2d');
        var gridctx = this.gridCanvas.getContext('2d');

        this.drawTexture(groundctx, groundResolution, texMeters);

        gridctx.fillStyle = '#000000';
        gridctx.fillRect(0, 0, groundResolution, groundResolution);
        this.drawGrid(gridctx, groundResolution, texMeters);

        this.groundTexture.needsUpdate = true;
        this.gridTexture.needsUpdate = true;

        if (updateGeometry) {
            var mesh = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
            this.ground.setObject3D('mesh', mesh);
        } else {
            this.ground.getObject3D('mesh').material = this.groundMaterial;
        }

        this.ground.setAttribute('shadow', {
            cast: false,
            receive: this.data.shadow
        });
    },

    // draw grid to a canvas context
    drawGrid: function (ctx, size, texMeters) {

        if (this.data.grid == 'none') return;

        // one grid feature each 2 meters

        var num = Math.floor(texMeters / 2);
        var step = size / (texMeters / 2); // 2 meters == <step> pixels
        var i, j, ii;

        ctx.fillStyle = this.data.gridColor;

        switch (this.data.grid) {
            case '1x1':
            case '2x2':
                {
                    if (this.data.grid == '1x1') {
                        num = num * 2;
                        step = size / texMeters;
                    }
                    for (i = 0; i < num; i++) {
                        ii = Math.floor(i * step);
                        ctx.fillRect(0, ii, size, 1);
                        ctx.fillRect(ii, 0, 1, size);
                    }
                    break;
                }
            case 'crosses':
                {
                    var l = Math.floor(step / 20);
                    for (i = 0; i < num + 1; i++) {
                        ii = Math.floor(i * step);
                        for (j = 0; j < num + 1; j++) {
                            var jj = Math.floor(-l + j * step);
                            ctx.fillRect(jj, ii, l * 2, 1);
                            ctx.fillRect(ii, jj, 1, l * 2);
                        }
                    }
                    break;
                }
            case 'dots':
                {
                    for (i = 0; i < num + 1; i++) {
                        for (j = 0; j < num + 1; j++) {
                            ctx.beginPath();
                            ctx.arc(Math.floor(j * step), Math.floor(i * step), 4, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                    break;
                }
            case 'xlines':
                {
                    for (i = 0; i < num; i++) {
                        ctx.fillRect(Math.floor(i * step), 0, 1, size);
                    }
                    break;
                }
            case 'ylines':
                {
                    for (i = 0; i < num; i++) {
                        ctx.fillRect(0, Math.floor(i * step), size, 1);
                    }
                    break;
                }
        }
    },

    // draw ground texture to a canvas context
    drawTexture: function (ctx, size, texMeters) {
        // fill all with ground Color
        ctx.fillStyle = this.data.groundColor;
        ctx.fillRect(0, 0, size, size);

        var i, col, col1, col2, im, imdata, numpixels;

        if (this.data.groundTexture == 'none') return;
        switch (this.data.groundTexture) {
            case 'checkerboard':
                {
                    ctx.fillStyle = this.data.groundColor2;
                    var num = Math.floor(texMeters / 2);
                    var step = size / (texMeters / 2); // 2 meters == <step> pixels
                    for (i = 0; i < num + 1; i += 2) {
                        for (var j = 0; j < num + 1; j++) {
                            ctx.fillRect(Math.floor((i + j % 2) * step), Math.floor(j * step), Math.floor(step), Math.floor(step));
                        }
                    }
                    break;
                }
            case 'squares':
                {
                    var numSquares = 16;
                    var squareSize = size / numSquares;
                    col1 = new THREE.Color(this.data.groundColor);
                    col2 = new THREE.Color(this.data.groundColor2);
                    for (i = 0; i < numSquares * numSquares; i++) {
                        col = this.random(i + 3) > 0.5 ? col1.clone() : col2.clone();
                        col.addScalar(this.random(i + 3) * 0.1 - 0.05);
                        ctx.fillStyle = '#' + col.getHexString();
                        ctx.fillRect((i % numSquares) * squareSize, Math.floor(i / numSquares) * squareSize, squareSize, squareSize);
                    }
                    break;
                }
            case 'noise':
                {
                    // TODO: fix
                    imdata = ctx.getImageData(0, 0, size, size);
                    im = imdata.data;
                    col1 = new THREE.Color(this.data.groundColor);
                    col2 = new THREE.Color(this.data.groundColor2);
                    var diff = new THREE.Color(col2.r - col1.r, col2.g - col1.g, col2.b - col1.b);
                    var perlin = new PerlinNoise();
                    for (i = 0, j = 0, numpixels = im.length; i < numpixels; i += 4, j++) {
                        //console.log( (j % size) / size, j / size)
                        var rnd = perlin.noise((j % size) / size * 3, j / size / size * 3, 0);
                        im[i + 0] = Math.floor((col1.r + diff.r * rnd) * 255);
                        im[i + 1] = Math.floor((col1.g + diff.g * rnd) * 255);
                        im[i + 2] = Math.floor((col1.b + diff.b * rnd) * 255);
                    }
                    ctx.putImageData(imdata, 0, 0);
                    break;
                }
            case 'walkernoise':
                {
                    var s = Math.floor(size / 2);
                    var tex = document.createElement('canvas');
                    tex.width = s;
                    tex.height = s;
                    var texctx = tex.getContext('2d');
                    texctx.fillStyle = this.data.groundColor;
                    texctx.fillRect(0, 0, s, s);
                    imdata = texctx.getImageData(0, 0, s, s);
                    im = imdata.data;
                    col1 = new THREE.Color(this.data.groundColor);
                    col2 = new THREE.Color(this.data.groundColor2);
                    var walkers = [];
                    var numwalkers = 1000;
                    for (i = 0; i < numwalkers; i++) {
                        col = col1.clone().lerp(col2, Math.random());
                        walkers.push({
                            x: Math.random() * s,
                            y: Math.random() * s,
                            r: Math.floor(col.r * 255),
                            g: Math.floor(col.g * 255),
                            b: Math.floor(col.b * 255)
                        });
                    }
                    var iterations = 5000;
                    for (var it = 0; it < iterations; it++) {
                        for (i = 0; i < numwalkers; i++) {
                            var walker = walkers[i];
                            var pos = Math.floor((walker.y * s + walker.x)) * 4;
                            im[pos + 0] = walker.r;
                            im[pos + 1] = walker.g;
                            im[pos + 2] = walker.b;
                            walker.x += Math.floor(Math.random() * 3) - 1;
                            walker.y += Math.floor(Math.random() * 3) - 1;
                            if (walker.x >= s) walker.x = walker.x - s;
                            if (walker.y >= s) walker.y = walker.y - s;
                            if (walker.x < 0) walker.x = s + walker.x;
                            if (walker.y < 0) walker.y = s + walker.y;
                        }
                    }
                    texctx.putImageData(imdata, 0, 0);
                    ctx.drawImage(tex, 0, 0, size, size);
                    break;
                }
        }
    },

    // returns an array of THREE.Geometry for set dressing
    getAssetGeometry: function (data) {
        if (!data) return null;
        var geoset = [];
        var self = this;

        function applyNoise(geo, noise) {
            var n = new THREE.Vector3();
            for (var i = 0, numVerts = geo.vertices.length; i < numVerts; i++) {
                n.x = (self.random(i) - 0.5) * noise;
                n.y = (self.random(i + numVerts) - 0.5) * noise;
                n.z = (self.random(i + numVerts * 2) - 0.5) * noise;
                geo.vertices[i].add(n);
            }
        }

        var i, geo, verts;

        for (var j = 0; j < data.length; j++) {

            if (data[j].type == 'lathe') {
                var maxy = -99999;
                var points = [];
                verts = data[j].vertices;
                for (i = 0; i < verts.length; i += 2) {
                    points.push(new THREE.Vector2(verts[i], verts[i + 1]));
                    if (verts[i + 1] > maxy) {
                        maxy = verts[i + 1];
                    }
                }
                geo = new THREE.LatheGeometry(points, data[j]['segments'] || 8);
                geo.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-Math.PI, 0, 0)));
                geo.applyMatrix(new THREE.Matrix4().makeTranslation(0, maxy, 0));
                if (data[j]['noise']) applyNoise(geo, data[j].noise);
                geoset.push(geo);
            } else if (data[j].type == 'extrude') {
                var shape = new THREE.Shape();
                verts = data[j].vertices;
                for (i = 0; i < verts.length; i += 2) {
                    if (i == 0) shape.moveTo(verts[i], verts[i + 1]);
                    else shape.lineTo(verts[i], verts[i + 1]);
                }
                geo = new THREE.ExtrudeGeometry(shape, {
                    amount: 1,
                    bevelEnabled: false
                });
                geo.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)));
                if (data[j]['noise']) applyNoise(geo, data[j].noise);
                geoset.push(geo);
            } else if (data[j].type == 'mesh') {
                geo = new THREE.Geometry();
                verts = data[j].vertices;
                var faces = data[j].faces;
                for (var v = 0; v < verts.length; v += 3) {
                    geo.vertices.push(new THREE.Vector3(verts[v], verts[v + 1], verts[v + 2]));
                }
                for (var f = 0; f < faces.length; f += 3) {
                    geo.faces.push(new THREE.Face3(faces[f], faces[f + 1], faces[f + 2]));
                }
                if (this.data.flatShading || data[j]['flatShading']) {
                    geo.computeFaceNormals();
                } else {
                    geo.computeVertexNormals();
                }

                if (data[j]['mirror']) {
                    geo.merge(geo, new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, Math.PI, 0)));
                }

                if (data[j]['noise']) applyNoise(geo, data[j].noise);
                geoset.push(geo);
            }
        }
        return geoset;
    },

    // updates set dressing
    updateDressing: function () {
        var dressing = new THREE.Object3D();
        this.dressing.setAttribute('visible', this.data.dressing != 'none');
        if (this.data.dressing == 'none') {
            return;
        }
        var geometry = new THREE.Geometry(); // mother geometry that will hold all instances

        // get array of geometries
        var geoset;
        switch (this.data.dressing) {
            case 'cubes':
                {
                    geoset = [new THREE.BoxGeometry(1, 1, 1)];
                    geoset[0].applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
                    break;
                }
            case 'pyramids':
                {
                    geoset = [new THREE.ConeGeometry(1, 1, 4, 1, true)];
                    geoset[0].applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
                    break;
                }
            case 'cylinders':
                {
                    geoset = [new THREE.CylinderGeometry(0.5, 0.5, 1, 8, 1, true)];
                    geoset[0].applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
                    break;
                }
            default:
                {
                    geoset = this.getAssetGeometry(this.assets[this.data.dressing]);
                    if (!geoset) return;
                    break;
                }
        }

        for (var i = 0, r = 88343; i < this.data.dressingAmount; i++, r++) {

            var geo = geoset[Math.floor(this.random(33 + i) * geoset.length)];
            /*
                  // change vertex colors
                  var color = new THREE.Color(0xFFFFFF).multiplyScalar(1 - this.random(66 + i) * 0.3);

                  for (var f = 0, fl = geo.faces.length; f < fl; f++) {
                    var face = geo.faces[f];
                    for (var v = 0; v < 3; v++) {
                      p = geo.vertices[face[faceindex[v]]]; // get vertex position
                      var floorao =  p.y / 4 + 0.75;
                      face.vertexColors[v] = new THREE.Color(color.r * floorao, color.g * floorao, color.b * floorao);
                    }
                  }
            */
            // set random position, rotation and scale
            var ds = this.data.dressingScale;
            var dv = new THREE.Vector3(this.data.dressingVariance.x, this.data.dressingVariance.y, this.data.dressingVariance.z);
            var distance;
            var onPlayArea = this.random(r) < this.data.dressingOnPlayArea;
            if (onPlayArea) {
                distance = this.random(r + 1) * 15;
            } else {
                distance = 10 + Math.max(dv.x, dv.z) + 10 * this.random(r + 1) + this.random(r + 2) * this.STAGE_SIZE / 3;
            }

            var direction = this.random(r + 3) * Math.PI * 2;
            var matrix = new THREE.Matrix4();
            var scale = this.random(r + 4);
            var uniformScale = this.data.dressingUniformScale;

            matrix.compose(
                // position
                new THREE.Vector3(
                    Math.cos(direction) * distance,
                    0,
                    Math.sin(direction) * distance
                ),
                // rotation
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0, 1, 0),
                    (this.random(r + 5) - 0.5) * dv.length() * Math.PI * 2
                ),
                // scale
                new THREE.Vector3(
                    ds + (uniformScale ? scale : this.random(r + 6)) * dv.x,
                    ds + (uniformScale ? scale : this.random(r + 7)) * dv.y,
                    ds + (uniformScale ? scale : this.random(r + 8)) * dv.z
                )
            );

            // merge with mother geometry
            geometry.merge(geo, matrix);
        }

        // convert geometry to buffergeometry
        var bufgeo = new THREE.BufferGeometry();
        bufgeo.fromGeometry(geometry);

        // setup material
        var material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(this.data.dressingColor),
            vertexColors: THREE.VertexColors
        });

        if (this.data.flatShading) {
            bufgeo.computeVertexNormals();
        }

        // create mesh
        var mesh = new THREE.Mesh(bufgeo, material);
        dressing.add(mesh);
        // add to scene
        this.dressing.setObject3D('mesh', dressing);
    },

    // initializes the BufferGeometry for the stars
    createStars: function () {
        var numStars = 2000;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(numStars * 3);
        var radius = this.STAGE_SIZE - 1;
        var v = new THREE.Vector3();
        for (var i = 0; i < positions.length; i += 3) {
            v.set(this.random(i + 23) - 0.5, this.random(i + 24), this.random(i + 25) - 0.5);
            v.normalize();
            v.multiplyScalar(radius);
            positions[i] = v.x;
            positions[i + 1] = v.y;
            positions[i + 2] = v.z;
        }
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setDrawRange(0, 0); // don't draw any yet
        var material = new THREE.PointsMaterial({
            size: 0.01,
            color: 0xCCCCCC,
            fog: false
        });
        this.stars.setObject3D('mesh', new THREE.Points(geometry, material));
    },

    // Sets the number of stars visible. Calls createStars() to initialize if needed.
    setStars: function (numStars) {
        if (!this.stars) {
            this.stars = document.createElement('a-entity');
            this.stars.id = 'stars';
            this.createStars();
            this.el.appendChild(this.stars);
        }
        numStars = Math.floor(Math.min(2000, Math.max(0, numStars)));
        this.stars.getObject3D('mesh').geometry.setDrawRange(0, numStars);
    }
});

// atmosphere sky shader. From https://github.com/aframevr/aframe/blob/master/examples/test/shaders/shaders/sky.js
AFRAME.registerShader('skyshader', {
    schema: {
        luminance: {
            type: 'number',
            default: 1,
            min: 0,
            max: 2,
            is: 'uniform'
        },
        turbidity: {
            type: 'number',
            default: 2,
            min: 0,
            max: 20,
            is: 'uniform'
        },
        reileigh: {
            type: 'number',
            default: 1,
            min: 0,
            max: 4,
            is: 'uniform'
        },
        mieCoefficient: {
            type: 'number',
            default: 0.005,
            min: 0,
            max: 0.1,
            is: 'uniform'
        },
        mieDirectionalG: {
            type: 'number',
            default: 0.8,
            min: 0,
            max: 1,
            is: 'uniform'
        },
        sunPosition: {
            type: 'vec3',
            default: {
                x: 0,
                y: 0,
                z: -1
            },
            is: 'uniform'
        },
        color: {
            type: 'color',
            default: '#fff'
        } //placeholder to remove warning
    },

    vertexShader: [
        'varying vec3 vWorldPosition;',
        'void main() {',
        'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
        'vWorldPosition = worldPosition.xyz;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join('\n'),

    fragmentShader: [
        'uniform sampler2D skySampler;',
        'uniform vec3 sunPosition;',
        'varying vec3 vWorldPosition;',

        'vec3 cameraPos = vec3(0., 0., 0.);',

        'uniform float luminance;',
        'uniform float turbidity;',
        'uniform float reileigh;',
        'uniform float mieCoefficient;',
        'uniform float mieDirectionalG;',

        // constants for atmospheric scattering'
        'const float e = 2.71828182845904523536028747135266249775724709369995957;',
        'const float pi = 3.141592653589793238462643383279502884197169;',

        // refractive index of air
        'const float n = 1.0003;',
        // number of molecules per unit volume for air at'
        'const float N = 2.545E25;',
        // 288.15K and 1013mb (sea level -45 celsius)
        // depolatization factor for standard air
        'const float pn = 0.035;',
        // wavelength of used primaries, according to preetham
        'const vec3 lambda = vec3(680E-9, 550E-9, 450E-9);',

        // mie stuff
        // K coefficient for the primaries
        'const vec3 K = vec3(0.686, 0.678, 0.666);',
        'const float v = 4.0;',

        // optical length at zenith for molecules
        'const float rayleighZenithLength = 8.4E3;',
        'const float mieZenithLength = 1.25E3;',
        'const vec3 up = vec3(0.0, 1.0, 0.0);',

        'const float EE = 1000.0;',
        'const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;',
        // 66 arc seconds -> degrees, and the cosine of that

        // earth shadow hack'
        'const float cutoffAngle = pi/1.95;',
        'const float steepness = 1.5;',

        'vec3 totalRayleigh(vec3 lambda)',
        '{',
        'return (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn));',
        '}',

        // see http://blenderartists.org/forum/showthread.php?321110-Shaders-and-Skybox-madness
        // A simplied version of the total Rayleigh scattering to works on browsers that use ANGLE
        'vec3 simplifiedRayleigh()',
        '{',
        'return 0.0005 / vec3(94, 40, 18);',
        '}',

        'float rayleighPhase(float cosTheta)',
        '{   ',
        'return (3.0 / (16.0*pi)) * (1.0 + pow(cosTheta, 2.0));',
        '}',

        'vec3 totalMie(vec3 lambda, vec3 K, float T)',
        '{',
        'float c = (0.2 * T ) * 10E-18;',
        'return 0.434 * c * pi * pow((2.0 * pi) / lambda, vec3(v - 2.0)) * K;',
        '}',

        'float hgPhase(float cosTheta, float g)',
        '{',
        'return (1.0 / (4.0*pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0*g*cosTheta + pow(g, 2.0), 1.5));',
        '}',

        'float sunIntensity(float zenithAngleCos)',
        '{',
        'return EE * max(0.0, 1.0 - exp(-((cutoffAngle - acos(zenithAngleCos))/steepness)));',
        '}',

        '// Filmic ToneMapping http://filmicgames.com/archives/75',
        'float A = 0.15;',
        'float B = 0.50;',
        'float C = 0.10;',
        'float D = 0.20;',
        'float E = 0.02;',
        'float F = 0.30;',
        'float W = 1000.0;',

        'vec3 Uncharted2Tonemap(vec3 x)',
        '{',
        'return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;',
        '}',

        'void main() ',
        '{',
        'float sunfade = 1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0);',

        'float reileighCoefficient = reileigh - (1.0* (1.0-sunfade));',

        'vec3 sunDirection = normalize(sunPosition);',

        'float sunE = sunIntensity(dot(sunDirection, up));',

        // extinction (absorbtion + out scattering)
        // rayleigh coefficients

        'vec3 betaR = simplifiedRayleigh() * reileighCoefficient;',

        // mie coefficients
        'vec3 betaM = totalMie(lambda, K, turbidity) * mieCoefficient;',

        // optical length
        // cutoff angle at 90 to avoid singularity in next formula.
        'float zenithAngle = acos(max(0.0, dot(up, normalize(vWorldPosition - cameraPos))));',
        'float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));',
        'float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));',

        // combined extinction factor
        'vec3 Fex = exp(-(betaR * sR + betaM * sM));',

        // in scattering
        'float cosTheta = dot(normalize(vWorldPosition - cameraPos), sunDirection);',

        'float rPhase = rayleighPhase(cosTheta*0.5+0.5);',
        'vec3 betaRTheta = betaR * rPhase;',

        'float mPhase = hgPhase(cosTheta, mieDirectionalG);',
        'vec3 betaMTheta = betaM * mPhase;',

        'vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex),vec3(1.5));',
        'Lin *= mix(vec3(1.0),pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex,vec3(1.0/2.0)),clamp(pow(1.0-dot(up, sunDirection),5.0),0.0,1.0));',

        //nightsky
        'vec3 direction = normalize(vWorldPosition - cameraPos);',
        'float theta = acos(direction.y); // elevation --> y-axis, [-pi/2, pi/2]',
        'float phi = atan(direction.z, direction.x); // azimuth --> x-axis [-pi/2, pi/2]',
        'vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0);',
        // vec3 L0 = texture2D(skySampler, uv).rgb+0.1 * Fex;
        'vec3 L0 = vec3(0.1) * Fex;',

        // composition + solar disc
        'float sundisk = smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);',
        'L0 += (sunE * 19000.0 * Fex)*sundisk;',

        'vec3 whiteScale = 1.0/Uncharted2Tonemap(vec3(W));',

        'vec3 texColor = (Lin+L0);   ',
        'texColor *= 0.04 ;',
        'texColor += vec3(0.0,0.001,0.0025)*0.3;',

        'float g_fMaxLuminance = 1.0;',
        'float fLumScaled = 0.1 / luminance;     ',
        'float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled); ',

        'float ExposureBias = fLumCompressed;',

        'vec3 curr = Uncharted2Tonemap((log2(2.0/pow(luminance,4.0)))*texColor);',
        'vec3 color = curr*whiteScale;',

        'vec3 retColor = pow(color,vec3(1.0/(1.2+(1.2*sunfade))));',

        'gl_FragColor.rgb = retColor;',

        'gl_FragColor.a = 1.0;',
        '}'
    ].join('\n')
});


// gradient sky shader

AFRAME.registerShader('gradientshader', {
    schema: {
        topColor: {
            type: 'color',
            default: '1 0 0',
            is: 'uniform'
        },
        bottomColor: {
            type: 'color',
            default: '0 0 1',
            is: 'uniform'
        }
    },

    vertexShader: [
        'varying vec3 vWorldPosition;',
        'void main() {',
        ' vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
        ' vWorldPosition = worldPosition.xyz;',
        ' gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );',
        '}'
    ].join('\n'),

    fragmentShader: [
        'uniform vec3 bottomColor;',
        'uniform vec3 topColor;',
        'uniform float offset;',
        'varying vec3 vWorldPosition;',
        'void main() {',
        ' float h = normalize( vWorldPosition ).y;',
        ' gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max(h, 0.0 ), 0.8 ), 0.0 ) ), 1.0 );',
        '}'
    ].join('\n')
});

// perlin noise generator
// from https://gist.github.com/banksean/304522

var PerlinNoise = function (r) {
    if (r == undefined) r = Math;
    this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
    this.p = [];
    var i;
    for (i = 0; i < 256; i++) {
        this.p[i] = Math.floor(r.random(666) * 256);
    }
    // To remove the need for index wrapping, double the permutation table length
    this.perm = [];
    for (i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
    }
};

PerlinNoise.prototype.dot = function (g, x, y, z) {
    return g[0] * x + g[1] * y + g[2] * z;
};

PerlinNoise.prototype.mix = function (a, b, t) {
    return (1.0 - t) * a + t * b;
};

PerlinNoise.prototype.fade = function (t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
};

// Classic Perlin noise, 3D version
PerlinNoise.prototype.noise = function (x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x);
    var Y = Math.floor(y);
    var Z = Math.floor(z);

    // Get relative xyz coordinates of point within that cell
    x = x - X;
    y = y - Y;
    z = z - Z;

    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255;
    Y = Y & 255;
    Z = Z & 255;

    // Calculate a set of eight hashed gradient indices
    var gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
    var gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
    var gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
    var gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
    var gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
    var gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
    var gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
    var gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

    // The gradients of each corner are now:
    // g000 = grad3[gi000];
    // g001 = grad3[gi001];
    // g010 = grad3[gi010];
    // g011 = grad3[gi011];
    // g100 = grad3[gi100];
    // g101 = grad3[gi101];
    // g110 = grad3[gi110];
    // g111 = grad3[gi111];
    // Calculate noise contributions from each of the eight corners
    var n000 = this.dot(this.grad3[gi000], x, y, z);
    var n100 = this.dot(this.grad3[gi100], x - 1, y, z);
    var n010 = this.dot(this.grad3[gi010], x, y - 1, z);
    var n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z);
    var n001 = this.dot(this.grad3[gi001], x, y, z - 1);
    var n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1);
    var n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1);
    var n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1);
    // Compute the fade curve value for each of x, y, z
    var u = this.fade(x);
    var v = this.fade(y);
    var w = this.fade(z);
    // Interpolate along x the contributions from each of the corners
    var nx00 = this.mix(n000, n100, u);
    var nx01 = this.mix(n001, n101, u);
    var nx10 = this.mix(n010, n110, u);
    var nx11 = this.mix(n011, n111, u);
    // Interpolate the four results along y
    var nxy0 = this.mix(nx00, nx10, v);
    var nxy1 = this.mix(nx01, nx11, v);
    // Interpolate the two last results along z
    var nxyz = this.mix(nxy0, nxy1, w);

    return nxyz;
};
