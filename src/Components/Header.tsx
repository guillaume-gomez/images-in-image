import React from 'react';

function Header() {
  return (
    <div className="navbar bg-primary text-primary-content gap-2">
       <img
        className="rounded-lg" src={process.env.PUBLIC_URL + '/logo512.png'}
        style={{border: "1px solid black"}}
        width="64px"
      />
      <a className="btn btn-ghost normal-case text-xl">Images in Image</a>
    </div>
  );
}

export default Header;
