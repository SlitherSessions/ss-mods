/* Slither Sessions Mods */
/*
The MIT License (MIT)
 Copyright (c) 2016 Jesse Miller <jmiller@jmiller.com>
 Copyright (c) 2016 Alexey Korepanov <kaikaikai@yandex.ru>
 Copyright (c) 2016 Ermiya Eskandary & Théophile Cailliau and other contributors
 https://jmiller.mit-license.org/
*/
// ==UserScript==
// @name         Slither.io Bot Championship Edition
// @namespace    https://github.com/j-c-m/Slither.io-bot
// @version      3.0.5
// @description  Slither.io Bot Championship Edition
// @author       Jesse Miller
// @match        http://slither.io/
// @updateURL    https://github.com/j-c-m/Slither.io-bot/raw/master/bot.user.js
// @downloadURL  https://github.com/j-c-m/Slither.io-bot/raw/master/bot.user.js
// @supportURL   https://github.com/j-c-m/Slither.io-bot/issues
// @grant        none
// ==/UserScript==

// Custom logging function - disabled by default
window.log = function () {
    if (window.logDebugging) {
        console.log.apply(console, arguments);
    }
};

var canvas = window.canvas = (function (window) {
    return {
        // Spoofs moving the mouse to the provided coordinates.
        setMouseCoordinates: function (point) {
            window.xm = point.x;
            window.ym = point.y;
        },

        // Convert map coordinates to mouse coordinates.
        mapToMouse: function (point) {
            var mouseX = (point.x - window.snake.xx) * window.gsc;
            var mouseY = (point.y - window.snake.yy) * window.gsc;
            return { x: mouseX, y: mouseY };
        },

        // Map cordinates to Canvas cordinate shortcut
        mapToCanvas: function (point) {
            var c = {
                x: window.mww2 + (point.x - window.view_xx) * window.gsc,
                y: window.mhh2 + (point.y - window.view_yy) * window.gsc
            };
            return c;
        },

        // Map to Canvas coordinate conversion for drawing circles.
        // Radius also needs to scale by .gsc
        circleMapToCanvas: function (circle) {
            var newCircle = canvas.mapToCanvas({
                x: circle.x,
                y: circle.y
            });
            return canvas.circle(
                newCircle.x,
                newCircle.y,
                circle.radius * window.gsc
            );
        },

        // Constructor for point type
        point: function (x, y) {
            var p = {
                x: Math.round(x),
                y: Math.round(y)
            };

            return p;
        },

        // Constructor for rect type
        rect: function (x, y, w, h) {
            var r = {
                x: Math.round(x),
                y: Math.round(y),
                width: Math.round(w),
                height: Math.round(h)
            };

            return r;
        },

        // Constructor for circle type
        circle: function (x, y, r) {
            var c = {
                x: Math.round(x),
                y: Math.round(y),
                radius: Math.round(r)
            };

            return c;
        },

        // Fast atan2
        fastAtan2: function (y, x) {
            const QPI = Math.PI / 4;
            const TQPI = 3 * Math.PI / 4;
            var r = 0.0;
            var angle = 0.0;
            var abs_y = Math.abs(y) + 1e-10;
            if (x < 0) {
                r = (x + abs_y) / (abs_y - x);
                angle = TQPI;
            } else {
                r = (x - abs_y) / (x + abs_y);
                angle = QPI;
            }
            angle += (0.1963 * r * r - 0.9817) * r;
            if (y < 0) {
                return -angle;
            }

            return angle;
        },

        // Adjusts zoom in response to the mouse wheel.
        setZoom: function (e) {
            // Scaling ratio
            if (window.gsc) {
                window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
                window.desired_gsc = window.gsc;
            }
        },

        // Restores zoom to the default value.
        resetZoom: function () {
            window.gsc = 0.9;
            window.desired_gsc = 0.9;
        },

        // Maintains Zoom
        maintainZoom: function () {
            if (window.desired_gsc !== undefined) {
                window.gsc = window.desired_gsc;
            }
        },

        // Sets background to the given image URL.
        // Defaults to slither.io's own background.
        setBackground: function (url) {
            url = typeof url !== 'undefined' ? url : '/s/bg45.jpg';
            window.ii.src = url;
        },

        // Draw a rectangle on the canvas.
        drawRect: function (rect, color, fill, alpha) {
            if (alpha === undefined) alpha = 1;

            var context = window.mc.getContext('2d');
            var lc = canvas.mapToCanvas({ x: rect.x, y: rect.y });

            context.save();
            context.globalAlpha = alpha;
            context.strokeStyle = color;
            context.rect(lc.x, lc.y, rect.width * window.gsc, rect.height * window.gsc);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a circle on the canvas.
        drawCircle: function (circle, color, fill, alpha) {
            if (alpha === undefined) alpha = 1;
            if (circle.radius === undefined) circle.radius = 5;

            var context = window.mc.getContext('2d');
            var drawCircle = canvas.circleMapToCanvas(circle);

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.strokeStyle = color;
            context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, 0, Math.PI * 2);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw an angle.
        // @param {number} start -- where to start the angle
        // @param {number} angle -- width of the angle
        // @param {bool} danger -- green if false, red if true
        drawAngle: function (start, angle, color, fill, alpha) {
            if (alpha === undefined) alpha = 0.6;

            var context = window.mc.getContext('2d');

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.moveTo(window.mc.width / 2, window.mc.height / 2);
            context.arc(window.mc.width / 2, window.mc.height / 2, window.gsc * 100, start, angle);
            context.lineTo(window.mc.width / 2, window.mc.height / 2);
            context.closePath();
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a line on the canvas.
        drawLine: function (p1, p2, color, width) {
            if (width === undefined) width = 5;

            var context = window.mc.getContext('2d');
            var dp1 = canvas.mapToCanvas(p1);
            var dp2 = canvas.mapToCanvas(p2);

            context.save();
            context.beginPath();
            context.lineWidth = width * window.gsc;
            context.strokeStyle = color;
            context.moveTo(dp1.x, dp1.y);
            context.lineTo(dp2.x, dp2.y);
            context.stroke();
            context.restore();
        },

        // Given the start and end of a line, is point left.
        isLeft: function (start, end, point) {
            return ((end.x - start.x) * (point.y - start.y) -
                (end.y - start.y) * (point.x - start.x)) > 0;

        },

        // Get distance squared
        getDistance2: function (x1, y1, x2, y2) {
            var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            return distance2;
        },

        getDistance2FromSnake: function (point) {
            point.distance = canvas.getDistance2(window.snake.xx, window.snake.yy,
                point.xx, point.yy);
            return point;
        },

        // return unit vector in the direction of the argument
        unitVector: function (v) {
            var l = Math.sqrt(v.x * v.x + v.y * v.y);
            if (l > 0) {
                return {
                    x: v.x / l,
                    y: v.y / l
                };
            } else {
                return {
                    x: 0,
                    y: 0
                };
            }
        },

        // Check if point in Rect
        pointInRect: function (point, rect) {
            if (rect.x <= point.x && rect.y <= point.y &&
                rect.x + rect.width >= point.x && rect.y + rect.height >= point.y) {
                return true;
            }
            return false;
        },

        // check if point is in polygon
        pointInPoly: function (point, poly) {
            if (point.x < poly.minx || point.x > poly.maxx ||
                point.y < poly.miny || point.y > poly.maxy) {
                return false;
            }
            let c = false;
            const l = poly.pts.length;
            for (let i = 0, j = l - 1; i < l; j = i++) {
                if ( ((poly.pts[i].y > point.y) != (poly.pts[j].y > point.y)) &&
                    (point.x < (poly.pts[j].x - poly.pts[i].x) * (point.y - poly.pts[i].y) /
                        (poly.pts[j].y - poly.pts[i].y) + poly.pts[i].x) ) {
                    c = !c;
                }
            }
            return c;
        },

        addPolyBox: function (poly) {
            var minx = poly.pts[0].x;
            var maxx = poly.pts[0].x;
            var miny = poly.pts[0].y;
            var maxy = poly.pts[0].y;
            for (let p = 1, l = poly.pts.length; p < l; p++) {
                if (poly.pts[p].x < minx) {
                    minx = poly.pts[p].x;
                }
                if (poly.pts[p].x > maxx) {
                    maxx = poly.pts[p].x;
                }
                if (poly.pts[p].y < miny) {
                    miny = poly.pts[p].y;
                }
                if (poly.pts[p].y > maxy) {
                    maxy = poly.pts[p].y;
                }
            }
            return {
                pts: poly.pts,
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy
            };
        },

        cross: function (o, a, b) {
            return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        },

        convexHullSort: function (a, b) {
            return a.x == b.x ? a.y - b.y : a.x - b.x;
        },

        convexHull: function (points) {
            points.sort(canvas.convexHullSort);

            var lower = [];
            for (let i = 0, l = points.length; i < l; i++) {
                while (lower.length >= 2 && canvas.cross(
                    lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                    lower.pop();
                }
                lower.push(points[i]);
            }

            var upper = [];
            for (let i = points.length - 1; i >= 0; i--) {
                while (upper.length >= 2 && canvas.cross(
                    upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                    upper.pop();
                }
                upper.push(points[i]);
            }

            upper.pop();
            lower.pop();
            return lower.concat(upper);
        },

        // Check if circles intersect
        circleIntersect: function (circle1, circle2) {
            var bothRadii = circle1.radius + circle2.radius;
            var point = {};

            // Pretends the circles are squares for a quick collision check.
            // If it collides, do the more expensive circle check.
            if (circle1.x + bothRadii > circle2.x &&
                circle1.y + bothRadii > circle2.y &&
                circle1.x < circle2.x + bothRadii &&
                circle1.y < circle2.y + bothRadii) {

                var distance2 = canvas.getDistance2(circle1.x, circle1.y, circle2.x, circle2.y);

                if (distance2 < bothRadii * bothRadii) {
                    point = {
                        x: ((circle1.x * circle2.radius) + (circle2.x * circle1.radius)) /
                        bothRadii,
                        y: ((circle1.y * circle2.radius) + (circle2.y * circle1.radius)) /
                        bothRadii,
                        ang: 0.0
                    };

                    point.ang = canvas.fastAtan2(
                        point.y - window.snake.yy, point.x - window.snake.xx);

                    if (window.visualDebugging) {
                        var collisionPointCircle = canvas.circle(
                            point.x,
                            point.y,
                            5
                        );
                        canvas.drawCircle(circle2, '#ff9900', false);
                        canvas.drawCircle(collisionPointCircle, '#66ff66', true);
                    }
                    return point;
                }
            }
            return false;
        }
    };
})(window);

var bot = window.bot = (function (window) {
    return {
        isBotRunning: false,
        isBotEnabled: true,
        stage: 'grow',
        collisionPoints: [],
        collisionAngles: [],
        foodAngles: [],
        scores: [],
        foodTimeout: undefined,
        sectorBoxSide: 0,
        defaultAccel: 0,
        sectorBox: {},
        currentFood: {},
        opt: {
            // target fps
            targetFps: 20,
            // size of arc for collisionAngles
            arcSize: Math.PI / 8,
            // radius multiple for circle intersects
            radiusMult: 10,
            // food cluster size to trigger acceleration
            foodAccelSz: 200,
            // maximum angle of food to trigger acceleration
            foodAccelDa: Math.PI / 2,
            // how many frames per action
            actionFrames: 2,
            // how many frames to delay action after collision
            collisionDelay: 10,
            // base speed
            speedBase: 5.78,
            // front angle size
            frontAngle: Math.PI / 2,
            // percent of angles covered by same snake to be considered an encircle attempt
            enCircleThreshold: 0.5625,
            // percent of angles covered by all snakes to move to safety
            enCircleAllThreshold: 0.5625,
            // distance multiplier for enCircleAllThreshold
            enCircleDistanceMult: 20,
            // snake score to start circling on self
            followCircleLength: 5000,
            // direction for followCircle: +1 for counter clockwise and -1 for clockwise
            followCircleDirection: +1
        },
        MID_X: 0,
        MID_Y: 0,
        MAP_R: 0,
        MAXARC: 0,

        getSnakeWidth: function (sc) {
            if (sc === undefined) sc = window.snake.sc;
            return Math.round(sc * 29.0);
        },

        quickRespawn: function () {
            window.dead_mtm = 0;
            window.login_fr = 0;

            bot.isBotRunning = false;
            window.forcing = true;
            bot.connect();
            window.forcing = false;
        },

        connect: function () {
            if (window.force_ip && window.force_port) {
                window.forceServer(window.force_ip, window.force_port);
            }

            window.connect();
        },

        // angleBetween - get the smallest angle between two angles (0-pi)
        angleBetween: function (a1, a2) {
            var r1 = 0.0;
            var r2 = 0.0;

            r1 = (a1 - a2) % Math.PI;
            r2 = (a2 - a1) % Math.PI;

            return r1 < r2 ? -r1 : r2;
        },

        // Change heading to ang
        changeHeadingAbs: function (angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            window.goalCoordinates = {
                x: Math.round(
                    window.snake.xx + (bot.headCircle.radius) * cos),
                y: Math.round(
                    window.snake.yy + (bot.headCircle.radius) * sin)
            };

            /*if (window.visualDebugging) {
                canvas.drawLine({
                    x: window.snake.xx,
                    y: window.snake.yy},
                    window.goalCoordinates, 'yellow', '8');
            }*/

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Change heading by ang
        // +0-pi turn left
        // -0-pi turn right

        changeHeadingRel: function (angle) {
            var heading = {
                x: window.snake.xx + 500 * bot.cos,
                y: window.snake.yy + 500 * bot.sin
            };

            var cos = Math.cos(-angle);
            var sin = Math.sin(-angle);

            window.goalCoordinates = {
                x: Math.round(
                    cos * (heading.x - window.snake.xx) -
                    sin * (heading.y - window.snake.yy) + window.snake.xx),
                y: Math.round(
                    sin * (heading.x - window.snake.xx) +
                    cos * (heading.y - window.snake.yy) + window.snake.yy)
            };

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Change heading to the best angle for avoidance.
        headingBestAngle: function () {
            var best;
            var distance;
            var openAngles = [];
            var openStart;

            var sIndex = bot.getAngleIndex(window.snake.ehang) + bot.MAXARC / 2;
            if (sIndex > bot.MAXARC) sIndex -= bot.MAXARC;

            for (var i = 0; i < bot.MAXARC; i++) {
                if (bot.collisionAngles[i] === undefined) {
                    distance = 0;
                    if (openStart === undefined) openStart = i;
                } else {
                    distance = bot.collisionAngles[i].distance;
                    if (openStart) {
                        openAngles.push({
                            openStart: openStart,
                            openEnd: i - 1,
                            sz: (i - 1) - openStart
                        });
                        openStart = undefined;
                    }
                }

                if (best === undefined ||
                    (best.distance < distance && best.distance !== 0)) {
                    best = {
                        distance: distance,
                        aIndex: i
                    };
                }
            }

            if (openStart && openAngles[0]) {
                openAngles[0].openStart = openStart;
                openAngles[0].sz = openAngles[0].openEnd - openStart;
                if (openAngles[0].sz < 0) openAngles[0].sz += bot.MAXARC;

            } else if (openStart) {
                openAngles.push({openStart: openStart, openEnd: openStart, sz: 0});
            }

            if (openAngles.length > 0) {
                openAngles.sort(bot.sortSz);
                bot.changeHeadingAbs(
                    (openAngles[0].openEnd - openAngles[0].sz / 2) * bot.opt.arcSize);
            } else {
                bot.changeHeadingAbs(best.aIndex * bot.opt.arcSize);
            }
        },

        // Avoid collision point by ang
        // ang radians <= Math.PI (180deg)
        avoidCollisionPoint: function (point, ang) {
            if (ang === undefined || ang > Math.PI) {
                ang = Math.PI;
            }

            var end = {
                x: window.snake.xx + 2000 * bot.cos,
                y: window.snake.yy + 2000 * bot.sin
            };

            if (window.visualDebugging) {
                canvas.drawLine(
                    { x: window.snake.xx, y: window.snake.yy },
                    end,
                    'orange', 5);
                canvas.drawLine(
                    { x: window.snake.xx, y: window.snake.yy },
                    { x: point.x, y: point.y },
                    'red', 5);
            }

            if (canvas.isLeft(
                { x: window.snake.xx, y: window.snake.yy }, end,
                { x: point.x, y: point.y })) {
                bot.changeHeadingAbs(point.ang - ang);
            } else {
                bot.changeHeadingAbs(point.ang + ang);
            }
        },

        // get collision angle index, expects angle +/i 0 to Math.PI
        getAngleIndex: function (angle) {
            var index;

            if (angle < 0) {
                angle += 2 * Math.PI;
            }

            index = Math.round(angle * (1 / bot.opt.arcSize));

            if (index === bot.MAXARC) {
                return 0;
            }
            return index;
        },

        // Add to collisionAngles if distance is closer
        addCollisionAngle: function (sp) {
            var ang = canvas.fastAtan2(
                Math.round(sp.yy - window.snake.yy),
                Math.round(sp.xx - window.snake.xx));
            var aIndex = bot.getAngleIndex(ang);

            var actualDistance = Math.round(Math.pow(
                Math.sqrt(sp.distance) - sp.radius, 2));

            if (bot.collisionAngles[aIndex] === undefined ||
                 bot.collisionAngles[aIndex].distance > sp.distance) {
                bot.collisionAngles[aIndex] = {
                    x: Math.round(sp.xx),
                    y: Math.round(sp.yy),
                    ang: ang,
                    snake: sp.snake,
                    distance: actualDistance,
                    radius: sp.radius,
                    aIndex: aIndex
                };
            }
        },

        // Add and score foodAngles
        addFoodAngle: function (f) {
            var ang = canvas.fastAtan2(
                Math.round(f.yy - window.snake.yy),
                Math.round(f.xx - window.snake.xx));

            var aIndex = bot.getAngleIndex(ang);

            canvas.getDistance2FromSnake(f);

            if (bot.collisionAngles[aIndex] === undefined ||
                Math.sqrt(bot.collisionAngles[aIndex].distance) >
                Math.sqrt(f.distance) + bot.snakeRadius * bot.opt.radiusMult * bot.speedMult / 2) {
                if (bot.foodAngles[aIndex] === undefined) {
                    bot.foodAngles[aIndex] = {
                        x: Math.round(f.xx),
                        y: Math.round(f.yy),
                        ang: ang,
                        da: Math.abs(bot.angleBetween(ang, window.snake.ehang)),
                        distance: f.distance,
                        sz: f.sz,
                        score: Math.pow(f.sz, 2) / f.distance
                    };
                } else {
                    bot.foodAngles[aIndex].sz += Math.round(f.sz);
                    bot.foodAngles[aIndex].score += Math.pow(f.sz, 2) / f.distance;
                    if (bot.foodAngles[aIndex].distance > f.distance) {
                        bot.foodAngles[aIndex].x = Math.round(f.xx);
                        bot.foodAngles[aIndex].y = Math.round(f.yy);
                        bot.foodAngles[aIndex].distance = f.distance;
                    }
                }
            }
        },

        // Get closest collision point per snake.
        getCollisionPoints: function () {
            var scPoint;

            bot.collisionPoints = [];
            bot.collisionAngles = [];


            for (var snake = 0, ls = window.snakes.length; snake < ls; snake++) {
                scPoint = undefined;

                if (window.snakes[snake].id !== window.snake.id &&
                    window.snakes[snake].alive_amt === 1) {

                    var s = window.snakes[snake];
                    var sRadius = bot.getSnakeWidth(s.sc) / 2;
                    var sSpMult = Math.min(1, s.sp / 5.78 - 1 );

                    scPoint = {
                        xx: s.xx + Math.cos(s.ehang) * sRadius * sSpMult * bot.opt.radiusMult / 2,
                        yy: s.yy + Math.sin(s.ehang) * sRadius * sSpMult * bot.opt.radiusMult / 2,
                        snake: snake,
                        radius: bot.headCircle.radius,
                        head: true
                    };

                    canvas.getDistance2FromSnake(scPoint);
                    bot.addCollisionAngle(scPoint);
                    bot.collisionPoints.push(scPoint);

                    if (window.visualDebugging) {
                        canvas.drawCircle(canvas.circle(
                            scPoint.xx,
                            scPoint.yy,
                            scPoint.radius),
                            'red', false);
                    }

                    scPoint = undefined;

                    for (var pts = 0, lp = s.pts.length; pts < lp; pts++) {
                        if (!s.pts[pts].dying &&
                            canvas.pointInRect(
                                {
                                    x: s.pts[pts].xx,
                                    y: s.pts[pts].yy
                                }, bot.sectorBox)
                        ) {
                            var collisionPoint = {
                                xx: s.pts[pts].xx,
                                yy: s.pts[pts].yy,
                                snake: snake,
                                radius: sRadius
                            };

                            if (window.visualDebugging && true === false) {
                                canvas.drawCircle(canvas.circle(
                                    collisionPoint.xx,
                                    collisionPoint.yy,
                                    collisionPoint.radius),
                                    '#00FF00', false);
                            }

                            canvas.getDistance2FromSnake(collisionPoint);
                            bot.addCollisionAngle(collisionPoint);

                            if (collisionPoint.distance <= Math.pow(
                                (bot.headCircle.radius)
                                + collisionPoint.radius, 2)) {
                                bot.collisionPoints.push(collisionPoint);
                                if (window.visualDebugging) {
                                    canvas.drawCircle(canvas.circle(
                                        collisionPoint.xx,
                                        collisionPoint.yy,
                                        collisionPoint.radius
                                    ), 'red', false);
                                }
                            }
                        }
                    }
                }
            }

            // WALL
            if (canvas.getDistance2(bot.MID_X, bot.MID_Y, window.snake.xx, window.snake.yy) >
                Math.pow(bot.MAP_R - 1000, 2)) {
                var midAng = canvas.fastAtan2(
                    window.snake.yy - bot.MID_X, window.snake.xx - bot.MID_Y);
                scPoint = {
                    xx: bot.MID_X + bot.MAP_R * Math.cos(midAng),
                    yy: bot.MID_Y + bot.MAP_R * Math.sin(midAng),
                    snake: -1,
                    radius: bot.snakeWidth
                };
                canvas.getDistance2FromSnake(scPoint);
                bot.collisionPoints.push(scPoint);
                bot.addCollisionAngle(scPoint);
                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        scPoint.xx,
                        scPoint.yy,
                        scPoint.radius
                    ), 'yellow', false);
                }
            }


            bot.collisionPoints.sort(bot.sortDistance);
            if (window.visualDebugging) {
                for (var i = 0; i < bot.collisionAngles.length; i++) {
                    if (bot.collisionAngles[i] !== undefined) {
                        canvas.drawLine(
                            { x: window.snake.xx, y: window.snake.yy },
                            { x: bot.collisionAngles[i].x, y: bot.collisionAngles[i].y },
                            'red', 2);
                    }
                }
            }
        },

        // Is collisionPoint (xx) in frontAngle
        inFrontAngle: function (point) {
            var ang = canvas.fastAtan2(
                Math.round(point.y - window.snake.yy),
                Math.round(point.x - window.snake.xx));

            if (Math.abs(bot.angleBetween(ang, window.snake.ehang)) < bot.opt.frontAngle) {
                return true;
            } else {
                return false;
            }

        },

        // Checks to see if you are going to collide with anything in the collision detection radius
        checkCollision: function () {
            var point;

            bot.getCollisionPoints();
            if (bot.collisionPoints.length === 0) return false;

            for (var i = 0; i < bot.collisionPoints.length; i++) {
                var collisionCircle = canvas.circle(
                    bot.collisionPoints[i].xx,
                    bot.collisionPoints[i].yy,
                    bot.collisionPoints[i].radius
                );

                // -1 snake is special case for non snake object.
                if ((point = canvas.circleIntersect(bot.headCircle, collisionCircle)) &&
                    bot.inFrontAngle(point)) {
                    if (bot.collisionPoints[i].snake !== -1 &&
                        bot.collisionPoints[i].head &&
                        window.snakes[bot.collisionPoints[i].snake].sp > 10) {
                        window.setAcceleration(1);
                    } else {
                        window.setAcceleration(bot.defaultAccel);
                    }
                    bot.avoidCollisionPoint(point);
                    return true;
                }
            }

            window.setAcceleration(bot.defaultAccel);
            return false;
        },

        checkEncircle: function () {
            var enSnake = [];
            var high = 0;
            var highSnake;
            var enAll = 0;

            for (var i = 0; i < bot.collisionAngles.length; i++) {
                if (bot.collisionAngles[i] !== undefined) {
                    var s = bot.collisionAngles[i].snake;
                    if (enSnake[s]) {
                        enSnake[s]++;
                    } else {
                        enSnake[s] = 1;
                    }
                    if (enSnake[s] > high) {
                        high = enSnake[s];
                        highSnake = s;
                    }

                    if (bot.collisionAngles[i].distance <
                        Math.pow(bot.snakeRadius * bot.opt.enCircleDistanceMult, 2)) {
                        enAll++;
                    }
                }
            }

            if (high > bot.MAXARC * bot.opt.enCircleThreshold) {
                bot.headingBestAngle();

                if (high !== bot.MAXARC && window.snakes[highSnake].sp > 10) {
                    window.setAcceleration(1);
                } else {
                    window.setAcceleration(bot.defaultAccel);
                }

                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.opt.radiusMult * bot.snakeRadius),
                        'red', true, 0.2);
                }
                return true;
            }

            if (enAll > bot.MAXARC * bot.opt.enCircleAllThreshold) {
                bot.headingBestAngle();
                window.setAcceleration(bot.defaultAccel);

                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.snakeRadius * bot.opt.enCircleDistanceMult),
                        'yellow', true, 0.2);
                }
                return true;
            } else {
                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.snakeRadius * bot.opt.enCircleDistanceMult),
                        'yellow');
                }
            }

            window.setAcceleration(bot.defaultAccel);
            return false;
        },

        populatePts: function () {
            let x = window.snake.xx + window.snake.fx;
            let y = window.snake.yy + window.snake.fy;
            let l = 0.0;
            bot.pts = [{
                x: x,
                y: y,
                len: l
            }];
            for (let p = window.snake.pts.length - 1; p >= 0; p--) {
                if (window.snake.pts[p].dying) {
                    continue;
                } else {
                    let xx = window.snake.pts[p].xx + window.snake.pts[p].fx;
                    let yy = window.snake.pts[p].yy + window.snake.pts[p].fy;
                    let ll = l + Math.sqrt(canvas.getDistance2(x, y, xx, yy));
                    bot.pts.push({
                        x: xx,
                        y: yy,
                        len: ll
                    });
                    x = xx;
                    y = yy;
                    l = ll;
                }
            }
            bot.len = l;
        },

        // set the direction of rotation based on the velocity of
        // the head with respect to the center of mass
        determineCircleDirection: function () {
            // find center mass (cx, cy)
            let cx = 0.0;
            let cy = 0.0;
            let pn = bot.pts.length;
            for (let p = 0; p < pn; p++) {
                cx += bot.pts[p].x;
                cy += bot.pts[p].y;
            }
            cx /= pn;
            cy /= pn;

            // vector from (cx, cy) to the head
            let head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };
            let dx = head.x - cx;
            let dy = head.y - cy;

            // check the sign of dot product of (bot.cos, bot.sin) and (-dy, dx)
            if (- dy * bot.cos + dx * bot.sin > 0) {
                // clockwise
                bot.opt.followCircleDirection = -1;
            } else {
                // couter clockwise
                bot.opt.followCircleDirection = +1;
            }
        },

        // returns a point on snake's body on given length from the head
        // assumes that bot.pts is populated
        smoothPoint: function (t) {
            // range check
            if (t >= bot.len) {
                let tail = bot.pts[bot.pts.length - 1];
                return {
                    x: tail.x,
                    y: tail.y
                };
            } else if (t <= 0 ) {
                return {
                    x: bot.pts[0].x,
                    y: bot.pts[0].y
                };
            }
            // binary search
            let p = 0;
            let q = bot.pts.length - 1;
            while (q - p > 1) {
                let m = Math.round((p + q) / 2);
                if (t > bot.pts[m].len) {
                    p = m;
                } else {
                    q = m;
                }
            }
            // now q = p + 1, and the point is in between;
            // compute approximation
            let wp = bot.pts[q].len - t;
            let wq = t - bot.pts[p].len;
            let w = wp + wq;
            return {
                x: (wp * bot.pts[p].x + wq * bot.pts[q].x) / w,
                y: (wp * bot.pts[p].y + wq * bot.pts[q].y) / w
            };
        },

        // finds a point on snake's body closest to the head;
        // returns length from the head
        // excludes points close to the head
        closestBodyPoint: function () {
            let head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };

            let ptsLength = bot.pts.length;

            // skip head area
            let start_n = 0;
            let start_d2 = 0.0;
            for ( ;; ) {
                let prev_d2 = start_d2;
                start_n ++;
                start_d2 = canvas.getDistance2(head.x, head.y,
                    bot.pts[start_n].x, bot.pts[start_n].y);
                if (start_d2 < prev_d2 || start_n == ptsLength - 1) {
                    break;
                }
            }

            if (start_n >= ptsLength || start_n <= 1) {
                return bot.len;
            }

            // find closets point in bot.pts
            let min_n = start_n;
            let min_d2 = start_d2;
            for (let n = min_n + 1; n < ptsLength; n++) {
                let d2 = canvas.getDistance2(head.x, head.y, bot.pts[n].x, bot.pts[n].y);
                if (d2 < min_d2) {
                    min_n = n;
                    min_d2 = d2;
                }
            }

            // find second closest point
            let next_n = min_n;
            let next_d2 = min_d2;
            if (min_n == ptsLength - 1) {
                next_n = min_n - 1;
                next_d2 = canvas.getDistance2(head.x, head.y,
                    bot.pts[next_n].x, bot.pts[next_n].y);
            } else {
                let d2m = canvas.getDistance2(head.x, head.y,
                    bot.pts[min_n - 1].x, bot.pts[min_n - 1].y);
                let d2p = canvas.getDistance2(head.x, head.y,
                    bot.pts[min_n + 1].x, bot.pts[min_n + 1].y);
                if (d2m < d2p) {
                    next_n = min_n - 1;
                    next_d2 = d2m;
                } else {
                    next_n = min_n + 1;
                    next_d2 = d2p;
                }
            }

            // compute approximation
            let t2 = bot.pts[min_n].len - bot.pts[next_n].len;
            t2 *= t2;

            if (t2 == 0) {
                return bot.pts[min_n].len;
            } else {
                let min_w = t2 - (min_d2 - next_d2);
                let next_w = t2 + (min_d2 - next_d2);
                return (bot.pts[min_n].len * min_w + bot.pts[next_n].len * next_w) / (2 * t2);
            }
        },

        bodyDangerZone: function (
            offset, targetPoint, targetPointNormal, closePointDist, pastTargetPoint, closePoint) {
            var head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };
            const o = bot.opt.followCircleDirection;
            var pts = [
                {
                    x: head.x - o * offset * bot.sin,
                    y: head.y + o * offset * bot.cos
                },
                {
                    x: head.x + bot.snakeWidth * bot.cos +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + bot.snakeWidth * bot.sin +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 1.75 * bot.snakeWidth * bot.cos +
                        o * 0.3 * bot.snakeWidth * bot.sin +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + 1.75 * bot.snakeWidth * bot.sin -
                        o * 0.3 * bot.snakeWidth * bot.cos +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 2.5 * bot.snakeWidth * bot.cos +
                        o * 0.7 * bot.snakeWidth * bot.sin +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + 2.5 * bot.snakeWidth * bot.sin -
                        o * 0.7 * bot.snakeWidth * bot.cos +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 3 * bot.snakeWidth * bot.cos +
                        o * 1.2 * bot.snakeWidth * bot.sin +
                        offset * bot.cos,
                    y: head.y + 3 * bot.snakeWidth * bot.sin -
                        o * 1.2 * bot.snakeWidth * bot.cos +
                        offset * bot.sin
                },
                {
                    x: targetPoint.x +
                        targetPointNormal.x * (offset + 0.5 * Math.max(closePointDist, 0)),
                    y: targetPoint.y +
                        targetPointNormal.y * (offset + 0.5 * Math.max(closePointDist, 0))
                },
                {
                    x: pastTargetPoint.x + targetPointNormal.x * offset,
                    y: pastTargetPoint.y + targetPointNormal.y * offset
                },
                pastTargetPoint,
                targetPoint,
                closePoint
            ];
            pts = canvas.convexHull(pts);
            var poly = {
                pts: pts
            };
            poly = canvas.addPolyBox(poly);
            return (poly);
        },

        followCircleSelf: function () {

            bot.populatePts();
            bot.determineCircleDirection();
            const o = bot.opt.followCircleDirection;


            // exit if too short
            if (bot.len < 9 * bot.snakeWidth) {
                return;
            }

            var head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };

            let closePointT = bot.closestBodyPoint();
            let closePoint = bot.smoothPoint(closePointT);

            // approx tangent and normal vectors and closePoint
            var closePointNext = bot.smoothPoint(closePointT - bot.snakeWidth);
            var closePointTangent = canvas.unitVector({
                x: closePointNext.x - closePoint.x,
                y: closePointNext.y - closePoint.y});
            var closePointNormal = {
                x: - o * closePointTangent.y,
                y:   o * closePointTangent.x
            };

            // angle wrt closePointTangent
            var currentCourse = Math.asin(Math.max(
                -1, Math.min(1, bot.cos * closePointNormal.x + bot.sin * closePointNormal.y)));

            // compute (oriented) distance from the body at closePointDist
            var closePointDist = (head.x - closePoint.x) * closePointNormal.x +
                (head.y - closePoint.y) * closePointNormal.y;

            // construct polygon for snake inside
            var insidePolygonStartT = 5 * bot.snakeWidth;
            var insidePolygonEndT = closePointT + 5 * bot.snakeWidth;
            var insidePolygonPts = [
                bot.smoothPoint(insidePolygonEndT),
                bot.smoothPoint(insidePolygonStartT)
            ];
            for (let t = insidePolygonStartT; t < insidePolygonEndT; t += bot.snakeWidth) {
                insidePolygonPts.push(bot.smoothPoint(t));
            }

            var insidePolygon = canvas.addPolyBox({
                pts: insidePolygonPts
            });

            // get target point; this is an estimate where we land if we hurry
            var targetPointT = closePointT;
            var targetPointFar = 0.0;
            let targetPointStep = bot.snakeWidth / 64;
            for (let h = closePointDist, a = currentCourse; h >= 0.125 * bot.snakeWidth; ) {
                targetPointT -= targetPointStep;
                targetPointFar += targetPointStep * Math.cos(a);
                h += targetPointStep * Math.sin(a);
                a = Math.max(-Math.PI / 4, a - targetPointStep / bot.snakeWidth);
            }

            var targetPoint = bot.smoothPoint(targetPointT);

            var pastTargetPointT = targetPointT - 3 * bot.snakeWidth;
            var pastTargetPoint = bot.smoothPoint(pastTargetPointT);

            // look for danger from enemies
            var enemyBodyOffsetDelta = 0.25 * bot.snakeWidth;
            var enemyHeadDist2 = 64 * 64 * bot.snakeWidth * bot.snakeWidth;
            for (let snake = 0, snakesNum = window.snakes.length; snake < snakesNum; snake++) {
                if (window.snakes[snake].id !== window.snake.id
                    && window.snakes[snake].alive_amt === 1) {
                    let enemyHead = {
                        x: window.snakes[snake].xx + window.snakes[snake].fx,
                        y: window.snakes[snake].yy + window.snakes[snake].fy
                    };
                    let enemyAhead = {
                        x: enemyHead.x +
                            Math.cos(window.snakes[snake].ang) * bot.snakeWidth,
                        y: enemyHead.y +
                            Math.sin(window.snakes[snake].ang) * bot.snakeWidth
                    };
                    // heads
                    if (!canvas.pointInPoly(enemyHead, insidePolygon)) {
                        enemyHeadDist2 = Math.min(
                            enemyHeadDist2,
                            canvas.getDistance2(enemyHead.x,  enemyHead.y,
                                targetPoint.x, targetPoint.y),
                            canvas.getDistance2(enemyAhead.x, enemyAhead.y,
                                targetPoint.x, targetPoint.y)
                            );
                    }
                    // bodies
                    let offsetSet = false;
                    let offset = 0.0;
                    let cpolbody = {};
                    for (let pts = 0, ptsNum = window.snakes[snake].pts.length;
                        pts < ptsNum; pts++) {
                        if (!window.snakes[snake].pts[pts].dying) {
                            let point = {
                                x: window.snakes[snake].pts[pts].xx +
                                   window.snakes[snake].pts[pts].fx,
                                y: window.snakes[snake].pts[pts].yy +
                                   window.snakes[snake].pts[pts].fy
                            };
                            while (!offsetSet || (enemyBodyOffsetDelta >= -bot.snakeWidth
                                && canvas.pointInPoly(point, cpolbody))) {
                                if (!offsetSet) {
                                    offsetSet = true;
                                } else {
                                    enemyBodyOffsetDelta -= 0.0625 * bot.snakeWidth;
                                }
                                offset = 0.5 * (bot.snakeWidth +
                                    bot.getSnakeWidth(window.snakes[snake].sc)) +
                                    enemyBodyOffsetDelta;
                                cpolbody = bot.bodyDangerZone(
                                    offset, targetPoint, closePointNormal, closePointDist,
                                    pastTargetPoint, closePoint);

                            }
                        }
                    }
                }
            }
            var enemyHeadDist = Math.sqrt(enemyHeadDist2);

            // plot inside polygon
            if (window.visualDebugging) {
                for (let p = 0, l = insidePolygon.pts.length; p < l; p++) {
                    let q = p + 1;
                    if (q == l) {
                        q = 0;
                    }
                    canvas.drawLine(
                        {x: insidePolygon.pts[p].x, y: insidePolygon.pts[p].y},
                        {x: insidePolygon.pts[q].x, y: insidePolygon.pts[q].y},
                        'orange');
                }
            }

            // mark closePoint
            if (window.visualDebugging) {
                canvas.drawCircle(canvas.circle(
                    closePoint.x,
                    closePoint.y,
                    bot.snakeWidth * 0.25
                ), 'white', false);
            }

            // mark safeZone
            if (window.visualDebugging) {
                canvas.drawCircle(canvas.circle(
                    targetPoint.x,
                    targetPoint.y,
                    bot.snakeWidth + 2 * targetPointFar
                ), 'white', false);
                canvas.drawCircle(canvas.circle(
                    targetPoint.x,
                    targetPoint.y,
                    0.2 * bot.snakeWidth
                ), 'white', false);
            }

            // draw sample cpolbody
            if (window.visualDebugging) {
                let soffset = 0.5 * bot.snakeWidth;
                let scpolbody = bot.bodyDangerZone(
                    soffset, targetPoint, closePointNormal,
                    closePointDist, pastTargetPoint, closePoint);
                for (let p = 0, l = scpolbody.pts.length; p < l; p++) {
                    let q = p + 1;
                    if (q == l) {
                        q = 0;
                    }
                    canvas.drawLine(
                        {x: scpolbody.pts[p].x, y: scpolbody.pts[p].y},
                        {x: scpolbody.pts[q].x, y: scpolbody.pts[q].y},
                        'white');
                }
            }

            // TAKE ACTION

            // expand?
            let targetCourse = currentCourse + 0.25;
            // enemy head nearby?
            let headProx = -1.0 - (2 * targetPointFar - enemyHeadDist) / bot.snakeWidth;
            if (headProx > 0) {
                headProx = 0.125 * headProx * headProx;
            } else {
                headProx = - 0.5 * headProx * headProx;
            }
            targetCourse = Math.min(targetCourse, headProx);
            // enemy body nearby?
            targetCourse = Math.min(
                targetCourse, targetCourse + (enemyBodyOffsetDelta - 0.0625 * bot.snakeWidth) /
                bot.snakeWidth);
            // small tail?
            var tailBehind = bot.len - closePointT;
            var targetDir = canvas.unitVector({
                x: bot.opt.followCircleTarget.x - head.x,
                y: bot.opt.followCircleTarget.y - head.y
            });
            var driftQ = targetDir.x * closePointNormal.x + targetDir.y * closePointNormal.y;
            var allowTail = bot.snakeWidth * (2 - 0.5 * driftQ);
            // a line in the direction of the target point
            if (window.visualDebugging) {
                canvas.drawLine(
                    { x: head.x, y: head.y },
                    { x: head.x + allowTail * targetDir.x, y: head.y + allowTail * targetDir.y },
                    'red');
            }
            targetCourse = Math.min(
                targetCourse,
                (tailBehind - allowTail + (bot.snakeWidth - closePointDist)) /
                bot.snakeWidth);
            // far away?
            targetCourse = Math.min(
                targetCourse, - 0.5 * (closePointDist - 4 * bot.snakeWidth) / bot.snakeWidth);
            // final corrections
            // too fast in?
            targetCourse = Math.max(targetCourse, -0.75 * closePointDist / bot.snakeWidth);
            // too fast out?
            targetCourse = Math.min(targetCourse, 1.0);

            var goalDir = {
                x: closePointTangent.x * Math.cos(targetCourse) -
                    o * closePointTangent.y * Math.sin(targetCourse),
                y: closePointTangent.y * Math.cos(targetCourse) +
                    o * closePointTangent.x * Math.sin(targetCourse)
            };
            var goal = {
                x: head.x + goalDir.x * 4 * bot.snakeWidth,
                y: head.y + goalDir.y * 4 * bot.snakeWidth
            };


            if (window.goalCoordinates
                && Math.abs(goal.x - window.goalCoordinates.x) < 1000
                && Math.abs(goal.y - window.goalCoordinates.y) < 1000) {
                window.goalCoordinates = {
                    x: Math.round(goal.x * 0.25 + window.goalCoordinates.x * 0.75),
                    y: Math.round(goal.y * 0.25 + window.goalCoordinates.y * 0.75)
                };
            } else {
                window.goalCoordinates = {
                    x: Math.round(goal.x),
                    y: Math.round(goal.y)
                };
            }

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Sorting by property 'score' descending
        sortScore: function (a, b) {
            return b.score - a.score;
        },

        // Sorting by property 'sz' descending
        sortSz: function (a, b) {
            return b.sz - a.sz;
        },

        // Sorting by property 'distance' ascending
        sortDistance: function (a, b) {
            return a.distance - b.distance;
        },

        computeFoodGoal: function () {
            bot.foodAngles = [];

            for (var i = 0; i < window.foods.length && window.foods[i] !== null; i++) {
                var f = window.foods[i];

                if (!f.eaten &&
                    !(
                        canvas.circleIntersect(
                            canvas.circle(f.xx, f.yy, 2),
                            bot.sidecircle_l) ||
                        canvas.circleIntersect(
                            canvas.circle(f.xx, f.yy, 2),
                            bot.sidecircle_r))) {
                    bot.addFoodAngle(f);
                }
            }

            bot.foodAngles.sort(bot.sortScore);

            if (bot.foodAngles[0] !== undefined && bot.foodAngles[0].sz > 0) {
                bot.currentFood = { x: bot.foodAngles[0].x,
                                    y: bot.foodAngles[0].y,
                                    sz: bot.foodAngles[0].sz,
                                    da: bot.foodAngles[0].da };
            } else {
                bot.currentFood = { x: bot.MID_X, y: bot.MID_Y, sz: 0 };
            }
        },

        foodAccel: function () {
            var aIndex = 0;

            if (bot.currentFood && bot.currentFood.sz > bot.opt.foodAccelSz) {
                aIndex = bot.getAngleIndex(bot.currentFood.ang);

                if (
                    bot.collisionAngles[aIndex] && bot.collisionAngles[aIndex].distance >
                    bot.currentFood.distance + bot.snakeRadius * bot.opt.radiusMult
                    && bot.currentFood.da < bot.opt.foodAccelDa) {
                    return 1;
                }

                if (bot.collisionAngles[aIndex] === undefined
                    && bot.currentFood.da < bot.opt.foodAccelDa) {
                    return 1;
                }
            }

            return bot.defaultAccel;
        },

        toCircle: function () {
            for (var i = 0; i < window.snake.pts.length && window.snake.pts[i].dying; i++);
            const o = bot.opt.followCircleDirection;
            var tailCircle = canvas.circle(
                window.snake.pts[i].xx,
                window.snake.pts[i].yy,
                bot.headCircle.radius
            );

            if (window.visualDebugging) {
                canvas.drawCircle(tailCircle, 'blue', false);
            }

            window.setAcceleration(bot.defaultAccel);
            bot.changeHeadingRel(o * Math.PI / 32);

            if (canvas.circleIntersect(bot.headCircle, tailCircle)) {
                bot.stage = 'circle';
            }
        },

        every: function () {
            bot.MID_X = window.grd;
            bot.MID_Y = window.grd;
            bot.MAP_R = window.grd * 0.98;
            bot.MAXARC = (2 * Math.PI) / bot.opt.arcSize;

            if (bot.opt.followCircleTarget === undefined) {
                bot.opt.followCircleTarget = {
                    x: bot.MID_X,
                    y: bot.MID_Y
                };
            }

            bot.sectorBoxSide = Math.floor(Math.sqrt(window.sectors.length)) * window.sector_size;
            bot.sectorBox = canvas.rect(
                window.snake.xx - (bot.sectorBoxSide / 2),
                window.snake.yy - (bot.sectorBoxSide / 2),
                bot.sectorBoxSide, bot.sectorBoxSide);
            // if (window.visualDebugging) canvas.drawRect(bot.sectorBox, '#c0c0c0', true, 0.1);

            bot.cos = Math.cos(window.snake.ang);
            bot.sin = Math.sin(window.snake.ang);

            bot.speedMult = window.snake.sp / bot.opt.speedBase;
            bot.snakeRadius = bot.getSnakeWidth() / 2;
            bot.snakeWidth = bot.getSnakeWidth();
            bot.snakeLength = Math.floor(15 * (window.fpsls[window.snake.sct] + window.snake.fam /
                window.fmlts[window.snake.sct] - 1) - 5);

            bot.headCircle = canvas.circle(
                window.snake.xx + bot.cos * Math.min(1, bot.speedMult - 1) *
                bot.opt.radiusMult / 2 * bot.snakeRadius,
                window.snake.yy + bot.sin * Math.min(1, bot.speedMult - 1) *
                bot.opt.radiusMult / 2 * bot.snakeRadius,
                bot.opt.radiusMult / 2 * bot.snakeRadius
            );


            if (window.visualDebugging) {
                canvas.drawCircle(bot.headCircle, 'blue', false);
            }

            bot.sidecircle_r = canvas.circle(
                window.snake.lnp.xx -
                ((window.snake.lnp.yy + bot.sin * bot.snakeWidth) -
                    window.snake.lnp.yy),
                window.snake.lnp.yy +
                ((window.snake.lnp.xx + bot.cos * bot.snakeWidth) -
                    window.snake.lnp.xx),
                bot.snakeWidth * bot.speedMult
            );

            bot.sidecircle_l = canvas.circle(
                window.snake.lnp.xx +
                ((window.snake.lnp.yy + bot.sin * bot.snakeWidth) -
                    window.snake.lnp.yy),
                window.snake.lnp.yy -
                ((window.snake.lnp.xx + bot.cos * bot.snakeWidth) -
                    window.snake.lnp.xx),
                bot.snakeWidth * bot.speedMult
            );
        },

        // Main bot
        go: function () {
            bot.every();

            if (bot.snakeLength < bot.opt.followCircleLength) {
                bot.stage = 'grow';
            }

            if (bot.currentFood && bot.stage !== 'grow') {
                bot.currentFood = undefined;
            }

            if (bot.stage === 'circle') {
                window.setAcceleration(bot.defaultAccel);
                bot.followCircleSelf();
            } else if (bot.checkCollision() || bot.checkEncircle()) {
                if (bot.actionTimeout) {
                    window.clearTimeout(bot.actionTimeout);
                    bot.actionTimeout = window.setTimeout(
                        bot.actionTimer, 1000 / bot.opt.targetFps * bot.opt.collisionDelay);
                }
            } else {
                if (bot.snakeLength > bot.opt.followCircleLength) {
                    bot.stage = 'tocircle';
                }
                if (bot.actionTimeout === undefined) {
                    bot.actionTimeout = window.setTimeout(
                        bot.actionTimer, 1000 / bot.opt.targetFps * bot.opt.actionFrames);
                }
                window.setAcceleration(bot.foodAccel());
            }
        },

        // Timer version of food check
        actionTimer: function () {
            if (window.playing && window.snake !== null && window.snake.alive_amt === 1) {
                if (bot.stage === 'grow') {
                    bot.computeFoodGoal();
                    window.goalCoordinates = bot.currentFood;
                    canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
                } else if (bot.stage === 'tocircle') {
                    bot.toCircle();
                }
            }
            bot.actionTimeout = undefined;
        }
    };
})(window);

