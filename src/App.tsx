import React, { useRef, useState } from 'react';
import { format as formatFns } from "date-fns";
import useImage from "./Hooks/UseImage";
import useFromImageToImages from "./Hooks/useFromImageToImages";
import StepFormCard from "./Components/StepFormCard";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import sampleImage from "./image.png";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

import './App.css';

type AlgorithmType = "optimized" | "biggestImage";

function App() {
  const [ratio, setRatio] = useState<number>(32);
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>("optimized");
  const [image, setImage] = useState<HTMLImageElement>();
  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const black = useImage(process.env.PUBLIC_URL + "sprites/test/black.png");
  const white = useImage(process.env.PUBLIC_URL + "sprites/test/white.png");
  const red = useImage(process.env.PUBLIC_URL + "sprites/test/red.png");
  const green = useImage(process.env.PUBLIC_URL + "sprites/test/green.png");
  const blue = useImage(process.env.PUBLIC_URL + "sprites/test/blue.png");

  const picturesData = [
    { color: { red: 0, green: 0, blue: 0 }, sprite: black},
    { color: { red: 0, green: 0, blue: 255 }, sprite: blue},
    { color: { red: 0, green: 255, blue: 0 }, sprite: green},
    { color: { red: 255, green: 0, blue: 0 }, sprite: red},
    { color: { red: 255, green: 255, blue: 255 }, sprite: white}
  ];
  const { generateImage, optimizedGenerateImage } = useFromImageToImages({picturesData, dominantImageSize: 32});

  function moveTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  function generateImagesInImage() {
    if(imageRef.current && canvasFinal.current) {
      if(algorithmType === "optimized") {
        optimizedGenerateImage(imageRef.current, canvasFinal.current);
      } else {
        generateImage(imageRef.current, canvasFinal.current);
      }
    }
    moveTo("result");
  }

  function resizeFinalImage(newRatio: number) {
    /*if(canvasFinal.current && imageRef.current) {
      const width = imageRef.current.width * ratio;
      const height = imageRef.current.height * ratio;
      canvasFinal.current.width = width;
      canvasFinal.current.height = height;

      generateImage(imageRef.current, canvasFinal.current);
      setRatio(newRatio);

    }*/
  }

  function saveImage() {
    if(canvasFinal.current && anchorRef.current) {
      const format = "jpeg";
      const dataURL = canvasFinal.current.toDataURL(`image/${format}`);
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (anchorRef.current as any).download = `${dateString}-image-in-images.${format}`;
      anchorRef.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }
  }

  return (
    <div className="flex flex-col gap-8 from-success to-secondary text-primary-content -mt-[4rem] grid place-items-center items-end bg-gradient-to-br pt-20">
       <Header/>
          <div className="container">
            <div className="w-full p-4 text-base-content glass xl:rounded-box flex flex-col gap-4 bg-opacity-60 xl:pb-0">
              <StepFormCard
                id="choose-image"
                stepNumber={1}
                title="Choose an image"
                nextButtonText="Next 👉"
                onClick={() => moveTo("custom-palette")}
              >
                <InputFileWithPreview onChange={(image) => setImage(image)} value={image} />
              </StepFormCard>
              <StepFormCard
                id="custom-palette"
                stepNumber={2}
                title="Custom your palette"
                nextButtonText="Next 👉"
                onClick={() => moveTo("algorithm")}
              >
                { [black, white, red, green, blue].map(dominantImage => {
                  return <InputFileWithPreview onChange={(image) => {}} value={dominantImage} />
                })

                }
              </StepFormCard>
              <StepFormCard
                id="algorithm"
                stepNumber={3}
                title="Select the algorithm"
                nextButtonText="Generate 🚀"
                onClick={generateImagesInImage}
              >
                <select
                  value={algorithmType}
                  onChange={(event) => setAlgorithmType(event.target.value as AlgorithmType)}
                  className="select select-primary w-full max-w-xs">
                  <option disabled selected >Select the algorithm</option>
                  <option value="optimized">Optimised</option>
                  <option value="biggestImage"> Biggest Image</option>
                </select>
              </StepFormCard>

              <StepFormCard
                id="result"
                stepNumber={4}
                title="See the Result"
              >
                <canvas className="overflow-auto" ref={canvasFinal} style={{ background: "blue"}}/>
                <p>Download image could take times if the image is large</p>
                <a ref={anchorRef} className="btn btn-primary" onClick={ () => saveImage()}>Save</a>
              </StepFormCard>
              <img className="hidden" src={sampleImage} ref={imageRef} />
              <p>{ratio}</p>
              <input min={1} max={32} type="range" className="range range-primary" value={ratio} onChange={(e) =>  resizeFinalImage(parseInt(e.target.value)) }/>
            </div>
          </div>
        <Footer />
    </div>
  );
}

export default App;
