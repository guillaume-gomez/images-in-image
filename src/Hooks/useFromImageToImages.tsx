import { useState } from 'react';
import { minBy } from "lodash";
import { pgcd, getContext, colorDistance, resizeImageCanvas } from "../tools";
import { Color } from "../types";

export const dominantImageSizeDefault = 32;

interface pictureData {
  color: Color;
  sprite: HTMLImageElement | undefined;
}

interface FromImageToImagesInterface {
  picturesData: pictureData[];
  dominantImageSize?: number;
}

export interface ImageDataInterface {
  image: HTMLImageElement;
  x: number;
  y: number;
}


//TODO
// interdire les images qui ont une composante plus petite que le dominantImageSize
export default function useFromImageToImages({ picturesData, dominantImageSize = dominantImageSizeDefault } : FromImageToImagesInterface) {
  const [imagesData, setImagesData] = useState<ImageDataInterface[]>([]);

  function createCanvasBuffer(image: HTMLImageElement) : HTMLCanvasElement {
    const canvasBuffer = document.createElement("canvas");
    canvasBuffer.width = image.width;
    canvasBuffer.height = image.height;

    const context = getContext(canvasBuffer);
    context.drawImage(image, 0, 0, canvasBuffer.width, canvasBuffer.height);
    return canvasBuffer;
  }

  function generateImage(image: HTMLImageElement, canvasTarget: HTMLCanvasElement) {
      canvasTarget.width = image.width * dominantImageSize;
      canvasTarget.height = image.height * dominantImageSize;

      const canvasBuffer = createCanvasBuffer(image);
      const contextBuffer = getContext(canvasBuffer);
      const contextTarget = getContext(canvasTarget);

      console.log("(", canvasTarget.width, ", ", canvasTarget.height, ")");

      for(let y = 0; y < image.height; ++y) {
        for(let x = 0; x < image.width; ++x) {
          const pixelImage = fromColorToDominantImage(fromPixelToColor(contextBuffer, x,y));
          contextTarget.drawImage(pixelImage, x * dominantImageSize, y * dominantImageSize, pixelImage.width, pixelImage.height);
        }
      }
  }

  function optimizedGenerateImage(image: HTMLImageElement, canvasTarget: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) {
      canvasTarget.width = expectedWidth;
      canvasTarget.height = expectedHeight;

      console.log("(", expectedWidth, ", ", expectedHeight, ")");

      const canvasBuffer = createCanvasBuffer(image);

      const contextBuffer = getContext(canvasBuffer);
      const contextTarget = getContext(canvasTarget);
      resizeImageCanvas(canvasBuffer, canvasBuffer, expectedWidth, expectedHeight);

      for(let y = 0; y < canvasBuffer.height; y += dominantImageSize) {
        for(let x = 0; x < canvasBuffer.width; x += dominantImageSize) {
          const pixelImage = fromColorToDominantImage(interpolateArea(contextBuffer, dominantImageSize, x,y));
          contextTarget.drawImage(pixelImage, x, y, pixelImage.width, pixelImage.height);
        }
      }
    }


  function fromPixelToColor(context: CanvasRenderingContext2D, x: number, y: number) : Color {
    const pixel = context.getImageData(x, y, 1, 1);
    const { data } = pixel;
    return { red: data[0], green: data[1], blue: data[2] };
  }

  function interpolateArea(context: CanvasRenderingContext2D, dominantImageSize: number, x: number, y: number) : Color {
    const pixels = context.getImageData(x,y, dominantImageSize, dominantImageSize);
    const { data } = pixels;
    const numberOfPixels = dominantImageSize * dominantImageSize;
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


  function fromColorToDominantImage(color: Color) : HTMLImageElement {
    const comparaisonValues = picturesData.map(pictureData => ({ ...pictureData, value: colorDistance(color, pictureData.color)}) );
    const foundPixel = minBy(comparaisonValues, 'value');
    if(!foundPixel) {
      throw `No sprite found for the pixel with the value ${color}`;
    }
    if(!foundPixel.sprite) {
      throw new Error("Cannot find the sprite");
    }
    return foundPixel.sprite;
  }


  return { generateImage, optimizedGenerateImage };
}
