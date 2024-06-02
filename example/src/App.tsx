import { useEffect, useMemo, useState } from 'react';
import { Carousel } from './Carousel';
import type { ImageData } from './ImageData';

const ART_URL = 'https://api.github.com/repos/jacklehamster/art/contents';

export default function App() {
  const [url, setUrl] = useState(ART_URL);
  const [data, setData] = useState<ImageData[]>();
  const canGoBack = useMemo(() => url !== ART_URL, [url]);
  useEffect(() => {
    fetch(url).then(
      async (response) => {
        const json = await response.json();
        setData(json);
      },
    )
  }, [url]);
  return (
    data ? <Carousel data={data} setUrl={setUrl} goBack={canGoBack ? () => {
      setUrl(url => {
        const split = url.split("/");
        split.pop();
        return split.join("/");    
      });
    } : undefined} /> : "..."
  );
}