var userInterface = window.userInterface = (function (window, document) {
    // Save the original slither.io functions so we can modify them, or reenable them later.
    var original_keydown = document.onkeydown;
    var original_onmouseDown = window.onmousedown;
    var original_oef = window.oef;
    var original_redraw = window.redraw;
    var original_onmousemove = window.onmousemove;

    window.oef = function () { };
    window.redraw = function () { };

    return {
        overlays: {},
        gfxEnabled: true,

        initServerIp: function () {
            var parent = document.getElementById('playh');
            var serverDiv = document.createElement('div');
            var serverIn = document.createElement('input');

            serverDiv.style.width = '244px';
            serverDiv.style.margin = '-30px auto';
            serverDiv.style.boxShadow = 'rgb(0, 0, 0) 0px 6px 50px';
            serverDiv.style.opacity = 1;
            serverDiv.style.background = 'rgb(76, 68, 124)';
            serverDiv.className = 'taho';
            serverDiv.style.display = 'block';

            serverIn.className = 'sumsginp';
            serverIn.placeholder = '0.0.0.0:444';
            serverIn.maxLength = 21;
            serverIn.style.width = '220px';
            serverIn.style.height = '24px';

            serverDiv.appendChild(serverIn);
            parent.appendChild(serverDiv);

            userInterface.server = serverIn;
        },

        initOverlays: function () {
            var botOverlay = document.createElement('div');
            botOverlay.style.position = 'fixed';
            botOverlay.style.right = '5px';
            botOverlay.style.bottom = '112px';
            botOverlay.style.width = '150px';
            botOverlay.style.height = '85px';
            // botOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            botOverlay.style.color = '#C0C0C0';
            botOverlay.style.fontFamily = 'Consolas, Verdana';
            botOverlay.style.zIndex = 999;
            botOverlay.style.fontSize = '14px';
            botOverlay.style.padding = '5px';
            botOverlay.style.borderRadius = '5px';
            botOverlay.className = 'nsi';
            document.body.appendChild(botOverlay);

            var serverOverlay = document.createElement('div');
            serverOverlay.style.position = 'fixed';
            serverOverlay.style.right = '5px';
            serverOverlay.style.bottom = '5px';
            serverOverlay.style.width = '160px';
            serverOverlay.style.height = '14px';
            serverOverlay.style.color = '#C0C0C0';
            serverOverlay.style.fontFamily = 'Consolas, Verdana';
            serverOverlay.style.zIndex = 999;
            serverOverlay.style.fontSize = '14px';
            serverOverlay.className = 'nsi';
            document.body.appendChild(serverOverlay);

            var prefOverlay = document.createElement('div');
            prefOverlay.style.position = 'fixed';
            prefOverlay.style.left = '10px';
            prefOverlay.style.top = '75px';
            prefOverlay.style.width = '260px';
            prefOverlay.style.height = '210px';
            // prefOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            prefOverlay.style.color = '#C0C0C0';
            prefOverlay.style.fontFamily = 'Consolas, Verdana';
            prefOverlay.style.zIndex = 999;
            prefOverlay.style.fontSize = '14px';
            prefOverlay.style.padding = '5px';
            prefOverlay.style.borderRadius = '5px';
            prefOverlay.className = 'nsi';
            document.body.appendChild(prefOverlay);

            var statsOverlay = document.createElement('div');
            statsOverlay.style.position = 'fixed';
            statsOverlay.style.left = '10px';
            statsOverlay.style.top = '295px';
            statsOverlay.style.width = '140px';
            statsOverlay.style.height = '210px';
            // statsOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            statsOverlay.style.color = '#C0C0C0';
            statsOverlay.style.fontFamily = 'Consolas, Verdana';
            statsOverlay.style.zIndex = 998;
            statsOverlay.style.fontSize = '14px';
            statsOverlay.style.padding = '5px';
            statsOverlay.style.borderRadius = '5px';
            statsOverlay.className = 'nsi';
            document.body.appendChild(statsOverlay);

            userInterface.overlays.botOverlay = botOverlay;
            userInterface.overlays.serverOverlay = serverOverlay;
            userInterface.overlays.prefOverlay = prefOverlay;
            userInterface.overlays.statsOverlay = statsOverlay;
        },

        toggleOverlays: function () {
            Object.keys(userInterface.overlays).forEach(function (okey) {
                var oVis = userInterface.overlays[okey].style.visibility !== 'hidden' ?
                    'hidden' : 'visible';
                userInterface.overlays[okey].style.visibility = oVis;
                window.visualDebugging = oVis === 'visible';
            });
        },


        toggleGfx: function () {
            if (userInterface.gfxEnabled) {
                var c = window.mc.getContext('2d');
                c.save();
                c.fillStyle = "#000000",
                c.fillRect(0, 0, window.mww, window.mhh),
                c.restore();

                var d = document.createElement('div');
                d.style.position = 'fixed';
                d.style.top = '50%';
                d.style.left = '50%';
                d.style.width = '200px';
                d.style.height = '60px';
                d.style.color = '#C0C0C0';
                d.style.fontFamily = 'Consolas, Verdana';
                d.style.zIndex = 999;
                d.style.margin = '-30px 0 0 -100px';
                d.style.fontSize = '20px';
                d.style.textAlign = 'center';
                d.className = 'nsi';
                document.body.appendChild(d);
                userInterface.gfxOverlay = d;

                window.lbf.innerHTML = '';
            } else {
                document.body.removeChild(userInterface.gfxOverlay);
                userInterface.gfxOverlay = undefined;
            }

            userInterface.gfxEnabled = !userInterface.gfxEnabled;
        },

        // Save variable to local storage
        savePreference: function (item, value) {
            window.localStorage.setItem(item, value);
            userInterface.onPrefChange();
        },

        // Load a variable from local storage
        loadPreference: function (preference, defaultVar) {
            var savedItem = window.localStorage.getItem(preference);
            if (savedItem !== null) {
                if (savedItem === 'true') {
                    window[preference] = true;
                } else if (savedItem === 'false') {
                    window[preference] = false;
                } else {
                    window[preference] = savedItem;
                }
                window.log('Setting found for ' + preference + ': ' + window[preference]);
            } else {
                window[preference] = defaultVar;
                window.log('No setting found for ' + preference +
                    '. Used default: ' + window[preference]);
            }
            userInterface.onPrefChange();
            return window[preference];
        },

        // Saves username when you click on "Play" button
        playButtonClickListener: function () {
            userInterface.saveNick();
            userInterface.loadPreference('autoRespawn', false);
            userInterface.onPrefChange();

            if (userInterface.server.value) {
                let s = userInterface.server.value.split(':');
                if (s.length === 2) {
                    window.force_ip = s[0];
                    window.force_port = s[1];
                    bot.connect();
                }
            } else {
                window.force_ip = undefined;
                window.force_port = undefined;
            }
        },

        // Preserve nickname
        saveNick: function () {
            var nick = document.getElementById('nick').value;
            userInterface.savePreference('savedNick', nick);
        },

        // Hide top score
        hideTop: function () {
            var nsidivs = document.querySelectorAll('div.nsi');
            for (var i = 0; i < nsidivs.length; i++) {
                if (nsidivs[i].style.top === '4px' && nsidivs[i].style.width === '300px') {
                    nsidivs[i].style.visibility = 'hidden';
                    bot.isTopHidden = true;
                    window.topscore = nsidivs[i];
                }
            }
        },

        // Store FPS data
        framesPerSecond: {
            fps: 0,
            fpsTimer: function () {
                if (window.playing && window.fps && window.lrd_mtm) {
                    if (Date.now() - window.lrd_mtm > 970) {
                        userInterface.framesPerSecond.fps = window.fps;
                    }
                }
            }
        },

        onkeydown: function (e) {
            // Original slither.io onkeydown function + whatever is under it
            original_keydown(e);
            if (window.playing) {
                // Letter `T` to toggle bot
                if (e.keyCode === 84) {
                    bot.isBotEnabled = !bot.isBotEnabled;
                }
                // Letter 'U' to toggle debugging (console)
                if (e.keyCode === 85) {
                    window.logDebugging = !window.logDebugging;
                    console.log('Log debugging set to: ' + window.logDebugging);
                    userInterface.savePreference('logDebugging', window.logDebugging);
                }
                // Letter 'Y' to toggle debugging (visual)
                if (e.keyCode === 89) {
                    window.visualDebugging = !window.visualDebugging;
                    console.log('Visual debugging set to: ' + window.visualDebugging);
                    userInterface.savePreference('visualDebugging', window.visualDebugging);
                }
                // Letter 'I' to toggle autorespawn
                if (e.keyCode === 73) {
                    window.autoRespawn = !window.autoRespawn;
                    console.log('Automatic Respawning set to: ' + window.autoRespawn);
                    userInterface.savePreference('autoRespawn', window.autoRespawn);
                }
                // Letter 'H' to toggle hidden mode
                if (e.keyCode === 72) {
                    userInterface.toggleOverlays();
                }
                // Letter 'G' to toggle graphics
                if (e.keyCode === 71) {
                    userInterface.toggleGfx();
                }
                // Letter 'O' to change rendermode (visual)
                if (e.keyCode === 79) {
                    userInterface.toggleMobileRendering(!window.mobileRender);
                }
                // Letter 'A' to increase collision detection radius
                if (e.keyCode === 65) {
                    bot.opt.radiusMult++;
                    console.log(
                        'radiusMult set to: ' + bot.opt.radiusMult);
                }
                // Letter 'S' to decrease collision detection radius
                if (e.keyCode === 83) {
                    if (bot.opt.radiusMult > 1) {
                        bot.opt.radiusMult--;
                        console.log(
                            'radiusMult set to: ' +
                            bot.opt.radiusMult);
                    }
                }
                // Letter 'Z' to reset zoom
                if (e.keyCode === 90) {
                    canvas.resetZoom();
                }
                // Letter 'Q' to quit to main menu
                if (e.keyCode === 81) {
                    window.autoRespawn = false;
                    userInterface.quit();
                }
                // 'ESC' to quickly respawn
                if (e.keyCode === 27) {
                    bot.quickRespawn();
                }
                userInterface.onPrefChange();
            }
        },

        onmousedown: function (e) {
            if (window.playing) {
                switch (e.which) {
                    // "Left click" to manually speed up the slither
                    case 1:
                        bot.defaultAccel = 1;
                        if (!bot.isBotEnabled) {
                            original_onmouseDown(e);
                        }
                        break;
                    // "Right click" to toggle bot in addition to the letter "T"
                    case 3:
                        bot.isBotEnabled = !bot.isBotEnabled;
                        break;
                }
            } else {
                original_onmouseDown(e);
            }
            userInterface.onPrefChange();
        },

        onmouseup: function () {
            bot.defaultAccel = 0;
        },

        // Manual mobile rendering
        toggleMobileRendering: function (mobileRendering) {
            window.mobileRender = mobileRendering;
            window.log('Mobile rendering set to: ' + window.mobileRender);
            userInterface.savePreference('mobileRender', window.mobileRender);
            // Set render mode
            if (window.mobileRender) {
                window.render_mode = 1;
                window.want_quality = 0;
                window.high_quality = false;
            } else {
                window.render_mode = 2;
                window.want_quality = 1;
                window.high_quality = true;
            }
        },

        // Update stats overlay.
        updateStats: function () {
            var oContent = [];
            var median;

            if (bot.scores.length === 0) return;

            median = Math.round((bot.scores[Math.floor((bot.scores.length - 1) / 2)] +
                bot.scores[Math.ceil((bot.scores.length - 1) / 2)]) / 2);

            oContent.push('games played: ' + bot.scores.length);
            oContent.push('a: ' + Math.round(
                bot.scores.reduce(function (a, b) { return a + b; }) / (bot.scores.length)) +
                ' m: ' + median);

            for (var i = 0; i < bot.scores.length && i < 10; i++) {
                oContent.push(i + 1 + '. ' + bot.scores[i]);
            }

            userInterface.overlays.statsOverlay.innerHTML = oContent.join('<br/>');
        },

        onPrefChange: function () {
            // Set static display options here.
            var oContent = [];
            var ht = userInterface.handleTextColor;

            oContent.push('version: ' + GM_info.script.version);
            oContent.push('[T] bot: ' + ht(bot.isBotEnabled));
            oContent.push('[O] mobile rendering: ' + ht(window.mobileRender));
            oContent.push('[A/S] radius multiplier: ' + bot.opt.radiusMult);
            oContent.push('[I] auto respawn: ' + ht(window.autoRespawn));
            oContent.push('[Y] visual debugging: ' + ht(window.visualDebugging));
            oContent.push('[U] log debugging: ' + ht(window.logDebugging));
            oContent.push('[Mouse Wheel] zoom');
            oContent.push('[Z] reset zoom');
            oContent.push('[ESC] quick respawn');
            oContent.push('[Q] quit to menu');

            userInterface.overlays.prefOverlay.innerHTML = oContent.join('<br/>');
        },

        onFrameUpdate: function () {
            // Botstatus overlay
            if (window.playing && window.snake !== null) {
                let oContent = [];

                oContent.push('fps: ' + userInterface.framesPerSecond.fps);

                // Display the X and Y of the snake
                oContent.push('x: ' +
                    (Math.round(window.snake.xx) || 0) + ' y: ' +
                    (Math.round(window.snake.yy) || 0));

                if (window.goalCoordinates) {
                    oContent.push('target');
                    oContent.push('x: ' + window.goalCoordinates.x + ' y: ' +
                        window.goalCoordinates.y);
                    if (window.goalCoordinates.sz) {
                        oContent.push('sz: ' + window.goalCoordinates.sz);
                    }
                }

                userInterface.overlays.botOverlay.innerHTML = oContent.join('<br/>');

                if (userInterface.gfxOverlay) {
                    let gContent = [];

                    gContent.push('<b>' + window.snake.nk + '</b>');
                    gContent.push(bot.snakeLength);
                    gContent.push('[' + window.rank + '/' + window.snake_count + ']');

                    userInterface.gfxOverlay.innerHTML = gContent.join('<br/>');
                }

                if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
                    window.bso.ip + ':' + window.bso.po) {
                    userInterface.overlays.serverOverlay.innerHTML =
                        window.bso.ip + ':' + window.bso.po;
                }
            }

            if (window.playing && window.visualDebugging) {
                // Only draw the goal when a bot has a goal.
                if (window.goalCoordinates && bot.isBotEnabled) {
                    var headCoord = { x: window.snake.xx, y: window.snake.yy };
                    canvas.drawLine(
                        headCoord,
                        window.goalCoordinates,
                        'green');
                    canvas.drawCircle(window.goalCoordinates, 'red', true);
                }
            }
        },

        oefTimer: function () {
            var start = Date.now();
            canvas.maintainZoom();
            original_oef();
            if (userInterface.gfxEnabled) {
                original_redraw();
            } else {
                window.visualDebugging = false;
            }

            if (window.playing && bot.isBotEnabled && window.snake !== null) {
                window.onmousemove = function () { };
                bot.isBotRunning = true;
                bot.go();
            } else if (bot.isBotEnabled && bot.isBotRunning) {
                bot.isBotRunning = false;

                if (window.lastscore && window.lastscore.childNodes[1]) {
                    bot.scores.push(parseInt(window.lastscore.childNodes[1].innerHTML));
                    bot.scores.sort(function (a, b) { return b - a; });
                    userInterface.updateStats();
                }

                if (window.autoRespawn) {
                    bot.connect();
                }
            }

            if (!bot.isBotEnabled || !bot.isBotRunning) {
                window.onmousemove = original_onmousemove;
            }

            userInterface.onFrameUpdate();

            if (!bot.isBotEnabled && !window.no_raf) {
                window.raf(userInterface.oefTimer);
            } else {
                setTimeout(
                    userInterface.oefTimer, (1000 / bot.opt.targetFps) - (Date.now() - start));
            }
        },

        // Quit to menu
        quit: function () {
            if (window.playing && window.resetGame) {
                window.want_close_socket = true;
                window.dead_mtm = 0;
                if (window.play_btn) {
                    window.play_btn.setEnabled(true);
                }
                window.resetGame();
            }
        },

        handleTextColor: function (enabled) {
            return '<span style=\"color:' +
                (enabled ? 'green;\">enabled' : 'red;\">disabled') + '</span>';
        }
    };
})(window, document);

