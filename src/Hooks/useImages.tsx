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
    // TODO RESIZE IMAGE BEFORE SAVING
    switch(key) {
      default:
      case "white":
          setWhite(image);
          return;
      case "black":
          setBlack(image);
          return;
      case "red":
          setRed(image);
          return;
      case "green":
          setGreen(image);
          return;
      case "blue":
          setBlue(image);
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
