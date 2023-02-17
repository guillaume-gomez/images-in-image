import React, { useRef, useEffect, useState, RefObject } from 'react';
import { minBy } from "lodash";
import { format as formatFns } from "date-fns";
import useImage from "./Components/UseImage";
import useFromImageToImages from "./Components/useFromImageToImages";
import image from "./image.png";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

import './App.css';


function App() {
  const [ratio, setRatio] = useState<number>(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
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
      resizeImage(canvasFinal.current, canvasRef.current, imageRef.current.width, imageRef.current.height);
    }
  }

  function resizeFinalImage(newRatio: number) {
    if(canvasFinal.current && imageRef.current) {
      const width = imageRef.current.width * ratio;
      const height = imageRef.current.height * ratio;
      canvasFinal.current.width = width;
      canvasFinal.current.height = height;

      generateImage(imageRef.current, canvasFinal.current);
      resizeImage(canvasFinal.current, canvasFinal.current, width, height);

      setRatio(newRatio);
      
      console.log("je passe la")
    }
    //setWidth(width);
    //setHeight(height);
  }

  function saveImage() {
    if(canvasFinal.current && anchorRef.current) {
      const format = "jpeg";
      const dataURL = canvasFinal.current.toDataURL(`image/${format}`);
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (anchorRef.current as any).download = `${dateString}-image-in-images.${format}`;
      anchorRef.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }
  }

  return (
    <div className="flex flex-col gap-8 items-center">
       <Header />
       <h1 className="text-3xl font-bold underline text-primary">
        Hello Michel!
       </h1>
        <img src={image} ref={imageRef} />
        <canvas ref={canvasRef} />
        <p>{ratio}</p>
        <input min={1} max={32} type="range" className="range range-primary" value={ratio} onChange={(e) =>  resizeFinalImage(parseInt(e.target.value)) }/>
        <a
          className="App-link"
          onClick={onClick}
        >
          Click pour generer l'image wesh !
        </a>
        <canvas ref={canvasFinal} style={{ background: "red"}}/>
         <a ref={anchorRef} className="btn btn-primary" onClick={ () => saveImage()}>Save</a>
        <Footer />
    </div>
  );
}

export default App;
