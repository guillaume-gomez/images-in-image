import React, { useRef, useLayoutEffect } from 'react';

//process.env.PUBLIC_URL + "logo512.png"

function UseImage(url: string) {
  const imageRef = useRef<HTMLImageElement>();
  useLayoutEffect(
     () => {
      const img = document.createElement('img');

      function onload() {
        imageRef.current = img;
        console.log("loaded " + url)
      }

      function onerror() {
        imageRef.current = undefined;
        console.log("error " + url)
      }

      img.addEventListener('load', onload);
      img.addEventListener('error', onerror);
      
      img.src = url;

      return function cleanup() {
        img.removeEventListener('load', onload);
        img.removeEventListener('error', onerror);
      };
    },
    [url]
  );
  console.log("hhh " + imageRef.current)
  return imageRef.current;
}

export default UseImage;
