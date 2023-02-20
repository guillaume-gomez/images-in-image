import React, { useState } from 'react';
import { minBy } from "lodash";

const pixelSizeDefault = 32;
////////////////////
//red = 255 * 100
//green = 255 * 10
//blue = 255;
////////////////////
/*const picturesData = [
  {value: 0, sprite: "black"},
  {value: 255, sprite: "blue"},
  {value: 2550, sprite: "green"},
  {value: 25500, sprite: "red"},
  {value: 28305, sprite: "white"},
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
      if (b == 0) {
        return a;
      }
      a %= b;
      if (a == 0) {
        return b;
      }
      b %= a;
    }
}

interface pictureData {
  value: number;
  sprite: HTMLImageElement | undefined;
}

interface fromImageToImagesInterface {
  picturesData: pictureData[];
  pixelSize?: number;

}




//TODO
// interdire les images qui ont une composante plus petite que le pixelSize


export default function useFromImageToImages({ picturesData, pixelSize = pixelSizeDefault } : fromImageToImagesInterface) {

  function init(image: HTMLImageElement, canvasTarget: HTMLCanvasElement, pixelSize: number) : [CanvasRenderingContext2D, CanvasRenderingContext2D] {
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
    const expectedWidth = image.width * pixelSize;
    const expectedHeight = image.height * pixelSize;
    canvasTarget.width = expectedWidth;
    canvasTarget.height = expectedHeight;

    return [canvasTargetContext, context];
  }


  function generateImage(image: HTMLImageElement, canvasTarget: HTMLCanvasElement) {
      const [canvasTargetContext, context] = init(image, canvasTarget, pixelSize);

      //convertToGrayScale(context, expectedWidth, expectedHeight);

      for(let y = 0; y < image.height; ++y) {
        for(let x = 0; x < image.width; ++x) {
          const image = fromPixelColorToImage(getPixel(context, x,y));
          canvasTargetContext.drawImage(image, x * pixelSize, y * pixelSize, image.width, image.height);
        }
      }

      //resizeImage(canvasTarget, canvasBuffer, image.width, image.height)
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


  function getPixel(context: CanvasRenderingContext2D, x: number, y: number) : number {
    const pixel = context.getImageData(x, y, 1, 1);
    const { data } = pixel;
    // note : what about adding transparency in that computation
    return (data[0] * 100) + (data[1] * 10) + data[0];
  }

  function fromPixelColorToImage(pixelValue: number) : HTMLImageElement {
    const comparaisonValues = picturesData.map(pixelType => ({ ...pixelType, value: Math.abs(pixelValue - pixelType.value)}) );
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
    // resize l'image pour etre sur que la taille de l'image fit les images
    // soit x = width de l'image
    // soit y = height de l'image
    // soit c = la taille du sprite (spriteSize)

    // il faut trouver le pgcd de x et y qui donne d
    // faire (x/d)*c = xx ET (y/d)*c = yy
    // faire ceil(xx) = xxx ou ceil(yy) = yyy ==> meme resultat

    //image de taille finale est
    // x2 = xxx * xx
    // y2 = yyy * yy
    const pgcdBetweenWidthAndHeight = pgcd(imageWidth, imageHeight);
    console.log(pgcdBetweenWidthAndHeight)
    const ratioX = (imageWidth * pixelSize)/pgcdBetweenWidthAndHeight;
    const ratioY = (imageHeight* pixelSize)/pgcdBetweenWidthAndHeight;
    console.log("ratioX ->", ratioX)
    console.log("ratioY ->", ratioY)

    const newRatioImage = Math.ceil(ratioX);

    console.log("newRatioImage => ", newRatioImage)

    const expectedWidth =  newRatioImage * ratioX;
    const expectedHeight = newRatioImage * ratioY;

    return [expectedWidth, expectedHeight];
  }

  function optimizedResize(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, width: number, height: number) {
    const [expectedWidth, expectedHeight] = optimizedScale(width, height, pixelSize);
    console.log("optimizedResize ", expectedWidth, expectedHeight);
    //resizeImage(originCanvas, targetCanvas, expectedWidth, expectedHeight);
  }

  function interpolateArea(context: CanvasRenderingContext2D, pixelSize: number, x: number, y: number) : number {
    const pixels = context.getImageData(x,y, pixelSize, pixelSize);
    const { data } = pixels;
    let red = 0;
    let green = 0;
    let blue = 0;

    for (let i = 0; i < data.length; i += 4) {
      red += data[i];
      green += data[i + 1];
      blue += data[i + 2];
    }

    return ((red/data.length) * 100) + ((green/data.length) * 10) + (blue/data.length);
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

  return { generateImage, resizeImage, optimizedResize };
}
