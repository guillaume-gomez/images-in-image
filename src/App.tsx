import React, { useRef, useEffect } from 'react';
import { minBy } from "lodash";
import logo from './logo.svg';
import useImage from "./Components/UseImage";
import image from "./image.png";

import './App.css';

const imageSize = 8;
////////////////////
//red = 255 * 100
//green = 255 * 10
//blue = 255;
////////////////////
const picturesData = [
  {value: 0, sprite: "black"},
  {value: 255, sprite: "blue"},
  {value: 2550, sprite: "green"},
  {value: 25500, sprite: "red"},
  {value: 28305, sprite: "white"},
]

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const black = useImage(process.env.PUBLIC_URL + "sprites/black.png");
  const white = useImage(process.env.PUBLIC_URL + "sprites/white.png");
  const red = useImage(process.env.PUBLIC_URL + "sprites/red.png");
  const green = useImage(process.env.PUBLIC_URL + "sprites/green.png");
  const blue = useImage(process.env.PUBLIC_URL + "sprites/blue.png");

  function generateImage() {
    if(imageRef.current && canvasRef.current && canvasFinal.current) {
      
      canvasRef.current.style.background = "#FF00FF";
      canvasRef.current.width = imageRef.current.width;
      canvasRef.current.height = imageRef.current.height;

      const context = canvasRef.current.getContext("2d");
      if(!context) {
        console.log("erreur context");
        return;
      }

      context.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      const canvasFinal2d = canvasFinal.current.getContext("2d");
      if(!canvasFinal2d) {
        console.log("erreur context buffer");
        return;
      }
      const expectedWidth = imageRef.current.width * imageSize;
      const expectedHeight = imageRef.current.height * imageSize;
      canvasFinal.current.width = expectedWidth;
      canvasFinal.current.height = expectedHeight;

      convertToGrayScale(context, expectedWidth, expectedHeight);

      const imageCenter = imageSize / 2;
      for(let y = 0; y < canvasRef.current.height; ++y) {
        for(let x = 0; x < canvasRef.current.width; ++x) {
          const image = fromPixelColorToImage(getPixel(context, x,y));
          canvasFinal2d.drawImage(image, x * imageSize, y * imageSize, image.width, image.height);
        }
      }

      resizeImage(canvasFinal.current, canvasRef.current, imageRef.current.width, imageRef.current.height)
    }
  }

  function resizeImage(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) {
    // resize image
    const canvasBuffer = document.createElement("canvas");
    const contextBuffer = canvasBuffer.getContext("2d");
    if(!contextBuffer) {
      console.log("erreur context buffer");
      return;
    }

      // resize to 50%
      canvasBuffer.width = originCanvas.width * 0.5;
      canvasBuffer.height = originCanvas.height * 0.5;
      contextBuffer.drawImage(originCanvas, 0, 0, canvasBuffer.width, canvasBuffer.height);

      contextBuffer.drawImage(canvasBuffer, 0, 0, canvasBuffer.width * 0.5, canvasBuffer.height * 0.5);

      const context = targetCanvas.getContext("2d");
      if(!context) {
        console.log("erreur context");
        return;
      }

      targetCanvas.width = expectedWidth;
      targetCanvas.height = expectedHeight;

      context.drawImage(
        canvasBuffer,
        0,
        0,
        canvasBuffer.width * 0.5,
        canvasBuffer.height * 0.5,
        0,
        0,
        expectedWidth,
        expectedHeight
      );
  }

  function convertToGrayScale(context: CanvasRenderingContext2D, width: number, height: number) {
    const imageData = context.getImageData(0, 0, width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
     const red = imageData.data[i];
     const green = imageData.data[i + 1];
     const blue = imageData.data[i + 2];
     // use gimp algorithm to generate prosper grayscale
     const gray = (red * 0.3 + green * 0.59 + blue * 0.11);

     imageData.data[i] = gray;
     imageData.data[i + 1] = gray;
     imageData.data[i + 2] = gray;
     imageData.data[i + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
  }

  function getPixel(context: CanvasRenderingContext2D, x: number, y: number) : number {
    const pixel = context.getImageData(x, y, 1, 1);
    const { data } = pixel;
    // only grey for now. So three components (R,G,B) have the same value
    return (data[0] * 100) + (data[1] * 10) + data[0];
  }

  function fromPixelColorToImage(pixelValue: number) : HTMLImageElement {

    if(!black || !white || !red || !green || !blue) {
      throw "error loaded stuff";
    }
    const comparaisonValues = picturesRange.map(value => ({ [value]: Math.abs(pixelValue - value) }) );
    // find the smallest value to get the key
    return pixelValue < 127 ? black : white;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <img src={image} ref={imageRef} />
        <h2>Guigui</h2>
        <canvas ref={canvasRef} />
        <h2>Gaga</h2>
        <canvas ref={canvasFinal} />
        <a
          className="App-link"
          onClick={generateImage}
        >
          Ahhhh Click
        </a>
      </header>
    </div>
  );
}

export default App;
