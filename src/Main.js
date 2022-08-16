import React, { useCallback } from 'react'
import { useRef, useState, useEffect } from 'react'

const colors = [
    "red",
    "blue",
    "black",
    "green",
    "yellow", 
    "grey",
    "pink"
]

const  Main = () => {
    
    const ctx = useRef(null);
    const canvasRef = useRef(null);
    const[selectedColor, setSelectedColor] = useState(colors[2]);
    const[mouseDown , setMouseDown] = useState(false);
    const[lastPosition , setPosition] = useState({
        x: 0,
        y: 0
    })

    useEffect(() => {
        if(canvasRef.current){
            ctx.current = canvasRef.current.getContext('2d');
        }
    },[]);

    const draw = useCallback((x, y) => {
        if(mouseDown){
            ctx.current.beginPath();
            ctx.current.strokeStyle = selectedColor;
            ctx.current.lineWidth = 10;
            ctx.current.lineJoin = 'round';
            ctx.current.moveTo(lastPosition.x , lastPosition.y);
            ctx.current.lineTo(x , y);
            ctx.current.closePath();
            ctx.current.stroke();

            setPosition({
                x,
                y
            },[lastPosition, mouseDown, selectedColor, setPosition])
        }
    })

    const onMouseDown = (e) =>{
        setPosition({
            x: e.pageX,
            y: e.pageY
        })
        setMouseDown(true);
    } 

    const onMouseUp = (e) => {
        setMouseDown(false);
    }

    const onMouseMove = (e) => {
        draw(e.pageX, e.pageY);
    }

    const clear = () => {
        ctx.current.clearRect(0 , 0, ctx.current.canvas.width, ctx.current.canvas.height);
    }

    const download = async() => {
        const image = canvasRef.current.toDataURL('image/png');
        const blob = await( await fetch(image)).blob();
        const blobURL =  URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = "image.png";
        link.click();
    } 
    //console.log(mouseDown , lastPosition);
  return (
    <div className='main'>
        <canvas
        style={{
            border: "1px solid black",
            backgroundColor: "white"
        }}
        width={1517}
        height={600}
        ref={canvasRef}
        //onMouseMove = {onMouseMove}
        onMouseUp = {onMouseUp}
        onMouseDown = {onMouseDown}
        onMouseLeave = {onMouseUp}
        onMouseMove = {onMouseMove}
        />
        <br />
        <div className='selector'>
        <select className='select'
            value={selectedColor}
            onChange = {(e) => setSelectedColor(e.target.value)}
        >
            {
                colors.map(
                    color => <option value={color}>{color}</option>
                )
            }
        </select>
        </div>
        <div className='buttons'>
        <button onClick={clear}>Clear</button>
        <button onClick={download}>Download</button>
        </div>
    </div>
  )
}

export default  Main