/*
  The MIT License (MIT)
  Copyright (c) 2016 Slither Sessions.  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

var ss = window.ss = (function() {
  return {
    clanTags: [ 'SS', 'JG', 'YT' ],
    mods: [],
    options: {
      leaderBoardTitle: 'Slither Sessions',
      rotateSkins: false,
      useLastHost: false
    },

    version: function() { return '2.2.1'; },

    isInt: function (n) {
      return !isNaN(n) && Number(n) === n && n % 1 === 0;
    },

    connect: function() {
      if (ss.options.useLastHost) {
        var host = ss.loadOption ('lastHost');
        if (host && host.length > 0) {
          var addy = host.split(':')[0].trim(),
              port = host.split(':')[1].trim();
          forceServer (addy, port);
        }
      }

      window.connect();
    },

    connectToHost: function() {
      defaultIp = ss.loadOption ('lastHost', '');
      eipaddr = prompt ('Enter the IP address:', defaultIp);
      if (eipaddr && eipaddr.indexOf(":") != -1 && eipaddr.indexOf(".") != -1) {
        ss.saveOption ('lastHost', eipaddr);
        var addy = eipaddr.split(':')[0].trim(),
            port = eipaddr.split(':')[1].trim();
        forceServer (addy, port);
        connect();
        ss.waitForSnake (function (s) {
          setSkin (s, ss.skins.skin);
        });
      }
    },

    currentIp: function() {
      return (typeof bso != 'undefined') ? bso.ip : false;
    },

    forceLastHost: function() { },

    register: function (mod) {
      ss.mods.push (mod);
      ss[mod.slug] = mod;
      return ss;
    },

    quit: function() {
      return window.userInterface.quit();
    },

    saveOption: function (key, val) {
      return window.userInterface.savePreference (key, val);
    },

    loadOption: function (key, d) {
      return window.userInterface.loadPreference (key, d);
    },

    onFrameUpdate: function() {
      if (! window.playing || window.snake === null) {
        $(userInterface.connect).fadeIn();
        return;
      }

      $(userInterface.connect).fadeOut();

      // customize leaderboard title
      if (typeof window.lbh != 'undefined' &&
            window.lbh.textContent != ss.options.leaderBoardTitle)
      {
        window.log ("[SS] Updated leaderboard title: " + ss.options.leaderBoardTitle);
        window.lbh.textContent = ss.options.leaderBoardTitle;
      }

      // save last host when it changes
      if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
          window.bso.ip + ':' + window.bso.po) {
          userInterface.overlays.serverOverlay.innerHTML =
              window.bso.ip + ':' + window.bso.po;
          ss.saveOption('lastHost', window.bso.ip + ':' + window.bso.po);
      }
    },

    waitForSnake: function (callback, retries) {
      if (! ss.isInt (retries))
        retries = 4;

      var r = 0;

      function _waitForSnake() {
        if (r > retries)
          return;

        if (! window.snake) {
          window.log('[SS] waiting for snake r=' + r + '...');
          ++r;
          setTimeout (_waitForSnake, 300);
          return;
        }

        callback (window.snake);
      }

      return _waitForSnake();
    },

    quit: function() {
      userInterface.quit();
    }
  };
})();
/*
  The MIT License (MIT)
  Copyright (c) 2016 Slither Sessions.  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

ss.register ((function() {
  return {
    slug: 'resources',
    images: {
      spykeLogo:  'data:image/png;base64,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',
      hazardLogo: 'data:image/png;base64,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'
    },
    init: function() {

    }
  };
})());
/*
  The MIT License (MIT)
  Copyright (c) 2016 Slither Sessions.  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

ss.register ((function() {
  var impl = {
    /** Reference slither's max skin number */
    superMaxSkinCv: window.max_skin_cv,

    /** Reference slither's original setSkin */
    superSetSkin: window.setSkin,

    /** Canvas used for drawing the antenna */
    bulb: null,

    setupSkins: function() {
      if (skins.extras.length > 0)
        return;

      skins.add ({ rbcs: [ 9, 9, 9, 13, 13, 13 ] })     // green/white
           .add ({ rbcs: [ 9, 9, 9, 11, 11, 11 ] })     // black/white
           .add ({ rbcs: [ 0, 0, 0, 8, 8, 8 ] })        // striped purple
           .add ({ rbcs: [ 11 ] })                      // black
           .add ({ rbcs: [ 11, 9, 11, 7, 7, 7 ] })      // spyke gaming
           .add ({ rbcs: [ 5, 5, 5, 11, 11, 11 ]})      // orange/black
           .add ({ rbcs: [ 12, 12, 12, 11, 11, 11 ] }); // gold/black

      function bulbSrcForSkin (skinId) {
        if (skinId == 48)
          return ss.resources.images.spykeLogo;
        else if (skinId == 49)
          return ss.resources.images.hazardLogo;

        return false;
      }

      function configureAntenna (snk, skinId) {
        if (skinId == 48) {
          // spyke
          snk.bsc  = .30;  // bulb scale
          snk.blba = 1.0;  // bulb alpha
          snk.blbx = -16;  // bulb x
          snk.blby = -70;  // bulb y
        }

        if (skinId == 49) {
          snk.atc1 = "#800";
          snk.atc2 = "#600";
        }
      }

      function addAntenna (snk, skinId) {
        if (impl.bulb == null) {
          impl.bulb = document.createElement('canvas');
          impl.bulb.style.display = false;
        }

        if (snk.bulb == null || typeof snk.bulb == 'undefined')
          snk.bulb = impl.bulb;

        {
          // Add the bulb image. scoped to avoid memory leak.
          var img = new Image();
          img.src = bulbSrcForSkin (skinId);
          snk.bulb.width  = parseInt (img.width);
          snk.bulb.height = parseInt (img.height);
          var ctx = snk.bulb.getContext ('2d');
          ctx.drawImage (img, 0, 0, img.width, img.height,
                              0, 0, img.width, img.height);
          img = null;
        }

        snk.atax = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        snk.atay = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        snk.atvx = [0, -2.174018144607544, -1.9938501119613647, -2.2244787216186523, -2.1016628742218018, -2.0143206119537354, -2.095236301422119, -2.2232143878936768, -1.9363921880722046];
        snk.atvy = [0, -0.7573261260986328, -0.7961844801902771, -0.3080170750617981, 0.2950030565261841, 0.8237428069114685, 0.568598210811615, 0.027775723487138748, -0.6246974468231201];
        snk.atx  = [10792, 10788.1982421875, 10784.205078125, 10780.369140625, 10776.814453125, 10773.0830078125, 10769.091796875, 10765.2275390625, 10761.48046875];
        snk.aty  = [10800, 10799.658203125, 10798.2373046875, 10796.662109375, 10795.90625, 10796.720703125, 10798.310546875, 10799.6298828125, 10799.82421875];

        snk.atba = 0.0; // not sure what this is
        snk.atia = 1.0; // antenna alhpa
        snk.atc1 = "#800";
        snk.atc2 = "#b00";

        snk.atwg = true;

        snk.bsc  = .25;  // bulb scale
        snk.blba = 1.0;  // bulb alpha
        snk.blbw = snk.bulb.width;   // bulb width
        snk.blbh = snk.bulb.height;  // bulb height
        snk.blbx = -1 * (snk.bulb.width / 2);  // bulb x
        snk.blby = -1 * (snk.bulb.height / 2);  // bulb y

        configureAntenna (snk, skinId);

        snk.abrot = true;
        snk.antenna_shown = true;
        snk.antenna = true;
      };

      window.setSkin = function (snk, skinId) {
        var skinIdCopy = skinId,
            isOnSkinChooser = $('#psk').is(':visible');

        impl.resetAntenna (snk);
        impl.superSetSkin (snk, parseInt (skinId));

        if (skinId > impl.superMaxSkinCv) {
          var c;
          var checkSkinId = skinId - impl.superMaxSkinCv - 1;

          if (skins.extras[checkSkinId] !== undefined) {
            c = skins.extras[checkSkinId].rbcs;
          } else {
            skinId %= 9;
          }

          c && (skinId = c[0]);
          snk.rbcs = c;
          snk.cv = skinId;

          if (skinIdCopy == 48) {
            addAntenna (snk, parseInt (skinIdCopy));
          }
        }

        if (isOnSkinChooser) {
          skins.skin = skinIdCopy;
          ss.saveOption ('skinId', skins.skin);
        }
      };
    },

    loop: function() {
      skins.rotate();
      setTimeout (impl.loop, 1500);
    },

    resetAntenna: function (snk) {
      snk.bulb = null;
    }
  };

  var skins = {
    slug: 'skins',
    skin: 0,

    extras: [],

    init: function() {
      skins.skin = parseInt (ss.loadOption ('skinId', 0));
      if (! ss.isInt (skins.skin) || typeof skins.skin == 'undefined' || isNaN (skins.skin))
        skins.skin = 0;
      impl.setupSkins();
      impl.loop();
    },

    add: function (skin) {
      if (typeof skin.rbcs == 'undefined' || skin.rbcs == null || skin.rbcs.length <= 0)
        return skins;

      skins.extras.push (skin);
      window.max_skin_cv += 1
      return skins;
    },

    rotate: function() {
      haveSnake = (typeof window.ws != 'undefined' && !$('#psk').is(':visible') &&
            typeof window.snake != 'undefined' && window.snake != null);
      if (! haveSnake)
        return;

      if (ss.options.rotateSkins) {
        skins.next();
      } else if (window.snake.rcv != skins.skin) {
        setSkin (snake, skins.skin);
      }
    },

    next: function() {
      if (typeof window.snake == 'undefined')
        return;

      skins.skin += 1;

      if (skins.skin > max_skin_cv)
        skins.skin = 0;

      setSkin (window.snake, skins.skin);
    },

    previous: function() {
      if (typeof window.snake == 'undefined')
        return;

      if (skins.skin <= 0)
        skins.skin = max_skin_cv;
      else
        skins.skin -= 1;
      setSkin (window.snake, skins.skin);
    }
  };

  return skins;
})());
/*
  The MIT License (MIT)
  Copyright (c) 2016 Slither Sessions.  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

function asciize (b, typing) {
  var h, c, f;
  c = b.length;
  var w = !1;
  for (h = 0; h < c; h++)
    if (f = b.charCodeAt(h), 32 > f || 127 < f) {
      w = !0;
      break
    }
  if (w) {
    w = "";
    for (h = 0; h < c; h++) f = b.charCodeAt(h), w = 32 > f || 127 < f ? w + " " : w + String.fromCharCode(f);
    return w
  }

  return ss.clanTags.length > 0 && !typing ? jQuery("#tag").val() + ' ' + b : b;
}

function ssAddClanTags() {
  window.nick.oninput = function() {
    var b = this.value;
    var h = asciize (b, true);
    24 < h.length && (h = h.substr (0, 24));
    b != h && (this.value = h);
  };

  $('.taho').before (
    '<div id="ss-tag-holder" class="taho"><select class="sumsginp" id="tag"></select></div>'
  );

  $('#tag').change(function () {
      ss.saveOption ('savedClan', $(this).val());
  });

  $('#tag').append("<option value=''>---</option>");
  for (var i = 0; i < ss.clanTags.length; ++i) {
    var tag = ss.clanTags [i];
    $("#tag").append("<option value='[" + tag + "]'>[" + tag + "]</option>");
  }
}

ssAddClanTags();
/*
  The MIT License (MIT)
  Copyright (c) 2016 Slither Sessions.  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// bot ui extensions and overrides
userInterface.superOnFrameUpdate = userInterface.onFrameUpdate;
userInterface.onFrameUpdate = function() {
  userInterface.superOnFrameUpdate();
  if (typeof window.ss != 'undefined')
    window.ss.onFrameUpdate();
};

userInterface.superOefTimer = userInterface.oefTimer;
userInterface.oefTimer = function() {
  userInterface.superOefTimer();
  if (! window.playing)
    canvas.resetZoom();
}

userInterface.removeLogo = function() {
  if (typeof window.showlogo_iv !== 'undefined') {
    window.ncka = window.lgss = window.lga = 1;
    clearInterval(window.showlogo_iv);
    showLogo(true);
  }
};

userInterface.toggleOverlays = function() {
  Object.keys(userInterface.overlays).forEach (function (okey) {
    var isIpBox = userInterface.overlays[okey].id == 'ss-server-overlay';
    if (! isIpBox) {
      var oVis = userInterface.overlays[okey].style.visibility !== 'hidden'
        ? 'hidden' : 'visible';
      userInterface.overlays[okey].style.visibility = oVis;
    }
  });
};

userInterface.ssOnKeyDown = function (e) {
  userInterface.onkeydown (e);

  if (! window.playing)
    return;

  // Letter 'L' to rotate skins
  if (e.keyCode === 76) {
      ss.options.rotateSkins = !ss.options.rotateSkins;
      userInterface.savePreference ('rotateSkins', ss.options.rotateSkins);
  }
  // Letter 'K' next skin
  if (e.keyCode === 75) {
      ss.skins.next();
  }
  // Letter 'J' previous skin
  if (e.keyCode === 74) {
      ss.skins.previous();
  }
  // Letter 'P' toggle static host
  if (e.keyCode === 80) {
      ss.options.useLastHost = !ss.options.useLastHost;
      // ss.saveOption ('useLastHost', ss.options.useLastHost);
  }
  // Key ']' toggle IP visibility
  if (e.keyCode === 221) {
      var serverOverlay = document.getElementById('ss-server-overlay');
      var oVis = serverOverlay.style.visibility !== 'hidden' ? 'hidden' : 'visible';
      serverOverlay.style.visibility = oVis;
  }

  userInterface.onPrefChange();
};

userInterface.onPrefChange = function () {
  // Set static display options here.
  var oContent = [];
  var ht = userInterface.handleTextColor;

  oContent.push('version: ' + window.ss.version());
  oContent.push('[T / Right click] bot: ' + ht(bot.isBotEnabled));
  oContent.push('[O] mobile rendering: ' + ht(window.mobileRender));
  oContent.push('[A/S] radius multiplier: ' + bot.opt.radiusMult);
  // oContent.push('[D] quick radius change ' +
  //     bot.opt.radiusApproachSize + '/' + bot.opt.radiusAvoidSize);
  oContent.push('[I] auto respawn: ' + ht(window.autoRespawn));
  oContent.push('[G] leaderboard overlay: ' + ht(window.leaderboard));
  oContent.push('[Y] visual debugging: ' + ht(window.visualDebugging));
  oContent.push('[U] log debugging: ' + ht(window.logDebugging));
  oContent.push('[H] overlays');
  oContent.push('[B] change background');
  oContent.push('[Mouse Wheel] zoom');
  oContent.push('[Z] reset zoom');
  oContent.push('[L] rotate skins: ' + ht(ss.options.rotateSkins));
  oContent.push('[K] next skin');
  oContent.push('[J] previous skin');
  oContent.push('[P] use static host: ' + ht(ss.options.useLastHost));
  oContent.push('[ESC] quick respawn');
  oContent.push('[Q] quit to menu');

  userInterface.overlays.prefOverlay.innerHTML = oContent.join('<br/>');
};

userInterface.playButtonClickListener = function () {
  userInterface.saveNick();
  userInterface.loadPreference('autoRespawn', false);
  userInterface.onPrefChange();

  ss.connect();
  ss.waitForSnake (function (s) {
    setSkin (s, ss.skins.skin);
  });
};

// Main
(function (window, document) {
  window.play_btn.btnf.addEventListener ('click', userInterface.playButtonClickListener);
  document.onkeydown = userInterface.ssOnKeyDown;
  window.onmousedown = userInterface.onmousedown;
  window.addEventListener ('mouseup', userInterface.onmouseup);

  // tweak bot Defaults
  bot.isBotEnabled = false;
  bot.opt.followCircleLength = 8000;
  bot.opt.targetFps = 30;

  // Hide top score
  userInterface.hideTop();

  // IP Connect button
  var connectButton = document.createElement('div');
  connectButton.id = "ss-ip-box";
  connectButton.className = "nsi";
  var connectLabel = document.createElement('label');
  connectLabel.innerHTML = "Connect to IP";
  connectLabel.className = "on";
  connectLabel.id = "ss-ip-connect";
  connectLabel.addEventListener ('click', ss.connectToHost);
  connectButton.appendChild (connectLabel);
  document.body.appendChild (connectButton);
  userInterface.connect = connectButton;

  // Overlays
  userInterface.initOverlays();
  userInterface.overlays.serverOverlay.id = "ss-server-overlay";
  userInterface.overlays.serverOverlay.style.position = 'fixed';
  userInterface.overlays.serverOverlay.style.left = '140px';
  userInterface.overlays.serverOverlay.style.bottom = '10px';
  userInterface.overlays.serverOverlay.style.width = '400px';
  userInterface.overlays.serverOverlay.style.height = '42px';
  userInterface.overlays.serverOverlay.style.color = '#C0C0C0';
  userInterface.overlays.serverOverlay.style.fontFamily = 'Consolas, Verdana';
  userInterface.overlays.serverOverlay.style.zIndex = 999;
  userInterface.overlays.serverOverlay.style.fontSize = '42px';
  userInterface.overlays.serverOverlay.style.overflow = 'visible';
  userInterface.overlays.serverOverlay.className = 'nsi';

  userInterface.overlays.statsOverlay.style.top = '390px';

  // Load preferences
  ss.loadOption ('logDebugging', false);
  ss.loadOption ('visualDebugging', false);
  ss.loadOption ('autoRespawn', true);
  ss.loadOption ('mobileRender', false);
  ss.options.rotateSkins = ss.loadOption ('rotateSkins', false);
  window.nick.value = ss.loadOption ('savedNick', 'Robot');

  // Listener for mouse wheel scroll - used for setZoom function
  document.body.addEventListener ('mousewheel', canvas.setZoom);
  document.body.addEventListener ('DOMMouseScroll', canvas.setZoom);

  // Set render mode
  if (window.mobileRender)
    userInterface.toggleMobileRendering (true);

  // Unblocks all skins without the need for FB sharing.
  window.localStorage.setItem ('edttsg', '1');

  // Remove social
  userInterface.removeLogo();
  window.social.remove();

  // Maintain fps
  setInterval (userInterface.framesPerSecond.fpsTimer, 80);

  // Start!
  userInterface.oefTimer();
})(window, document);

// SS jQuery main
$(function() {
  // $('#playh .btnt.nsi.sadg1').click (function (e) {
  //   if (ss.options.useLastHost) {
  //     ss.forceLastHost();
  //   }
  //
  //   ss.waitForSnake (function (s) {
  //     setSkin (s, ss.skins.skin);
  //   });
  // });

  $('#tag').val (ss.loadOption ('savedClan', '[SS]'));
});

ss.mods.forEach (function (mod, i, a) {
  if (typeof mod.init != 'undefined')
    mod.init();
});
