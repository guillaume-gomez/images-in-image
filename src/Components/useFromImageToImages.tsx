import React from 'react';
import { minBy } from "lodash";

const imageSizeDefault = 32;
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

interface pictureData {
  value: number;
  sprite: HTMLImageElement | undefined;
}

interface fromImageToImagesInterface {
  picturesData: pictureData[];
  imageSize?: number;

}

export default function useFromImageToImages({ picturesData, imageSize = imageSizeDefault } : fromImageToImagesInterface) {

  console.log(picturesData)

  function generateImage(image: HTMLImageElement, canvasTarget: HTMLCanvasElement) {
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
      const expectedWidth = image.width * imageSize;
      const expectedHeight = image.height * imageSize;
      canvasTarget.width = expectedWidth;
      canvasTarget.height = expectedHeight;

      //convertToGrayScale(context, expectedWidth, expectedHeight);

      const imageCenter = imageSize / 2;
      for(let y = 0; y < canvasBuffer.height; ++y) {
        for(let x = 0; x < canvasBuffer.width; ++x) {
          const image = fromPixelColorToImage(getPixel(context, x,y));
          canvasTargetContext.drawImage(image, x * imageSize, y * imageSize, image.width, image.height);
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

  return { generateImage, resizeImage };
}