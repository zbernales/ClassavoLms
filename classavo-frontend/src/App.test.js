import React from 'react';
import { Plate } from '@platejs/react';
import {
  createParagraphPlugin,
  createBoldPlugin,
  createItalicPlugin,
} from '@platejs/basic';
import { createPlugins } from '@platejs/core';

const plugins = createPlugins([
  createParagraphPlugin(),
  createBoldPlugin(),
  createItalicPlugin(),
]);

export default function ChapterEditor({ value, onChange }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <Plate value={value} plugins={plugins} onChange={onChange} />
    </div>
  );
}