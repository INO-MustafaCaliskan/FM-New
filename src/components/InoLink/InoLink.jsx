"use client";

const InoLink = ({ hrefLink, element, className }) => {
  const routeHandle = () => {
    window.location.href = hrefLink;
  };

  return (
    <button onClick={routeHandle} className={className}>
      {element}
    </button>
  );
};

export default InoLink;
