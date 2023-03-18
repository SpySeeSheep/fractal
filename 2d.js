function drawLine(ctr, bx, by, ex, ey, width, r, g, b) {
    ctr.strokeStyle = `rgb(${r},${g},${b})`;
    ctr.moveTo(bx, by);
    ctr.lineTo(ex, ey);
    ctr.lineWidth = width;
    ctr.stroke();
}

function render3(ctx, iter, p, alpha, oldAlpha, bx, by, len) {
    if (iter == 0) return;
    let a = 0,
        b = 0;
    if (Math.random() < 0.25) {
        if (Math.random() <= 50) {
            a = -Math.random();
            b = -Math.random();
        } else {
            a = Math.random();
            b = Math.random();
        }
    }
    let ex = bx + len * Math.cos(oldAlpha + oldAlpha * a),
        ey = by - len * Math.sin(oldAlpha + oldAlpha * b);
    drawLine(ctx, bx, by, ex, ey, 3, 0, 200, 50);
    if (Math.random() <= p)
        render3(ctx, iter - 1, p, alpha + (Math.random() < 0.5) ? alpha * Math.random() : -alpha * Math.random(), oldAlpha + alpha, ex, ey, len - 5);
    if (Math.random() <= p)
        render3(ctx, iter - 1, p, alpha + (Math.random() < 0.5) ? alpha * Math.random() : -alpha * Math.random(), oldAlpha - alpha, ex, ey, len - 5);
    render3(ctx, iter - 1, p, alpha - alpha * Math.random(), oldAlpha, ex, ey, len - 10);
}

function render2(ctx, iter, p, alpha, oldAlpha, bx, by, len, r, g, b) {
    if (iter == 0) return;
    drawLine(ctx, bx, by, bx + len * Math.cos(oldAlpha),
        by + len * Math.sin(oldAlpha), iter, r, g, b);
    if (Math.random() <= p)
        if (Math.random() <= Math.random()) {
            render2(ctx, iter - 1, p, alpha, oldAlpha - alpha, bx + len * Math.cos(oldAlpha), by - len * Math.sin(oldAlpha), r - 10, g + 10, b);
        } else {
            render2(ctx, iter - 1, p, alpha, oldAlpha + alpha, bx + len * Math.cos(oldAlpha), by - len * Math.sin(oldAlpha), r - 10, g + 10, b);
        }

    render2(ctx, iter - 1, p, alpha, oldAlpha, bx + len * Math.cos(oldAlpha), by - len * Math.sin(oldAlpha), r, g, b)

}

function render(ctx, iter, p, alpha, len, xb, yb, xe, ye, r, g, b) {
    if (iter == 0) {
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        drawLine(ctx, xb, yb, xe, ye, iter);
        return;
    }
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    drawLine(ctx, xb, yb, xe, ye, iter, r, g, b);
    if (Math.random() < p) { // ветка влево
        render(ctx, iter - 1, p, alpha + alpha * Math.random(), len - 20, xe,
            ye, xe - len * Math.sin(alpha), ye + len * Math.cos(alpha), r, g, b + 10);
    } else { // ветка вправо
        render(ctx, iter - 1, p, alpha - alpha * Math.random(), len - 1, xe,
            ye, xe + len * Math.sin(alpha), ye + len * Math.cos(alpha), r, g, b + 100);
    }
    render(ctx, iter - 1, p, alpha - alpha * Math.random(), len - 1, xe,
        ye, xe - len * Math.cos(alpha), ye + len * Math.sin(alpha), r, g + 10, b);
}

function direction2() {
    let canvas = document.getElementById('img');
    let ctx = canvas.getContext('2d');
    ctx.canvas.height = canvas.clientHeight;
    ctx.canvas.width = canvas.clientWidth;
    let r = 92,
        g = 0,
        b = 0,
        xb = ctx.canvas.width / 2,
        yb = ctx.canvas.height / 6 * 5,
        len = 100,
        p = 75 / 100,
        alpha = Math.PI / 3 * Math.random(),
        xe = xb,
        ye = yb + len,
        iter = 7;
    render3(ctx, iter, p, alpha, Math.PI / 2, xb, yb, len);
}