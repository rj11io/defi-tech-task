import { useLayoutEffect, useRef } from 'react';

const useOnResize = (handleResize, debounce = 300) => {
  const handlerRef = useRef(handleResize);

  useLayoutEffect(() => {
    handlerRef.current = handleResize;
  }, [handleResize]);

  useLayoutEffect(() => {
    let timeout;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => handlerRef.current(), debounce);
    };

    window.addEventListener('resize', onResize);
    handlerRef.current();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, [debounce]);
};

export default useOnResize;
