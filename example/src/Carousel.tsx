import type { ImageData } from "./ImageData";

export function Carousel({ data, setUrl, goBack }:{
    data: ImageData[];
    setUrl(url: string): void;
    goBack?(): void;
  }) {
    console.log(goBack);
  return <>
  {goBack && <button type="button" onClick={goBack}>Back</button>}
  <div style={{ display: "flex", flexWrap: "wrap" }}>
      {data.map((img, index) => {
        if (img.type === "file") {
          const path = img.path;
          const ext = path.split('.').pop()?.toLowerCase();
          if(ext=='jpeg'||ext=='gif'||ext=='jpg'||ext=='png'||ext=='svg') {
            return <div key={index} 
              style={{ width: 100, height: 100,
                backgroundImage: `url('https://jacklehamster.github.io/art/${path}')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",                
              }}></div>;
          }
        }
      })}
  </div>
  <div></div>
    {data.map((img, index) => {
      if (img.type === "dir") {
        const url = img.url;
        return <div style={{
          cursor: "pointer",
          textDecoration: "underline",
        }} key={index} onClick={() => {
          setUrl(url);
        }}>{url}</div>
      }
    })}
  </>;
}
