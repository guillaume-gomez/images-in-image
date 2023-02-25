import { Color } from "./types";

export function pgcd(a: number, b: number) : number {
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


export function getContext(canvas:  HTMLCanvasElement) : CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if(!context) {
      throw new Error("cannot find the context 2d for the canvas");
  }
  return context;
}

export function colorDistance(color1: Color, color2: Color) : number {
  const redDiff = (color2.red - color1.red);
  const greenDiff = (color2.green - color1.green);
  const blueDiff = (color2.blue - color1.blue);
  return (redDiff * redDiff) + (greenDiff * greenDiff) + (blueDiff * blueDiff);
}


export function resizeImage(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) {
  // resize image
  const canvasBuffer = document.createElement("canvas");
  const contextBuffer = getContext(canvasBuffer);

  // resize to 50%
  canvasBuffer.width = originCanvas.width * 0.5;
  canvasBuffer.height = originCanvas.height * 0.5;
  contextBuffer.drawImage(originCanvas, 0, 0, canvasBuffer.width, canvasBuffer.height);

  contextBuffer.drawImage(canvasBuffer, 0, 0, canvasBuffer.width * 0.5, canvasBuffer.height * 0.5);

  const context = targetCanvas.getContext("2d");
  if(!context) {
    throw new Error("Error: context not found");
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