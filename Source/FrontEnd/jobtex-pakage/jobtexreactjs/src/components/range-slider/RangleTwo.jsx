import React, { useState } from "react";
import ReactSlider from "react-slider";
import "./style.scss";
function RangeTwo({ title, value = [17000, 24000], onChange = () => {} }) {
  return (
    <div className="group-form">
      <div className="group-range-title">
        <label>
          {title}
          <span>{value[0]}$ &nbsp;-</span>
          <span>{value[1]}$</span>
        </label>
      </div>
      <ReactSlider
        ariaLabelledby="slider-label"
        className="horizontal-slider st2"
        min={0}
        max={50000}
        value={value}
        thumbClassName="example-thumb"
        trackClassName="example-track"
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        onChange={onChange}
      />
    </div>
  );
}


export default RangeTwo;
