import React, { useRef } from 'react';
import logo from './logo.svg';
import image from "./image.png";
import './App.css';

  // prendre une image
  // la rescale pour que ca marche avec le "pixel image"
  // et ensuite faire une detection moyenné de l'image
  // remplacer ce pixel moyenne par l'image associé correspondant à la couleur

const imageSize = 8;


function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRefBuffer = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  function resizeImage() {
    if(imageRef.current && canvasRef.current && canvasRefBuffer.current) {
      canvasRef.current.style.background = "#FF00FF";

      // resize image
      const contextBuffer = canvasRefBuffer.current.getContext("2d");
      if(!contextBuffer) {
        console.log("erreur context buffer");
        return;
      }

      // resize to 50%
      canvasRefBuffer.current.width = imageRef.current.width * 0.5;
      canvasRefBuffer.current.height = imageRef.current.height * 0.5;
      contextBuffer.drawImage(imageRef.current, 0, 0, canvasRefBuffer.current.width, canvasRefBuffer.current.height);

      contextBuffer.drawImage(canvasRefBuffer.current, 0, 0, canvasRefBuffer.current.width * 0.5, canvasRefBuffer.current.height * 0.5);

      const context = canvasRef.current.getContext("2d");
      if(!context) {
        console.log("erreur context");
        return;
      }

      const expectedWidth = imageRef.current.width * imageSize;
      const expectedHeight = imageRef.current.height * imageSize;
      canvasRef.current.width = expectedWidth;
      canvasRef.current.height = expectedHeight;

      context.drawImage(
        canvasRefBuffer.current,
        0,
        0,
        canvasRefBuffer.current.width * 0.5,
        canvasRefBuffer.current.height * 0.5,
        0,
        0,
        expectedWidth,
        expectedHeight
      );

      convertToGrayScale(context, expectedWidth, expectedHeight);

      for(let x=0; x < expectedWidth; x+= imageSize) {
        for(let y=0; y < expectedHeight; y+= imageSize) {
          //const image = fromPixelColorToImage(getAveragePixel(context, x,y));
         //contextBuffer.drawImage(image, x, y, image.width, image.height);
          console.log(getAveragePixel(context, x,y));
        }
      }
    }
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

  function getAveragePixel(context: CanvasRenderingContext2D, x: number, y: number) : number {
    let sumValue = 0;
    const imageSizeMiddle = imageSize / 2;
    const imageData = context.getImageData(x - imageSizeMiddle , y - imageSizeMiddle, imageSize, imageSize);
    for (let i = 0; i < imageData.data.length; i += 4) {
      sumValue += imageData.data[i];
       // in grey not need for now
       //imageData.data[i] = gray;
       //imageData.data[i + 1] = gray;
       //imageData.data[i + 2] = gray;
       //imageData.data[i + 3] = 255;
    }
    const nbPixels = imageData.data.length / 4;
    return sumValue / nbPixels;
  }

  function fromPixelColorToImage(greyPixelValue: number) : string {
    return greyPixelValue > 127 ? "black.png" : "white.png"
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <img src={image} ref={imageRef} />
        <canvas ref={canvasRef} />
        <canvas ref={canvasRefBuffer} />

        <a
          className="App-link"
          onClick={resizeImage}
        >
          Ahhhh Click
        </a>
      </header>
    </div>
  );
}

export default App;
