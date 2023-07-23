import React, { useState, useLayoutEffect } from 'react';
import { resizeImage } from "../tools";
import { Color } from "../types";
import useImage from "./useImage";

import blackImage from "../Sprites/black.png";
import whiteImage from "../Sprites/white.png";
import redImage from "../Sprites/red.png";
import orangeImage from "../Sprites/orange.png";
import yellowImage from "../Sprites/yellow.png";

import lightGreenImage from "../Sprites/lightGreen.png";
import greenImage from "../Sprites/green.png";
import darkGreenImage from "../Sprites/darkGreen.png"

import cyanImage from "../Sprites/cyan.png";
import lightBlueImage from "../Sprites/lightBlue.png";
import blueImage from "../Sprites/blue.png";

import purpleImage from "../Sprites/purple.png";
import magentaImage from "../Sprites/magenta.png";
import pinkImage from "../Sprites/pink.png";



type ColorType = "black"      |
                 "white"      |
                 "red"        |
                 "orange"     |
                 "yellow"     |
                 "light-green"|
                 "green"      |
                 "dark-green" |
                 "cyan"       |
                 "light-blue" |
                 "blue"       |
                 "purple"     |
                 "magenta"    |
                 "pink";

interface paletteImage {
  color: Color;
  name: ColorType;
  sprite: HTMLImageElement;
}

interface useImagesHookInterface {
  paletteImages: paletteImage[];
  setPaletteImage: (key : ColorType, image: HTMLImageElement) => void;
  removeColor: (key : ColorType) => void;
  restorePaletteImages: () => void;
}

function useImages() : useImagesHookInterface {
  const [black, setBlack, loadBlack] = useImage(blackImage);
  const [white, setWhite, loadWhite] = useImage(whiteImage);

  const [red, setRed, loadRed] = useImage(redImage);
  const [orange, setOrange, loadOrange] = useImage(orangeImage);
  const [yellow, setYellow, loadYellow] = useImage(yellowImage);

  const [lightGreen, setLightGreen, loadLightGreen] = useImage(lightGreenImage);
  const [green, setGreen, loadGreen] = useImage(greenImage);
  const [darkGreen, setDarkGreen, loadDarkGreen] = useImage(darkGreenImage);

  const [cyan, setCyan, loadCyan] = useImage(cyanImage);
  const [lightBlue, setLightBlue, loadLightBlue] = useImage(lightBlueImage);
  const [blue, setBlue, loadBlue] = useImage(blueImage);

  const [purple, setPurple, loadPurple] = useImage(purpleImage);
  const [magenta, setMagenta, loadMagenta] = useImage(magentaImage);
  const [pink, setPink, loadPink] = useImage(pinkImage);

  const [disableColorPalette, setDisableColorPalette] = useState<ColorType[]>([]);

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
      case "orange":
          setOrange(resizedImage);
          return;
      case "yellow":
          setYellow(resizedImage);
          return;
      case "light-green":
          setLightGreen(resizedImage);
          return;
      case "green":
          setGreen(resizedImage);
          return;
      case "dark-green":
          setDarkGreen(resizedImage);
          return;
      case "cyan":
          setCyan(resizedImage);
          return;
      case "light-blue":
          setLightBlue(resizedImage);
          return;
      case "blue":
          setBlue(resizedImage);
          return;
      case "purple":
          setPurple(resizedImage);
          return;
      case "magenta":
          setMagenta(resizedImage);
          return;
      case "pink":
          setPink(resizedImage);
          return;
    }
  }

  function removeColor(key : ColorType) {
    if(disableColorPalette.length >= 12 ){
      return;
    }
    setDisableColorPalette([...disableColorPalette, key]);
  }

  function restorePaletteImages() {
    loadBlack(blackImage);
    loadWhite(whiteImage);

    loadRed(redImage);
    loadOrange(orangeImage);
    loadYellow(yellowImage);

    loadCyan(cyanImage);
    loadLightBlue(lightBlueImage);
    loadBlue(blueImage);

    loadPurple(purpleImage);
    loadMagenta(magentaImage);
    loadPink(pinkImage);

    setDisableColorPalette([]);
  }

  function computePaletteImages() : paletteImage[] {
    const defaultPaletteImage : paletteImage[] = [
      { name: "black", color: { red: 0, green: 0, blue: 0 }, sprite: black },
      { name: "white", color: { red: 255, green: 255, blue: 255 }, sprite: white },

      { name: "red",   color: { red: 255, green: 0, blue: 0 }, sprite: red },
      { name: "orange", color: { red: 255, green: 128, blue: 0}, sprite: orange },
      { name: "yellow", color: { red: 255, green: 255, blue: 0}, sprite: yellow },

      { name: "light-green", color: { red: 128, green: 255, blue: 0}, sprite: lightGreen },
      { name: "green", color: { red: 0, green: 255, blue: 0}, sprite: green },
      { name: "dark-green", color: { red: 0, green: 255, blue: 80}, sprite: darkGreen },

      { name: "cyan",  color: { red: 0, green: 255, blue: 255 }, sprite: cyan },
      { name: "light-blue",  color: { red: 0, green: 128, blue: 255 }, sprite: lightBlue },
      { name: "blue",  color: { red: 0, green: 0, blue: 255 }, sprite: blue },

      { name: "purple",  color: { red: 128, green: 0, blue: 255 }, sprite: purple },
      { name: "magenta",  color: { red: 255, green: 0, blue: 255 }, sprite: magenta },
      { name: "pink",  color: { red: 255, green: 0, blue: 128 }, sprite: pink }
    ];

    return defaultPaletteImage.filter(paletteImage => !disableColorPalette.includes(paletteImage.name));
  }



  return {
    paletteImages: computePaletteImages(),
    setPaletteImage: setImage,
    removeColor,
    restorePaletteImages
  };
}

export default useImages;