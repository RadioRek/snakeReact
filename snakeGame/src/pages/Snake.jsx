import "./Snake.css";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";


export default function Snake() {
	const boardRef = useRef(null);

	useEffect(() => {
		const board = boardRef.current;
	}, []);

	const letters = useRef(['S', 'N', 'A', 'K', 'E', ' ']);
	const currentLetterIndex = useRef(0);
	const gameLoop = useRef(null);
	const grid = 20;

	// snake body parts
	const snake = useRef([
		{ x: 4, y: 7 },
		{ x: 3, y: 7 },
		{ x: 2, y: 7 }
	]);

	// html elements
	const snakeElements = useRef([]);
	const foodElement = useRef(null);

	// vector de direccion
	const dir = useRef({ x: 1, y: 0 });
	const dirChanged = useRef(false);


	useEffect(() => {

		const handleKeyDown = (e) => {
			if (dirChanged.current) {
				return;
			};

			if (e.key === "w" && dir.current.y !== 1) {
				dir.current = { x: 0, y: -1 };
			} else if (e.key === "s" && dir.current.y !== -1) {
				dir.current = { x: 0, y: 1 };
			} else if (e.key === "a" && dir.current.x !== 1) {
				dir.current = { x: -1, y: 0 };
			} else if (e.key === "d" && dir.current.x !== -1) {
				dir.current = { x: 1, y: 0 };
			}

			dirChanged.current = true;
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	// posicion de la comida
	const food = useRef({ x: 10, y: 7 });

	function initDraw() {
		snake.current.forEach(() => {

			const elem = document.createElement('div');
			elem.textContent = letters.current[currentLetterIndex.current];
			elem.className = 'letraSnake';
			currentLetterIndex.current = (currentLetterIndex.current + 1) % letters.current.length;

			const seg = document.createElement('div');
			seg.className = 'segmento';
			seg.style.display = 'flex';
			seg.style.alignItems = 'center';
			seg.style.justifyContent = 'center';
			seg.appendChild(elem);

			boardRef.current.appendChild(seg);
			snakeElements.current.push(seg);

		});

		// crear elemento comida
		foodElement.current = document.createElement('div');
		foodElement.current.className = 'comida';
		boardRef.current.appendChild(foodElement.current);
	}


	const prev = useRef(null);
	const next = useRef(null);

	function draw() {
		// mover comida
		foodElement.current.style.left = food.current.x * grid + "px";
		foodElement.current.style.top = food.current.y * grid + "px";

		// si la serpiente creció, crear nuevos elementos
		while (snakeElements.current.length < snake.current.length) {
			const seg = document.createElement("div");
			seg.className = "segmento";
			seg.style.display = "flex";
			seg.style.alignItems = "center";
			seg.style.justifyContent = "center";

			const elem = document.createElement("div");
			elem.textContent = letters.current[currentLetterIndex.current];
			elem.className = "letraSnake";

			currentLetterIndex.current = (currentLetterIndex.current + 1) % letters.current.length;
			seg.appendChild(elem);

			boardRef.current.appendChild(seg);
			snakeElements.current.push(seg);
		}

		// actualizar posiciones
		snake.current.forEach((part, i) => {
			snakeElements.current[i].style.border = 'none';

			if (i === 0) {
				if (dir.current.x === 1) {
					snakeElements.current[i].style.borderRadius = '0 10px 10px 0';
					snakeElements.current[i].style.borderRight = '1px solid green';
					snakeElements.current[i].style.borderTop = '1px solid green';
					snakeElements.current[i].style.borderBottom = '1px solid green';
					snakeElements.current[i].style.borderLeft = 'none';
				} else if (dir.current.x === -1) {
					snakeElements.current[i].style.borderRadius = '10px 0 0 10px';
					snakeElements.current[i].style.borderLeft = '1px solid green';
					snakeElements.current[i].style.borderTop = '1px solid green';
					snakeElements.current[i].style.borderBottom = '1px solid green';
					snakeElements.current[i].style.borderRight = 'none';
				} else if (dir.current.y === 1) {
					snakeElements.current[i].style.borderRadius = '0 0 10px 10px';
					snakeElements.current[i].style.borderBottom = '1px solid green';
					snakeElements.current[i].style.borderLeft = '1px solid green';
					snakeElements.current[i].style.borderRight = '1px solid green';
					snakeElements.current[i].style.borderTop = 'none';
				} else if (dir.current.y === -1) {
					snakeElements.current[i].style.borderRadius = '10px 10px 0 0';
					snakeElements.current[i].style.borderTop = '1px solid green';
					snakeElements.current[i].style.borderLeft = '1px solid green';
					snakeElements.current[i].style.borderRight = '1px solid green';
					snakeElements.current[i].style.borderBottom = 'none';
				}
			} else {
				prev.current = snake.current[i - 1];

				if (i + 1 >= snake.current.length) {
					// last segment
					if (part.x < prev.current.x) {
						// moving right
						snakeElements.current[i].style.borderRadius = '10px 0 0 10px';
						snakeElements.current[i].style.borderLeft = '1px solid green';
						snakeElements.current[i].style.borderTop = '1px solid green';
						snakeElements.current[i].style.borderBottom = '1px solid green';
						snakeElements.current[i].style.borderRight = 'none';
					} else if (part.x > prev.current.x) {
						// moving left
						snakeElements.current[i].style.borderRadius = '0 10px 10px 0';
						snakeElements.current[i].style.borderRight = '1px solid green';
						snakeElements.current[i].style.borderTop = '1px solid green';
						snakeElements.current[i].style.borderBottom = '1px solid green';
						snakeElements.current[i].style.borderLeft = 'none';
					} else if (part.y < prev.current.y) {
						// moving down
						snakeElements.current[i].style.borderRadius = '10px 10px 0 0';
						snakeElements.current[i].style.borderTop = '1px solid green';
						snakeElements.current[i].style.borderLeft = '1px solid green';
						snakeElements.current[i].style.borderRight = '1px solid green';
						snakeElements.current[i].style.borderBottom = 'none';
					} else if (part.y > prev.current.y) {
						// moving up
						snakeElements.current[i].style.borderRadius = '0 0 10px 10px';
						snakeElements.current[i].style.borderBottom = '1px solid green';
						snakeElements.current[i].style.borderLeft = '1px solid green';
						snakeElements.current[i].style.borderRight = '1px solid green';
						snakeElements.current[i].style.borderTop = 'none';
					}
				} else {
					// next segment
					next.current = snake.current[i + 1];

					// detectar si es recto en X o en Y
					if (prev.current.y === part.y && next.current.y === part.y) {
						snakeElements.current[i].style.borderRadius = '0';
						snakeElements.current[i].style.borderTop = '1px solid green';
						snakeElements.current[i].style.borderBottom = '1px solid green';
						snakeElements.current[i].style.borderLeft = 'none';
						snakeElements.current[i].style.borderRight = 'none';
					} else if (prev.current.x === part.x && next.current.x === part.x) {
						snakeElements.current[i].style.borderRadius = '0';
						snakeElements.current[i].style.borderLeft = '1px solid green';
						snakeElements.current[i].style.borderRight = '1px solid green';
						snakeElements.current[i].style.borderTop = 'none';
						snakeElements.current[i].style.borderBottom = 'none';
					} else {

						if ((part.y < next.current.y && part.x === next.current.x) && (part.x > prev.current.x && part.y === prev.current.y)) {
							snakeElements.current[i].style.borderRadius = '0 10px 0 0';
							snakeElements.current[i].style.borderBottom = ' none';
							snakeElements.current[i].style.borderLeft = 'none';
							snakeElements.current[i].style.borderRight = '1px solid green';
							snakeElements.current[i].style.borderTop = '1px solid green';
						}

						if ((part.x < prev.current.x && part.y === prev.current.y) && (part.x === next.current.x && part.y > next.current.y)) {
							snakeElements.current[i].style.borderRadius = '0 0 0 10px';
							snakeElements.current[i].style.borderLeft = '1px solid green';
							snakeElements.current[i].style.borderTop = 'none';
							snakeElements.current[i].style.borderRight = 'none';
							snakeElements.current[i].style.borderBottom = '1px solid green';
						}

						if ((part.x === prev.current.x && part.y < prev.current.y) && (part.x < next.current.x && part.y === next.current.y)) {
							snakeElements.current[i].style.borderRadius = '10px 0 0 0';
							snakeElements.current[i].style.borderRight = 'none';
							snakeElements.current[i].style.borderBottom = 'none'
							snakeElements.current[i].style.borderLeft = '1px solid green';
							snakeElements.current[i].style.borderTop = '1px solid green';
						}

						if ((part.x < prev.current.x && part.y === prev.current.y) && (part.x === next.current.x && part.y < next.current.y)) {
							snakeElements.current[i].style.borderRadius = '10px 0 0 0';
							snakeElements.current[i].style.borderLeft = '1px solid green';
							snakeElements.current[i].style.borderRight = 'none';
							snakeElements.current[i].style.borderTop = '1px solid green';
							snakeElements.current[i].style.borderBottom = 'none';
						}

						if ((part.x === prev.current.x && part.y < prev.current.y) && (part.x > next.current.x && part.y === next.current.y)) {
							snakeElements.current[i].style.borderRadius = '0 10px 0 0';
							snakeElements.current[i].style.borderLeft = 'none';
							snakeElements.current[i].style.borderRight = '1px solid green';
							snakeElements.current[i].style.borderTop = '1px solid green';
							snakeElements.current[i].style.borderBottom = 'none';
						}

						if ((part.x === prev.current.x && part.y > prev.current.y) && (part.x > next.current.x && part.y === next.current.y)) {
							snakeElements.current[i].style.borderRadius = '0 0 10px 0';
							snakeElements.current[i].style.borderTop = 'none';
							snakeElements.current[i].style.borderRight = '1px solid green';
							snakeElements.current[i].style.borderBottom = '1px solid green';
							snakeElements.current[i].style.borderLeft = 'none';
						}

						if ((part.x === prev.current.x && part.y > prev.current.y) && (part.x < next.current.x && part.y === next.current.y)) {
							snakeElements.current[i].style.borderRadius = '0 0 0 10px';
							snakeElements.current[i].style.borderTop = 'none';
							snakeElements.current[i].style.borderRight = 'none';
							snakeElements.current[i].style.borderBottom = '1px solid green';
							snakeElements.current[i].style.borderLeft = '1px solid green';
						}

						if ((part.x > prev.current.x && part.y === prev.current.y) && (part.x === next.current.x && part.y > next.current.y)) {
							snakeElements.current[i].style.borderRadius = '0 0 10px 0';
							snakeElements.current[i].style.borderBottom = '1px solid green';
							snakeElements.current[i].style.borderLeft = 'none';
							snakeElements.current[i].style.borderTop = 'none';
							snakeElements.current[i].style.borderRight = '1px solid green';
						}


					}
				}
			}

			snakeElements.current[i].style.left = part.x * grid + "px";
			snakeElements.current[i].style.top = part.y * grid + "px";
		});
	}

	function update() {
		const head = {
			x: snake.current[0].x + dir.current.x,
			y: snake.current[0].y + dir.current.y
		};

		// colisión con paredes
		if (head.x < 0 || head.y < 0 || head.x >= grid || head.y >= grid) {
			clearInterval(gameLoop.current);
			loose();
			return;
		}

		// colisión con el cuerpo
		for (let i = 0; i < snake.current.length; i++) {
			if (snake.current[i].x === head.x && snake.current[i].y === head.y) {
				clearInterval(gameLoop.current);
				loose();
				return;
			}
		}

		snake.current.unshift(head);

		// comer comida
		if (head.x === food.current.x && head.y === food.current.y) {
			food.current = {
				x: Math.floor(Math.random() * grid),
				y: Math.floor(Math.random() * grid)
			};
		} else {
			snake.current.pop();
		}

		draw();
		dirChanged.current = false;

	}

	function resetGame() {
		// reiniciar snake, dirección y comida
		snake.current = [
			{ x: 4, y: 7 },
			{ x: 3, y: 7 },
			{ x: 2, y: 7 }
		];
		dir.current = { x: 1, y: 0 };
		food.current = { x: 5, y: 5 };
		currentLetterIndex.current = 0;

		// limpiar segmentos de la serpiente
		snakeElements.current.forEach(seg => {
			if (boardRef.current.contains(seg)) boardRef.current.removeChild(seg);
		});
		snakeElements.current.length = 0;

		// limpiar comida
		if (foodElement.current && boardRef.current.contains(foodElement.current)) {
			boardRef.current.removeChild(foodElement.current);
		}
		foodElement.current = null;

		// dibujar inicial
		initDraw();
		draw();

		// reiniciar loop del juego
		gameLoop.current = setInterval(update, 150);

		// ocultar pantalla de pérdida
		setShowLoosingScreen(false);
	}

	const [showLoosingScreen, setShowLoosingScreen] = useState(true);
	const [loosed, setLoosed] = useState(false);
	let loosingScreen = null;

	if (showLoosingScreen) {
		if (loosed) {
			loosingScreen = (
				<div className="loosingScreen">
					<div className="loosingCard">
						<h4 className="headSnake">
							<span className="txt-es">Has perdido!</span>
						</h4>

						<p className="parrafo">
							<span>Tu puntaje final es {snake.current.length}</span>
						</p>

						<div>
							<button className="botonReset" onClick={hideLoosing}>
								<span>Intentar denuevo!</span>
							</button>
						</div>
					</div>
				</div>
			)

		} else {
			loosingScreen = (
				<div className="loosingScreen">
					<div className="loosingCard">
						<h4 className="headSnake">
							<span>Quédate a jugar un ratillo</span>
						</h4>

						<p className="parrafo"></p>

						<div>
							<button className="botonReset" onClick={hideLoosing}>
								<span>¡Jugar!</span>
							</button>
						</div>
					</div>
				</div>
			);
		}
	} else {
		loosingScreen = null;
	}

	// loosing screen
	function hideLoosing() {
		setShowLoosingScreen(false);
		setLoosed(false);
		resetGame();
	}

	function loose() {
		setShowLoosingScreen(true);
		setLoosed(true);
	}

	return (
		<div className="snakePage">
			<div className="snake">
				{loosingScreen}

				<div className="espacioSnake" ref={boardRef}></div>
			</div>
		</div>

	);
}
