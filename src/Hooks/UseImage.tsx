import React, { useState, useLayoutEffect } from 'react';

//process.env.PUBLIC_URL + "logo512.png"

function UseImage(url: string) {
  const [image, setImage] = useState<HTMLImageElement>();

  useLayoutEffect(
     () => {
      const img = new Image();

      function onload() {
        setImage(img);
        console.log("loaded " + url)
      }

      function onerror() {
        console.log("error " + url)
      }
      img.src = url;

      img.addEventListener('load', onload);
      img.addEventListener('error', onerror);
      

      return function cleanup() {
        img.removeEventListener('load', onload);
        img.removeEventListener('error', onerror);
      };
    },
    []
  );
  return image;
}

export default UseImage;
