import React, { useState, useEffect } from 'react';


function useRandomImage(hexColor: string) {
  useEffect(() => {
    async function fetchData() {

      console.log("hexColor", hexColor);
      const url = `https://dribbble.com/colors/for_404.json?hex=${hexColor}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-requested-with': 'XMLHttpRequest' }
      });
      const result = await response.json();
      return result;
    }

    // waits until the request completes...
    console.log(fetchData());
  }, [])
}

export default useRandomImage;
