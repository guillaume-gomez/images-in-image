import React, { useRef, useState } from 'react';
import { format as formatFns } from "date-fns";
import useImages from "./Hooks/useImages";
import useFromImageToImages from "./Hooks/useFromImageToImages";
import StepFormCard from "./Components/StepFormCard";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import sampleImage from "./image.png";
import { resizeImage } from "./tools";


import Header from "./Components/Header";
import Footer from "./Components/Footer";

import './App.css';

type AlgorithmType = "optimized" | "biggestImage";

function App() {
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>("optimized");
  const [image, setImage] = useState<HTMLImageElement>();
  const [error, setError] = useState<string>("");
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const canvasPreview = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { paletteImages, setPaletteImage } = useImages();

  const picturesData = [
    { color: { red: 0, green: 0, blue: 0 }, sprite: paletteImages[0].sprite},
    { color: { red: 255, green: 255, blue: 255 }, sprite: paletteImages[1].sprite},
    { color: { red: 255, green: 0, blue: 0 }, sprite: paletteImages[2].sprite},
    { color: { red: 0, green: 255, blue: 0 }, sprite: paletteImages[3].sprite},
    { color: { red: 0, green: 0, blue: 255 }, sprite: paletteImages[4].sprite}
  ];
  const { generateImage, optimizedGenerateImage } = useFromImageToImages({picturesData, dominantImageSize: 32});

  function moveTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  function generateImagesInImage() {
    if(!image) {
      setError("Error! Please upload an image");
      moveTo("choose-image");
    }
    if(image && canvasFinal.current && canvasPreview.current) {
      if(algorithmType === "optimized") {
        optimizedGenerateImage(image, canvasFinal.current);

      } else {
        generateImage(image, canvasFinal.current);
      }
      // generate preview
      resizeImage(canvasFinal.current, canvasPreview.current, canvasFinal.current.width, canvasFinal.current.height);
      moveTo("result");
    }
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
                {
                  error.length > 0 ?
                    <div className="alert alert-error shadow-lg">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                      </div>
                    </div>
                  : <></>
                }
                <InputFileWithPreview onChange={(image) => { setImage(image); setError(""); } } value={image} />
              </StepFormCard>
              <StepFormCard
                id="custom-palette"
                stepNumber={2}
                title="Custom your palette"
                nextButtonText="Next 👉"
                onClick={() => moveTo("algorithm")}
              >
                { paletteImages.map(paletteImage => {
                    return (
                    <div key={paletteImage.name}>
                      <label>{paletteImage.name}</label>
                      <InputFileWithPreview onChange={(image) => {setPaletteImage(paletteImage.name, image) }} value={paletteImage.sprite} />
                    </div>)
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
                    <option key="0" disabled >Select the algorithm</option>
                    <option key="1" value="optimized">Optimised</option>
                    <option key="2" value="biggestImage"> Biggest Image</option>
                </select>
              </StepFormCard>

              <StepFormCard
                id="result"
                stepNumber={4}
                title="See the Result"
              >
                <div>
                  {/* change class instead of conditional rendering to make sure the components are always mounted*/}
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Show real result</span>
                      <input type="checkbox" className="toggle toggle-primary" checked={fullscreen} onChange={() => setFullscreen(!fullscreen) } />
                    </label>
                  </div>
                  <span>The image could be wider than your screen. That is why we display the preview at first</span>
                  <canvas className={ fullscreen ? "hidden" : "w-full"} ref={canvasPreview} />
                  <div className="w-full relative overflow-x-scroll" style={{ minHeight: "400px" }} >
                    <canvas className={ fullscreen ? "absolute" : " absolute hidden"} ref={canvasFinal} style={{ overflow: 'scroll'}}/>
                  </div>
                </div>
                <p>Download image could take times if the image is large</p>
                <a ref={anchorRef} className="btn btn-primary" onClick={ () => saveImage()}>Save</a>
              </StepFormCard>
            </div>
          </div>
        <Footer />
    </div>
  );
}

export default App;
