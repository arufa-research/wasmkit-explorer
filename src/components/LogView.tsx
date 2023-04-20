import React from 'react';

import Convert from 'ansi-to-html';
import createDOMPurify from 'dompurify';

const convert = new Convert({ newline: true });
const DOMPurify = createDOMPurify(window);

const LogItemView = ({ log }: { log: any }) => {
  const isBeginningOfBlock = log.includes('Timed out');
  return (
    <>
      {
        isBeginningOfBlock
          && <div style={{ height: '0.1rem' }} className="w-full bg-terra-dark-blue my-1" />
      }
      <pre
        className="break-words whitespace-pre-line"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(convert.toHtml(log)),
        }}
      />
    </>
  );
};

export default React.memo(LogItemView);
