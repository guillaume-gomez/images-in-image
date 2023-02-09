import React, { useRef, useEffect, useState } from 'react';
import { minBy } from "lodash";
import logo from './logo.svg';
import useImage from "./Components/UseImage";
import useFromImageToImages from "./Components/useFromImageToImages";
import image from "./image.png";

import './App.css';


function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const black = useImage(process.env.PUBLIC_URL + "sprites/test/black.png");
  const white = useImage(process.env.PUBLIC_URL + "sprites/test/white.png");
  const red = useImage(process.env.PUBLIC_URL + "sprites/test/red.png");
  const green = useImage(process.env.PUBLIC_URL + "sprites/test/green.png");
  const blue = useImage(process.env.PUBLIC_URL + "sprites/test/blue.png");

  const picturesData = [
    {value: 0, sprite: black},
    {value: 255, sprite: blue},
    {value: 2550, sprite: green},
    {value: 25500, sprite: red},
    {value: 28305, sprite: white},
  ]

  const { generateImage, resizeImage} = useFromImageToImages({picturesData, imageSize: 32});

  function onClick() {
    if(imageRef.current && canvasFinal.current && canvasRef.current) {
      generateImage(imageRef.current, canvasFinal.current);
      resizeImage(canvasFinal.current, canvasRef.current, imageRef.current.width, imageRef.current.height)
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={image} ref={imageRef} />
        <h2>Guigui</h2>
        <canvas ref={canvasRef} />
        <h2>Gaga</h2>
        <canvas ref={canvasFinal} />
        <a
          className="App-link"
          onClick={onClick}
        >
          Ahhhh Click
        </a>
      </header>
    </div>
  );
}

export default App;
