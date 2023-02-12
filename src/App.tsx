import React, { useRef, useEffect, useState } from 'react';
import { minBy } from "lodash";
import useImage from "./Components/UseImage";
import useFromImageToImages from "./Components/useFromImageToImages";
import image from "./image.png";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

import './App.css';


function App() {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const black = useImage(process.env.PUBLIC_URL + "sprites/test/black.png");
  const white = useImage(process.env.PUBLIC_URL + "sprites/test/white.png");
  const red = useImage(process.env.PUBLIC_URL + "sprites/test/red.png");
  const green = useImage(process.env.PUBLIC_URL + "sprites/test/green.png");
  const blue = useImage(process.env.PUBLIC_URL + "sprites/test/blue.png");

  useEffect(() => {
    if(imageRef.current) {
      setWidth(imageRef.current.width * 32);
      setHeight(imageRef.current.height * 32);
    }
  }, [imageRef])

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
    <div className="flex flex-col gap-8 items-center">
       <Header />
       <h1 className="text-3xl font-bold underline text-primary">
      Hello Alice!
    </h1>
        <img src={image} ref={imageRef} />
        <canvas ref={canvasRef} />
        <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value)) }/>
        <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value)) }/>
        <canvas ref={canvasFinal} width={width} height={height}/>
        <a
          className="App-link"
          onClick={onClick}
        >
          Ahhhh Click
        </a>
        <Footer />
    </div>
  );
}

export default App;
