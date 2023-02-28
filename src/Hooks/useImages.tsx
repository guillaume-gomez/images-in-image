import React, { useState, useLayoutEffect } from 'react';
import { resizeImage } from "../tools";
import useImage from "./useImage";

import blackImage from "../Sprites/black.png";
import whiteImage from "../Sprites/white.png";
import redImage from "../Sprites/red.png";
import greenImage from "../Sprites/green.png";
import blueImage from "../Sprites/blue.png";

type ColorType = "black" | "white" | "red" | "green" | "blue";

interface paletteImage {
  name: ColorType;
  sprite: HTMLImageElement;
}

interface useImagesHookInterface {
  paletteImages: paletteImage[];
  setPaletteImage: (key : ColorType, image: HTMLImageElement) => void;
}

function useImages() : useImagesHookInterface {
  const [black, setBlack] = useImage(blackImage);
  const [white, setWhite] = useImage(whiteImage);
  const [red, setRed] = useImage(redImage);
  const [green, setGreen] = useImage(greenImage);
  const [blue, setBlue] = useImage(blueImage);

  function setImage(key : ColorType, image: HTMLImageElement) {
    // get the 32 from useFromImageToImages
    // TODO RESIZE IMAGE BEFORE SAVING
    const resizedImage = resizeImage(image, 32, 32)
    switch(key) {
      default:
      case "white":
          setWhite(resizedImage);
          return;
      case "black":
          setBlack(resizedImage);
          return;
      case "red":
          setRed(resizedImage);
          return;
      case "green":
          setGreen(resizedImage);
          return;
      case "blue":
          setBlue(resizedImage);
          return;
    }
  }



  return {
    paletteImages: [
      {name: "black", sprite: black },
      {name: "white", sprite: white },
      {name: "red", sprite: red },
      {name: "green", sprite: green },
      {name: "blue", sprite: blue }
    ],
    setPaletteImage: setImage
  };
}

export default useImages;
