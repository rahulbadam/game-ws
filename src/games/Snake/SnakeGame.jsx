import Phaser from "phaser";
import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { updateGlobalScore } from "../../services/leaderboard";
import { useAuth } from "../../login/AuthContext";

export default function SnakeGame({ onGameOver }) {
    const onGameOverRef = useRef(onGameOver);
    const { user } = useAuth();
    const [hasPaidEntryFee, setHasPaidEntryFee] = useState(false);
    const gameRef = useRef(null);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(400);
    const [mobileDirection, setMobileDirection] = useState(null);

    // Function to handle mobile button presses
    const handleMobileDirection = (direction) => {
        setMobileDirection(direction);
    };

    useEffect(() => {
        onGameOverRef.current = onGameOver;
    }, [onGameOver]);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        function measure() {
            const parentW = el.clientWidth || window.innerWidth;
            const reservedV = 80;
            const maxByHeight = Math.max(200, window.innerHeight - reservedV);
            const maxAllowed = Math.min(800, maxByHeight);
            const w = Math.max(200, Math.min(parentW, maxAllowed));
            setContainerWidth(w);
        }
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const UI_BAR_HEIGHT = Math.round(44 * (containerWidth / 400));
    const DESIRED_GRID_COUNT = 20;
    const availableSide = Math.floor(containerWidth);
    const maxGridArea = Math.max(120, availableSide - 8);
    let GRID = Math.floor((maxGridArea - UI_BAR_HEIGHT) / DESIRED_GRID_COUNT);
    if (GRID < 8) GRID = 8;
    const GRID_COUNT = DESIRED_GRID_COUNT;
    const GRID_PIXEL_SIDE = GRID * GRID_COUNT;
    const CANVAS_WIDTH = GRID_PIXEL_SIDE;
    const CANVAS_HEIGHT = GRID_PIXEL_SIDE + UI_BAR_HEIGHT;
    const containerHeightPx = Math.round((containerWidth * CANVAS_HEIGHT) / CANVAS_WIDTH);

    useEffect(() => {
        if (window._phaserGame) {
            try { window._phaserGame.destroy(true); } catch (e) { }
            window._phaserGame = null;
        }

        const GRID_SIZE = GRID;
        const GRID_COUNT_LOCAL = GRID_COUNT;
        const WIDTH = CANVAS_WIDTH;
        const HEIGHT = CANVAS_HEIGHT;
        const CELL_OFFSET = GRID_SIZE / 2;
        const GRID_TOP = UI_BAR_HEIGHT;

        let snake = [];
        let snakePos = [];
        let food = null;
        let cursors;
        let score = 0;
        let scoreText;
        let moveInterval = 110;
        let lastMoveTime = 0;
        let direction = "RIGHT";
        let pendingDirection = null;
        let isRunning = false;

        // UI buttons
        let startText, pauseText, restartText;

        const config = {
            type: Phaser.AUTO,
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: "#0b0b0b",
            parent: containerRef.current || "game-container",
            scene: { preload, create, update },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent: containerRef.current ? containerRef.current.id : "game-container",
                width: WIDTH,
                height: HEIGHT,
            },
            render: { pixelArt: false },
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;
        window._phaserGame = game;

        function preload() {
            const g = this.make.graphics({ x: 0, y: 0, add: false });

            g.clear();
            g.fillStyle(0x4cd964, 1);
            g.fillRoundedRect(0, 0, GRID_SIZE, GRID_SIZE, GRID_SIZE * 0.28);
            g.fillStyle(0x2fb64a, 0.22);
            g.fillRoundedRect(2, 2, GRID_SIZE - 4, GRID_SIZE - 4, GRID_SIZE * 0.18);
            g.generateTexture("snake-body", GRID_SIZE, GRID_SIZE);

            g.clear();
            g.fillStyle(0x3bb84b, 1);
            g.fillRoundedRect(0, 0, GRID_SIZE, GRID_SIZE, GRID_SIZE * 0.28);
            g.fillStyle(0xffffff, 1);
            g.fillCircle(GRID_SIZE * 0.62, GRID_SIZE * 0.36, GRID_SIZE * 0.10);
            g.fillStyle(0x000000, 1);
            g.fillCircle(GRID_SIZE * 0.66, GRID_SIZE * 0.36, GRID_SIZE * 0.04);
            g.generateTexture("snake-head", GRID_SIZE, GRID_SIZE);

            g.clear();
            g.fillStyle(0xff4d4f, 1);
            g.fillCircle(GRID_SIZE / 2, GRID_SIZE / 2 + (GRID_SIZE * 0.02), GRID_SIZE * 0.44);
            g.fillStyle(0xff9b9b, 0.38);
            g.fillCircle(GRID_SIZE * 0.42, GRID_SIZE * 0.38, GRID_SIZE * 0.22);
            g.fillStyle(0x3b2f1e, 1);
            g.fillRoundedRect(GRID_SIZE * 0.48, GRID_SIZE * 0.06, GRID_SIZE * 0.06, GRID_SIZE * 0.12, 2);
            g.fillStyle(0x5dbb3b, 1);
            g.fillRoundedRect(GRID_SIZE * 0.36, GRID_SIZE * 0.06, GRID_SIZE * 0.18, GRID_SIZE * 0.08, 2);
            g.generateTexture("food", GRID_SIZE, GRID_SIZE);

            g.destroy();
        }

        function randGridIndex() {
            return Phaser.Math.Between(0, GRID_COUNT_LOCAL - 1);
        }

        function placeFood(scene) {
            let nx, ny, attempts = 0;
            do {
                const gx = randGridIndex();
                const gy = randGridIndex();
                nx = CELL_OFFSET + gx * GRID_SIZE;
                ny = GRID_TOP + CELL_OFFSET + gy * GRID_SIZE;
                attempts++;
                if (attempts > 2000) break;
            } while (snakePos.some(p => p.x === nx && p.y === ny));
            if (food) {
                try { food.destroy(); } catch (e) { }
            }
            food = scene.add.image(nx, ny, "food").setDepth(1).setDisplaySize(GRID_SIZE * 0.9, GRID_SIZE * 0.9).setOrigin(0.5);
            scene.tweens.add({
                targets: food,
                scale: 1.06,
                yoyo: true,
                duration: 800,
                repeat: -1,
                ease: "Sine.easeInOut",
            });
        }

        function updateButtonsVisibility() {
            if (!startText || !pauseText) return;
            if (isRunning) {
                startText.setVisible(false);
                pauseText.setVisible(true);
            } else {
                startText.setVisible(true);
                pauseText.setVisible(false);
            }
        }

        function create() {
            // UI bar background
            this.add.rectangle(WIDTH / 2, UI_BAR_HEIGHT / 2, WIDTH - 6, UI_BAR_HEIGHT - 8, 0x121212).setDepth(20).setStrokeStyle(1, 0x2b2b2b);

            scoreText = this.add.text(WIDTH - 12, (UI_BAR_HEIGHT / 2) - 8, "Score: 0", {
                fontFamily: "Arial",
                fontSize: Math.max(12, Math.round(14 * (containerWidth / 400))) + "px",
                color: "#ffffff",
            }).setOrigin(1, 0.5).setDepth(21);

            restartText = this.add.text(12, (UI_BAR_HEIGHT / 2) - 8, "Restart", {
                fontFamily: "Arial",
                fontSize: Math.max(12, Math.round(14 * (containerWidth / 400))) + "px",
                color: "#ffd86b",
                backgroundColor: "rgba(255,255,255,0.02)",
                padding: { x: 6, y: 2 }
            }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true }).setDepth(21);

            // Start / Pause in center
            const centerX = WIDTH / 2;
            startText = this.add.text(centerX, (UI_BAR_HEIGHT / 2) - 8, "Start", {
                fontFamily: "Arial",
                fontSize: Math.max(12, Math.round(14 * (containerWidth / 400))) + "px",
                color: "#7bf5a3",
                backgroundColor: "rgba(255,255,255,0.02)",
                padding: { x: 8, y: 3 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(21);

            pauseText = this.add.text(centerX, (UI_BAR_HEIGHT / 2) - 8, "Pause", {
                fontFamily: "Arial",
                fontSize: Math.max(12, Math.round(14 * (containerWidth / 400))) + "px",
                color: "#ffd86b",
                backgroundColor: "rgba(255,255,255,0.02)",
                padding: { x: 8, y: 3 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(21);

            // button handlers
            startText.on("pointerdown", async () => {
                isRunning = true;
                updateButtonsVisibility();

                // Deduct entry fee when game starts (only once per game session)
                if (user && !hasPaidEntryFee) {
                    setHasPaidEntryFee(true);
                    try {
                        const username = user.displayName || user.email?.split('@')[0] || 'Player';
                        await updateGlobalScore(user.uid, username, {
                            type: 'snake_entry',
                            countAsGame: false // This is just an entry fee, not a game completion
                        });
                        console.log("Snake entry fee deducted: -10 points");
                    } catch (error) {
                        console.error("Failed to deduct entry fee:", error);
                    }
                }
            });
            pauseText.on("pointerdown", () => {
                isRunning = false;
                updateButtonsVisibility();
            });
            restartText.on("pointerdown", () => {
                restartScene(this);
                isRunning = false;
                updateButtonsVisibility();
            });

            updateButtonsVisibility();

            // Grid area
            const gridTop = GRID_TOP;
            this.add.rectangle(WIDTH / 2, gridTop + GRID_PIXEL_SIDE / 2, GRID_PIXEL_SIDE + 4, GRID_PIXEL_SIDE + 4, 0x161616).setDepth(-4);

            const gg = this.add.graphics();
            gg.lineStyle(1, 0x1a1a1a, 0.15);
            for (let i = 0; i <= GRID_COUNT_LOCAL; i++) {
                gg.beginPath();
                gg.moveTo(0, gridTop + i * GRID_SIZE);
                gg.lineTo(GRID_PIXEL_SIDE, gridTop + i * GRID_SIZE);
                gg.closePath();
                gg.strokePath();
            }
            for (let i = 0; i <= GRID_COUNT_LOCAL; i++) {
                gg.beginPath();
                gg.moveTo(i * GRID_SIZE, gridTop);
                gg.lineTo(i * GRID_SIZE, gridTop + GRID_PIXEL_SIDE);
                gg.closePath();
                gg.strokePath();
            }
            gg.setDepth(-3);

            // initial snake and food (positions include gridTop for Y)
            snake = [];
            snakePos = [];
            const startIndex = Math.floor(GRID_COUNT_LOCAL / 2);
            const sx = CELL_OFFSET + startIndex * GRID_SIZE;
            const sy = gridTop + CELL_OFFSET + startIndex * GRID_SIZE;
            for (let i = 0; i < 3; i++) {
                const px = sx - i * GRID_SIZE;
                const seg = this.add.image(px, sy, i === 0 ? "snake-head" : "snake-body")
                    .setDepth(2)
                    .setDisplaySize(GRID_SIZE * 0.92, GRID_SIZE * 0.92)
                    .setOrigin(0.5);
                snake.push(seg);
                snakePos.push({ x: px, y: sy });
            }

            placeFood(this);

            cursors = this.input.keyboard.createCursorKeys();

            let startTouch = null;
            this.input.on("pointerdown", p => {
                // Check if touch is in control areas (only for mobile-like behavior)
                const isMobile = window.innerWidth < 768; // md breakpoint
                if (isMobile) {
                    const touchX = p.x;
                    const touchY = p.y;

                    // Left area (25% of width)
                    if (touchX < WIDTH * 0.25 && direction !== "RIGHT") {
                        pendingDirection = "LEFT";
                        return;
                    }
                    // Right area (25% of width from right)
                    else if (touchX > WIDTH * 0.75 && direction !== "LEFT") {
                        pendingDirection = "RIGHT";
                        return;
                    }
                    // Top area (25% of height from top, center 50%)
                    else if (touchY < HEIGHT * 0.25 && touchX > WIDTH * 0.25 && touchX < WIDTH * 0.75 && direction !== "DOWN") {
                        pendingDirection = "UP";
                        return;
                    }
                    // Bottom area (25% of height from bottom, center 50%)
                    else if (touchY > HEIGHT * 0.75 && touchX > WIDTH * 0.25 && touchX < WIDTH * 0.75 && direction !== "UP") {
                        pendingDirection = "DOWN";
                        return;
                    }
                }

                // Fallback to swipe gesture
                startTouch = { x: p.x, y: p.y };
            });

            this.input.on("pointerup", p => {
                if (!startTouch) return;
                const dx = p.x - startTouch.x;
                const dy = p.y - startTouch.y;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 10 && direction !== "LEFT") pendingDirection = "RIGHT";
                    if (dx < -10 && direction !== "RIGHT") pendingDirection = "LEFT";
                } else {
                    if (dy > 10 && direction !== "UP") pendingDirection = "DOWN";
                    if (dy < -10 && direction !== "DOWN") pendingDirection = "UP";
                }
                startTouch = null;
            });

            direction = "RIGHT";
            lastMoveTime = 0;
        }

        function restartScene(scene) {
            try {
                snake.forEach(s => s.destroy());
                if (food) food.destroy();
            } catch (e) { }
            snake = [];
            snakePos = [];
            score = 0;
            if (scoreText) scoreText.setText("Score: 0");

            const startIndex = Math.floor(GRID_COUNT / 2);
            const sx = CELL_OFFSET + startIndex * GRID;
            const sy = UI_BAR_HEIGHT + CELL_OFFSET + startIndex * GRID;
            for (let i = 0; i < 3; i++) {
                const px = sx - i * GRID;
                const seg = scene.add.image(px, sy, i === 0 ? "snake-head" : "snake-body")
                    .setDepth(2)
                    .setDisplaySize(GRID * 0.92, GRID * 0.92)
                    .setOrigin(0.5);
                snake.push(seg);
                snakePos.push({ x: px, y: sy });
            }
            placeFood(scene);
            direction = "RIGHT";
            lastMoveTime = 0;
        }

        function update(time) {
            if (!this || !this.game) return;

            // Check for direction keys to start game
            const leftPressed = Phaser.Input.Keyboard.JustDown(cursors.left);
            const rightPressed = Phaser.Input.Keyboard.JustDown(cursors.right);
            const upPressed = Phaser.Input.Keyboard.JustDown(cursors.up);
            const downPressed = Phaser.Input.Keyboard.JustDown(cursors.down);

            // Check for mobile button input (from React state)
            const mobileDir = window._snakeMobileDirection;
            if (mobileDir) {
                if (mobileDir === "LEFT" && direction !== "RIGHT") pendingDirection = "LEFT";
                if (mobileDir === "RIGHT" && direction !== "LEFT") pendingDirection = "RIGHT";
                if (mobileDir === "UP" && direction !== "DOWN") pendingDirection = "UP";
                if (mobileDir === "DOWN" && direction !== "UP") pendingDirection = "DOWN";
                // Clear the mobile direction after processing
                window._snakeMobileDirection = null;
            }

            // Start game if any direction key pressed and not running
            if (!isRunning && (leftPressed || rightPressed || upPressed || downPressed || mobileDir)) {
                isRunning = true;
                updateButtonsVisibility();
            }

            // ignore movement updates when not running
            if (!isRunning) return;

            if (leftPressed && direction !== "RIGHT") pendingDirection = "LEFT";
            if (rightPressed && direction !== "LEFT") pendingDirection = "RIGHT";
            if (upPressed && direction !== "DOWN") pendingDirection = "UP";
            if (downPressed && direction !== "UP") pendingDirection = "DOWN";

            if (time < lastMoveTime + moveInterval) return;
            lastMoveTime = time;

            if (pendingDirection) {
                direction = pendingDirection;
                pendingDirection = null;
            }

            const headPos = snakePos[0];
            let nx = headPos.x;
            let ny = headPos.y;
            if (direction === "LEFT") nx -= GRID;
            if (direction === "RIGHT") nx += GRID;
            if (direction === "UP") ny -= GRID;
            if (direction === "DOWN") ny += GRID;

            const topBound = UI_BAR_HEIGHT + CELL_OFFSET - 0.5;
            const leftBound = CELL_OFFSET - 0.5;
            const rightBound = (GRID_PIXEL_SIDE - CELL_OFFSET) + 0.5;
            const bottomBound = UI_BAR_HEIGHT + GRID_PIXEL_SIDE - CELL_OFFSET + 0.5;
            if (nx < leftBound || ny < topBound || nx > rightBound || ny > bottomBound) {
                try { game.destroy(true); } catch (e) { }
                window._phaserGame = null;
                onGameOverRef.current?.({ type: 'loss', score }); // Loss for hitting wall
                return;
            }

            snakePos.unshift({ x: nx, y: ny });

            const ate = food && Math.round(nx) === Math.round(food.x) && Math.round(ny) === Math.round(food.y);
            if (!ate) snakePos.pop();
            else {
                score += 1;
                if (scoreText) scoreText.setText("Score: " + score);

                // Award +1 point for eating food
                if (user) {
                    const username = user.displayName || user.email?.split('@')[0] || 'Player';
                    updateGlobalScore(user.uid, username, {
                        type: 'snake_food',
                        points: 1,
                        countAsGame: false // Food eating doesn't count as game completion
                    }).catch(error => {
                        console.error("Failed to award food points:", error);
                    });
                }
            }

            for (let i = 0; i < snakePos.length; i++) {
                const seg = snake[i];
                const p = snakePos[i];
                if (!seg) {
                    const img = this.add.image(p.x, p.y, "snake-body").setDepth(2).setDisplaySize(GRID * 0.92, GRID * 0.92).setOrigin(0.5);
                    snake.push(img);
                    continue;
                }
                if (i === 0) seg.setTexture("snake-head");
                else seg.setTexture("snake-body");
                this.tweens.add({
                    targets: seg,
                    x: p.x,
                    y: p.y,
                    duration: moveInterval - 20,
                    ease: "Sine.easeOut",
                });
            }

            if (ate) {
                const headImg = snake[0];
                headImg.setScale(0.85);
                this.tweens.add({
                    targets: headImg,
                    scale: 1,
                    duration: 140,
                    ease: "Back.Out",
                });
                placeFood(this);
            }

            for (let i = 1; i < snakePos.length; i++) {
                if (snakePos[i].x === snakePos[0].x && snakePos[i].y === snakePos[0].y) {
                    try { game.destroy(true); } catch (e) { }
                    window._phaserGame = null;
                    onGameOverRef.current?.({ type: 'loss', score }); // Loss for self collision
                    return;
                }
            }
        }

        return () => {
            if (gameRef.current) {
                try { gameRef.current.destroy(true); } catch (e) { }
                if (window._phaserGame === gameRef.current) window._phaserGame = null;
                gameRef.current = null;
            }
        };
    }, [containerWidth, GRID, GRID_COUNT, CANVAS_WIDTH, CANVAS_HEIGHT]);

    return (
        <div className="w-full flex flex-col min-h-screen">
            {/* Game Container - Full Screen on Mobile */}
            <div className="flex-1 flex items-center justify-center">
                <div
                    id="game-container"
                    ref={containerRef}
                    style={{
                        width: containerWidth,
                        height: containerHeightPx,
                        maxWidth: "100%",
                        maxHeight: "calc(100vh - 120px)", // More space for controls
                        margin: "8px auto",
                        boxSizing: "border-box",
                        padding: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                />
            </div>

            {/* Mobile Touch Controls - Bottom of Screen */}
            <div className="md:hidden bg-gray-900 p-4 border-t border-gray-700">
                <div className="max-w-sm mx-auto">
                    {/* Control Buttons Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        {/* Empty top left */}
                        <div></div>

                        {/* Up Button */}
                        <button
                            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg py-3 px-4 text-xl font-bold shadow-lg transition-colors"
                            onTouchStart={(e) => {
                                e.preventDefault();
                                window._snakeMobileDirection = "UP";
                            }}
                        >
                            ↑
                        </button>

                        {/* Empty top right */}
                        <div></div>

                        {/* Left Button */}
                        <button
                            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg py-3 px-4 text-xl font-bold shadow-lg transition-colors"
                            onTouchStart={(e) => {
                                e.preventDefault();
                                window._snakeMobileDirection = "LEFT";
                            }}
                        >
                            ←
                        </button>

                        {/* Down Button */}
                        <button
                            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg py-3 px-4 text-xl font-bold shadow-lg transition-colors"
                            onTouchStart={(e) => {
                                e.preventDefault();
                                window._snakeMobileDirection = "DOWN";
                            }}
                        >
                            ↓
                        </button>

                        {/* Right Button */}
                        <button
                            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg py-3 px-4 text-xl font-bold shadow-lg transition-colors"
                            onTouchStart={(e) => {
                                e.preventDefault();
                                window._snakeMobileDirection = "RIGHT";
                            }}
                        >
                            →
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className="text-center">
                        <div className="text-xs text-purple-400 font-medium mb-1">📱 Touch Controls</div>
                        <div className="text-xs text-gray-400">
                            Tap arrow buttons to move • Press any key to start
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Instructions - Bottom */}
            <div className="hidden md:block mt-4 px-4 pb-4">
                <div className="bg-gray-800 rounded-lg p-3 text-center max-w-md mx-auto">
                    <h3 className="text-sm font-bold text-green-400 mb-1">🐍 Snake Game</h3>
                    <p className="text-xs text-gray-300 mb-2">
                        Eat food, grow longer, avoid walls & yourself!
                    </p>
                    <div className="text-xs font-medium text-blue-400">
                        🎮 Use <kbd className="bg-gray-700 px-1 rounded mx-1">↑↓←→</kbd> arrow keys • Press any key to start
                    </div>
                </div>
            </div>
        </div>
    );
}
