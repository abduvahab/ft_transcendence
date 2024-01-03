import React, { useEffect, useRef } from "react";

type GameCanvasProps = {
  ctx: {
    paddle1: number;
    paddle2: number;
    ballX: number;
    ballY: number;
  };
};

const CanvasConstants = {
  HEIGHT: 800,
  WIDTH: 1200,

  TOP: 50,
  BOTTOM: -50,
  LEFT: 100,
  RIGHT: -100,

  PADDLE_WIDTH: 3,
  PADDLE_HEIGHT: 20,
  BALL_RADIUS: 8
};


const GameCanvas: React.FC<GameCanvasProps> = ({ctx}) => {
  let canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let canvas = canvasRef.current!;
    if (!canvas) return;
    
    let context = canvas.getContext('2d')!;
    const themeColor = localStorage.getItem('theme');
    const ballColor = localStorage.getItem('ball');
    if (!context) return;

    let img = new Image();

    
    context.fillStyle = themeColor || '#87CEEB';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.setLineDash([5, 5]);
    
    
    const middleX = CanvasConstants.WIDTH / 2;
    
    context.beginPath();
    context.moveTo(middleX, 0);
    context.lineTo(middleX, CanvasConstants.HEIGHT);
    context.strokeStyle = 'white';
    context.stroke();
    
    context.setLineDash([]);
    
    
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const ratio_y = CanvasConstants.HEIGHT / (CanvasConstants.TOP - CanvasConstants.BOTTOM);
    const ratio_x = CanvasConstants.WIDTH / (CanvasConstants.LEFT - CanvasConstants.RIGHT);
    
    const p1 = (ctx.paddle1 - CanvasConstants.BOTTOM) * ratio_y;
    const p2 = (ctx.paddle2 - CanvasConstants.BOTTOM) * ratio_y;
    const ph = CanvasConstants.PADDLE_HEIGHT * ratio_y;
    const pw = CanvasConstants.PADDLE_WIDTH * ratio_x;
    
    const bX = (ctx.ballX - CanvasConstants.RIGHT) * ratio_x;
    const bY = (ctx.ballY - CanvasConstants.BOTTOM) * ratio_y;
    const br = CanvasConstants.BALL_RADIUS;
    
    context.fillStyle = 'white';
    context.fillRect(0, p1 - ph / 2, pw, ph);
    
    context.fillStyle = 'white';
    context.fillRect(CanvasConstants.WIDTH - pw, p2 - ph / 2, pw, ph);
    
    context.fillStyle = ballColor || 'white';
    context.beginPath();
    context.arc(bX, bY, br, 0, Math.PI * 2);
    context.fill();
    
  }, [ctx]);
  
  const canvasStyle = {
    borderRadius: "20px",
  };

  return <canvas className="gameCanvas" ref={canvasRef} width={CanvasConstants.WIDTH} height={CanvasConstants.HEIGHT} style={canvasStyle} />;
};

export default GameCanvas;
