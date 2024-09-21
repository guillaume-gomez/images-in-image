import React, { useRef, useState, useEffect } from 'react';
import { format as formatFns } from "date-fns";
import useImages from "./Hooks/useImages";
import useImageContrast from "./Hooks/useImageContrast";
import useFromImageToImages from "./Hooks/useFromImageToImages";
import useImageSizes from "./Hooks/useImageSizes";
import StepFormCard from "./Components/StepFormCard";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import Toggle from "./Components/Toggle";
import { resizeImageCanvas, fromColorArrayToStringCSS } from "./tools";


import Header from "./Components/Header";
import Footer from "./Components/Footer";

import './App.css';

type AlgorithmType = "optimized" | "biggestImage";

function App() {
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>("optimized");
  const [image, setImage] = useState<HTMLImageElement>();
  const [error, setError] = useState<string>("");
  const [chooseContrastedImage, setChooseContrastedImage] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const canvasPreview = useRef<HTMLCanvasElement>(null);
  const canvasContrast = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const { paletteImages, setPaletteImage, removeColor, restorePaletteImages, computeRandomPalette } = useImages();
  const { generateImage, optimizedGenerateImage } = useFromImageToImages({picturesData: paletteImages, dominantImageSize: 32});

  const {
    computePossibleSize,
    setPossibleSize,
    possibleWidth,
    possibleHeight,
    allowResize,
    setAllowResize,
    ratio,
    setRatio,
    bestProportion,
    setBestProportion,
  } = useImageSizes(32);

  const { contrastedImage, computeImage } = useImageContrast();

  useEffect(() => {
    if(image) {
      computePossibleSize(image.width, image.height);
    }
  }, [image, allowResize, bestProportion, ratio]);

  useEffect(() => {
    if(image && canvasContrast.current) {
      computeImage(image, canvasContrast.current);
    }
  }, [image]);

  function moveTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function renderPreview() {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-3">
          <span>Width : {possibleWidth}</span>
          <span>Height : {possibleHeight}</span>
        </div>
        <div className="overflow-auto">
          <canvas className="bg-accent w-full" style={{maxWidth: possibleWidth, maxHeight: possibleHeight}} />
        </div>
      </div>)
  }

  function generateImagesInImage() {
    if(!image) {
      setError("Error! Please upload an image");
      moveTo("choose-image");
    }
    if(!contrastedImage) {
      setError("Contrasted image is not fully generated");
    }

    if(image && contrastedImage && canvasFinal.current && canvasPreview.current) {
      const imageChoosed = chooseContrastedImage ? contrastedImage : image;
      if(algorithmType === "optimized") {
        optimizedGenerateImage(imageChoosed, canvasFinal.current, possibleWidth, possibleHeight);
      } else {
        generateImage(imageChoosed, canvasFinal.current);
      }
      // generate preview
      resizeImageCanvas(canvasFinal.current, canvasPreview.current, canvasFinal.current.width, canvasFinal.current.height);
      moveTo("result");
    }
  }


  function isCanvasBlank() : boolean {
    if(!canvasFinal.current) {
      return true;
    }

    const context = canvasFinal.current.getContext('2d');
    if (!context) {
      return true;
    }

    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvasFinal.current.width, canvasFinal.current.height).data.buffer
    );
    return !pixelBuffer.some(color => color !== 0);
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

  function uploadImage(newImage: HTMLImageElement) {
    setImage(newImage);
    setError("");
    setPossibleSize(newImage.width, newImage.height);
  }

  return (
    <div className="flex flex-col gap-8 from-success to-secondary text-primary-content -mt-[4rem] grid place-items-center items-end bg-gradient-to-br pt-20">
       <Header/>
          <div className="container">
            <div className="w-full p-4 text-base-content glass xl:rounded-box flex flex-col gap-4 bg-opacity-60">
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
                <InputFileWithPreview onChange={uploadImage} value={image} />
                <canvas ref={canvasContrast}  style={{display: "none"}}/>
              </StepFormCard>
              <StepFormCard
                id="custom-palette"
                stepNumber={2}
                title="Custom your palette"
                nextButtonText="Next 👉"
                onClick={() => moveTo("algorithm")}
              >
                <div className="flex gap-3">
                  <button className="btn btn-secondary" onClick={restorePaletteImages}>Restore default palette images</button>
                  <button className="btn btn-accent" onClick={computeRandomPalette}>Use random Palette</button>
                </div>
                { paletteImages.map((paletteImage, index) => {
                    return (
                    <div key={paletteImage.name} className="flex flex-col gap-2">
                        <div className="badge badge-primary badge-outline h-full p-2">
                          <label className="bold flex gap-2 items-center font-bold">
                            {paletteImage.name}
                            <span
                              className="p-3"
                              style={{
                                border: "1px solid black",
                                borderRadius: "6px",
                                background: fromColorArrayToStringCSS(paletteImage.color)
                              }}
                            >
                            </span>
                            <button className="btn btn-danger btn-xs" onClick={() => removeColor(paletteImage.name)}>Delete</button>
                          </label>
                        </div>
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
                <div>
                  <Toggle
                    label="Use contrast (improve result in most of time)"
                    value={chooseContrastedImage}
                    toggle={() => setChooseContrastedImage(!chooseContrastedImage)}
                  />
                  {
                    algorithmType === "optimized" ?
                      (
                        <div>
                          <Toggle
                            label="Allow resize (will impact the proportions)"
                            value={allowResize}
                            toggle={() => setAllowResize(!allowResize)}
                          />
                          <Toggle
                            label="Best proportion"
                            value={bestProportion}
                            toggle={() => setBestProportion(!bestProportion)}
                          />
                          {Math.max(possibleWidth, possibleHeight) > 10000 &&
                            <div className="alert alert-warning shadow-lg">
                              <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Be careful your image might be too big to be generated.</span>
                              </div>
                            </div>
                          }
                          <div>
                            <label>Ratio</label>
                            <input
                              disabled={bestProportion}
                              type="range"
                              min="1"
                              max={30}
                              value={ratio}
                              onChange={(e) => setRatio(parseInt(e.target.value))}
                              className={`range ${bestProportion ? "range-error" : "range-primary"}`}
                              />
                            <span>{ratio}</span>
                          </div>
                          { renderPreview() }
                        </div>
                      ) :
                      <></>
                  }
                </div>
              </StepFormCard>

              <StepFormCard
                id="result"
                stepNumber={4}
                title="See the Result"
              >
                <div>
                  <Toggle
                    label="Show real result"
                    value={fullscreen}
                    toggle={() => setFullscreen(!fullscreen)}
                  />
                  <span>The image could be wider than your screen. That is why we display the preview at first</span>
                  {/* change class instead of conditional rendering to make sure the components are always mounted*/}
                  <canvas className={ fullscreen ? "hidden" : "w-full"} ref={canvasPreview} />
                  <div className="w-full relative overflow-x-scroll" style={{ minHeight: "400px" }} >
                    <canvas className={ fullscreen ? "absolute" : " absolute hidden"} ref={canvasFinal} style={{ overflow: 'scroll'}}/>
                  </div>
                </div>
                <p>Download image could take times if the image is large</p>
                <a
                  ref={anchorRef}
                  className={`btn btn-primary ${isCanvasBlank() ? "btn-disabled" : "" }`}
                  onClick={ () => saveImage()}
                >Save 📸</a>
              </StepFormCard>
            </div>
          </div>
        <Footer />
    </div>
  );
}

export default App;
