import React, { useState, useLayoutEffect } from 'react';


function useImage(base64Image: string) : [HTMLImageElement, (image: HTMLImageElement) => void] {
  const [image, setImage] = useState<HTMLImageElement>(new Image());

  useLayoutEffect(
     () => {
      const img = new Image();

      function onload() {
        setImage(img);
        console.log("loaded " + base64Image)
      }

      function onerror() {
        console.log("error " + base64Image)
      }
      img.src = base64Image;

      img.addEventListener('load', onload);
      img.addEventListener('error', onerror);
      

      return function cleanup() {
        img.removeEventListener('load', onload);
        img.removeEventListener('error', onerror);
      };
    },
    []
  );
  return [image, setImage];
}

export default useImage;
