const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const INPUT = path.join(__dirname, 'input');
const OUTPUT = path.join(__dirname, 'output');

fse.emptyDirSync(OUTPUT);

const r = -Math.PI * 0.5;
const sin = Math.sin(r);
const cos = Math.cos(r);

const jsonFiles = fs.readdirSync(INPUT).filter((p) => /\.json$/.test(p));

jsonFiles.forEach((p) => {
    let animation = JSON.parse(fs.readFileSync(path.join(INPUT, p), { encoding: 'utf8' }));

    loadImage(path.join(INPUT, animation.meta.image)).then((image) => {
        Object.entries(animation.frames).forEach(([name, data]) => {
            const { x: sx, y: sy, w: sWidth, h: sHeight } = data.frame;
            const { x: dx, y: dy, w: dWidth, h: dHeight } = data.spriteSourceSize;
            const { w, h } = data.sourceSize;

            const dirs = name.split('/');
            dirs.pop();

            fse.ensureDirSync(path.join(OUTPUT, ...dirs));

            const canvas = createCanvas(w, h);
            const ctx = canvas.getContext('2d');
            if (data.rotated) {
                ctx.setTransform(cos, sin, -sin, cos, dWidth, 0);
                ctx.drawImage(image, sx, sy, sHeight, sWidth, -dHeight - dy, -dWidth + dx, dHeight, dWidth);
            } else {
                ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }

            var buf = canvas.toBuffer();
            fs.writeFileSync(path.join(OUTPUT, name + '.png'), buf);
        });
    });
});
