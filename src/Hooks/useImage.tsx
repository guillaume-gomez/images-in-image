import  { useState, useLayoutEffect } from 'react';


function useImage(base64Image: string) : [HTMLImageElement, (image: HTMLImageElement) => void, Function ] {
  const [image, setImage] = useState<HTMLImageElement>(new Image());


  function load(source: string) {
    console.log("load")
    const img = new Image();

    function onload() {
      setImage(img);
      console.log("loaded " + base64Image)
    }

    function onerror() {
      console.log("error " + base64Image)
    }
    img.src = source;

    img.addEventListener('load', onload);
    img.addEventListener('error', onerror);


    return function cleanup() {
      img.removeEventListener('load', onload);
      img.removeEventListener('error', onerror);
    };
  }

  useLayoutEffect(
    () => {
      load(base64Image);
    },
    []
  );
  return [image, setImage, load];
}

export default useImage;
