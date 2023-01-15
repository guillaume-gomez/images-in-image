import React, { useRef, useLayoutEffect } from 'react';

//process.env.PUBLIC_URL + "logo512.png"

function UseImage(url: string) {
  const imageRef = useRef<HTMLImageElement>();
  useLayoutEffect(
     () => {
      const img = document.createElement('img');

      function onload() {
        imageRef.current = img;
      }

      function onerror() {
        imageRef.current = undefined;
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

  return imageRef.current;
}

export default UseImage;
