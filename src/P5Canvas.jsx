import { useEffect, useRef } from 'react';
import p5 from 'p5';

// p5のスケッチ（インスタンスモード）をReactコンポーネントとして表示する
export default function P5Canvas({ sketch }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let instance = null;

    // 開発時のStrictModeでは「マウント→即アンマウント→再マウント」が起きる。
    // 生成を1タスク遅らせ、即アンマウントされた分は作らないようにする。
    const timer = setTimeout(() => {
      instance = new p5(sketch, container);
    }, 0);

    return () => {
      clearTimeout(timer);
      instance?.remove();
      container.replaceChildren();
    };
  }, [sketch]);

  return <div ref={containerRef} />;
}
