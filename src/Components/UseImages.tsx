import React, { useState, useEffect } from 'react';


const imagesPath = [
  "black.png",
  "grey.png",
  "white.png",
];

function UseImages(url: string) {
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    //const black = useImage(process.env.PUBLIC_URL + "sprites/black.png");
  }, [])


}

export default UseImages;
