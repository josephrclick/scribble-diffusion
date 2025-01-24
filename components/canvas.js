import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Undo as UndoIcon, Trash as TrashIcon } from "lucide-react";

const ORIGINAL_CANVAS_SIZE = 512;

export default function Canvas({
  startingPaths,
  onScribble,
  scribbleExists,
  setScribbleExists,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    document
      .querySelector("#react-sketch-canvas__stroke-group-0")
      ?.removeAttribute("mask");

    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setCanvasSize({
          width: containerWidth,
          height: containerWidth
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    if (canvasSize.width > 0 && !initialLoadComplete) {
      loadScaledPaths();
      setInitialLoadComplete(true);
    }
  }, [canvasSize]);

  const scalePoint = (point) => {
    const scale = canvasSize.width / ORIGINAL_CANVAS_SIZE;
    return {
      x: point.x * scale,
      y: point.y * scale
    };
  };

  async function loadScaledPaths() {
    if (!canvasRef.current) return;

    const scaledPaths = startingPaths.map(path => ({
      ...path,
      paths: path.paths.map(scalePoint)
    }));

    await canvasRef.current.resetCanvas();
    await canvasRef.current.loadPaths(scaledPaths);
    setScribbleExists(true);
    onChange();
  }

  const onChange = async () => {
    const paths = await canvasRef.current?.exportPaths();
    localStorage.setItem("paths", JSON.stringify(paths, null, 2));

    if (!paths?.length) return;

    setScribbleExists(true);

    const data = await canvasRef.current?.exportImage("png");
    onScribble(data);
  };

  const undo = () => {
    canvasRef.current?.undo();
  };

  const reset = () => {
    setScribbleExists(false);
    canvasRef.current?.resetCanvas();
  };

  return (
    <div ref={containerRef} className="w-full">
      {!scribbleExists && (
        <div className="absolute grid w-full h-full p-3 place-items-center pointer-events-none text-xl">
          <span className="opacity-40">Draw something here.</span>
        </div>
      )}

      <div style={{ width: canvasSize.width, height: canvasSize.height }}>
        <ReactSketchCanvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border-none cursor-crosshair"
          strokeWidth={4}
          strokeColor="black"
          onChange={onChange}
          withTimestamp={true}
        />
      </div>

      {scribbleExists && (
        <div className="animate-in fade-in duration-700 text-left mt-4">
          <button className="lil-button" onClick={undo}>
            <UndoIcon className="icon" />
            Undo
          </button>
          <button className="lil-button" onClick={reset}>
            <TrashIcon className="icon" />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}