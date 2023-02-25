import React, { useState } from 'react';
import { minBy } from "lodash";

const pixelSizeDefault = 32;
/*const picturesData = [
  { pixel: { red: 0, green: 0, blue: 0 } sprite: "black"},
  { pixel: { red: 0, green: 0, blue: 255 }, sprite: "blue"},
  { pixel: { red: 0, green: 255, blue: 0 }, sprite: "green"},
  { pixel: { red: 255, green: 0, blue: 0 }, sprite: "red"},
  { pixel: { red: 255, green: 255, blue: 255 }, sprite: "white"},
];
*/

function pgcd(a: number, b: number) : number {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) {
       let tmp = a;
       a = b;
       b = tmp;
    }

    while (true) {
      if (b === 0) {
        return a;
      }
      a %= b;
      if (a === 0) {
        return b;
      }
      b %= a;
    }
}

interface Color {
  red: number;
  green: number;
  blue: number;
}

interface pictureData {
  pixel: Color;
  sprite: HTMLImageElement | undefined;
}

interface fromImageToImagesInterface {
  picturesData: pictureData[];
  pixelSize?: number;
}


interface ImageDataInterface {
  image: HTMLImageElement;
  x: number;
  y: number;
}


//TODO
// interdire les images qui ont une composante plus petite que le pixelSize
export default function useFromImageToImages({ picturesData, pixelSize = pixelSizeDefault } : fromImageToImagesInterface) {
  const [imagesData, setImagesData] = useState<ImageDataInterface[]>([]);

  function init(image: HTMLImageElement, canvasTarget: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) : [CanvasRenderingContext2D, CanvasRenderingContext2D, HTMLCanvasElement] {
    const canvasBuffer = document.createElement("canvas");
    canvasBuffer.width = image.width;
    canvasBuffer.height = image.height;

    const context = canvasBuffer.getContext("2d");
    if(!context) {
      throw new Error("cannot find the context");
    }

    context.drawImage(image, 0, 0, canvasBuffer.width, canvasBuffer.height);

    const canvasTargetContext = canvasTarget.getContext("2d");
    if(!canvasTargetContext) {
      throw new Error("cannot find the context");
    }
    canvasTarget.width = expectedWidth;
    canvasTarget.height = expectedHeight;

    return [canvasTargetContext, context, canvasBuffer];
  }


  function generateImage(image: HTMLImageElement, canvasTarget: HTMLCanvasElement) {
      const [canvasTargetContext, context] = init(image, canvasTarget, image.width * pixelSize, image.height * pixelSize);
      let imagesData = [];
      for(let y = 0; y < image.height; ++y) {
        for(let x = 0; x < image.width; ++x) {
          const pixelImage = fromPixelColorToImage(getPixel(context, x,y));
          canvasTargetContext.drawImage(pixelImage, x * pixelSize, y * pixelSize, pixelImage.width, pixelImage.height);
          imagesData.push({image, x, y });
        }
      }
      setImagesData(imagesData);
  }

  function optimizedGenerateImage(image: HTMLImageElement, canvasTarget: HTMLCanvasElement,  canvasRef: HTMLCanvasElement) {
      const [expectedWidth, expectedHeight] = optimizedScale(image.width, image.height, pixelSize);
      const [canvasTargetContext, contextBuffer, canvasBuffer] = init(image, canvasTarget, expectedWidth, expectedHeight);

      resizeImage(canvasBuffer, canvasBuffer, expectedWidth, expectedHeight);
      console.log(canvasBuffer.width);
      console.log(canvasBuffer.height);

      //debug TO BE DELETED
      const tempBuffer = canvasRef.getContext("2d");
      canvasRef.width = expectedWidth;
      canvasRef.height = expectedHeight;
      if(tempBuffer) {
        tempBuffer.drawImage(canvasBuffer, 0, 0, canvasBuffer.width, canvasBuffer.height);

      }
      // end debug


      let imagesData = [];
      for(let y = 0; y < canvasBuffer.height; y += pixelSize) {
        for(let x = 0; x < canvasBuffer.width; x += pixelSize) {
          const pixelImage = fromPixelColorToImage(interpolateArea(contextBuffer, pixelSize, x,y));
          canvasTargetContext.drawImage(pixelImage, x, y, pixelImage.width, pixelImage.height);
          imagesData.push({image, x, y });
        }
      }
      setImagesData(imagesData);
    }

  function render(canvasTargetContext: CanvasRenderingContext2D) {
    imagesData.map(({image, x, y}) => {
      canvasTargetContext.drawImage(image, x * pixelSize, y * pixelSize, image.width, image.height)
    });
  }

  function resizeImage(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) {
    // resize image
    const canvasBuffer = document.createElement("canvas");
    const contextBuffer = canvasBuffer.getContext("2d");
    if(!contextBuffer) {
      throw "Error : context buffer not found";
      return;
    }

    // resize to 50%
    canvasBuffer.width = originCanvas.width * 0.5;
    canvasBuffer.height = originCanvas.height * 0.5;
    contextBuffer.drawImage(originCanvas, 0, 0, canvasBuffer.width, canvasBuffer.height);

    contextBuffer.drawImage(canvasBuffer, 0, 0, canvasBuffer.width * 0.5, canvasBuffer.height * 0.5);

    const context = targetCanvas.getContext("2d");
    if(!context) {
      throw "Error: context not found";
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


  function getPixel(context: CanvasRenderingContext2D, x: number, y: number) : Color {
    const pixel = context.getImageData(x, y, 1, 1);
    const { data } = pixel;
    return { red: data[0], green: data[1], blue: data[2] };
  }

  function interpolateArea(context: CanvasRenderingContext2D, pixelSize: number, x: number, y: number) : Color {
    const pixels = context.getImageData(x,y, pixelSize, pixelSize);
    const { data } = pixels;
    const numberOfPixels = pixelSize * pixelSize;
    let red = 0;
    let green = 0;
    let blue = 0;


    for (let i = 0; i < data.length; i += 4) {
      red += data[i];
      green += data[i + 1];
      blue += data[i + 2];
    }

    return { red: (red/numberOfPixels), green: (green/numberOfPixels), blue: (blue/numberOfPixels) };
  }

  function colorDistance(pixel1: Color, pixel2: Color) : number {
    const redDiff = (pixel2.red - pixel1.red);
    const greenDiff = (pixel2.green - pixel1.green);
    const blueDiff = (pixel2.blue - pixel1.blue);
    return (redDiff * redDiff) + (greenDiff * greenDiff) + (blueDiff * blueDiff);
  }


  function fromPixelColorToImage(pixelValue: Color) : HTMLImageElement {
    const comparaisonValues = picturesData.map(pixelType => ({ ...pixelType, value: colorDistance(pixelValue, pixelType.pixel)}) );
    const foundPixel = minBy(comparaisonValues, 'value');
    if(!foundPixel) {
      throw `No sprite found for the pixel with the value ${pixelValue}`;
    }
    if(!foundPixel.sprite) {
      throw new Error("Cannot find the sprite");
    }
    return foundPixel.sprite;
  }

  function optimizedScale(imageWidth: number, imageHeight: number, pixelSize: number) : [number, number] {
    const pgcdBetweenWidthAndHeight = pgcd(imageWidth, imageHeight);
    const minWidth = imageWidth/pgcdBetweenWidthAndHeight;
    const minHeight = imageHeight/pgcdBetweenWidthAndHeight;

    const minWidthPixelSize = minWidth * pixelSize;
    const minHeightPixelSize = minHeight * pixelSize;
    
    // this ratio is the same on the width and height
    const newRatioImage = Math.ceil(imageWidth/minWidthPixelSize);

    const expectedWidth =  minWidthPixelSize * newRatioImage;
    const expectedHeight = minHeightPixelSize * newRatioImage;

    return [expectedWidth, expectedHeight];
  }

  function optimizedResize(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, width: number, height: number) {
    const [expectedWidth, expectedHeight] = optimizedScale(width, height, pixelSize);
    resizeImage(originCanvas, targetCanvas, expectedWidth, expectedHeight);
  }

  /*
    Not used for now
  */
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

  return { generateImage, optimizedGenerateImage, resizeImage, optimizedResize, render };
}
