import React from "react";
import {
  Plate,
  PlateContent,
  usePlateEditor,
  PlateElement,
  PlateElementProps
} from "platejs/react";

import {
  BaseBoldPlugin,
  BaseItalicPlugin,
  BaseUnderlinePlugin,
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseBlockquotePlugin,
} from "@platejs/basic-nodes";

// ---- Custom Renderers ----
function H1Element(props: PlateElementProps) {
  return <PlateElement as="h1" style={{ fontSize: "2rem" }} {...props} />;
}

function H2Element(props: PlateElementProps) {
  return <PlateElement as="h2" style={{ fontSize: "1.5rem" }} {...props} />;
}

function H3Element(props: PlateElementProps) {
  return <PlateElement as="h3" style={{ fontSize: "1.25rem" }} {...props} />;
}

function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement
      as="blockquote"
      style={{
        borderLeft: "2px solid #ccc",
        paddingLeft: "16px",
        color: "#555",
        fontStyle: "italic",
      }}
      {...props}
    />
  );
}

// ---- Component ----
export default function ChapterEditor({ value, onChange }) {
  const editor = usePlateEditor({
    plugins: [
      BaseBoldPlugin,
      BaseItalicPlugin,
      BaseUnderlinePlugin,
      BaseH1Plugin.withComponent(H1Element),
      BaseH2Plugin.withComponent(H2Element),
      BaseH3Plugin.withComponent(H3Element),
      BaseBlockquotePlugin.withComponent(BlockquoteElement),
    ],
    value,
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => onChange(value)}
    >
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => editor.tf.bold.toggle()}>B</button>
        <button onClick={() => editor.tf.italic.toggle()}>I</button>
        <button onClick={() => editor.tf.underline.toggle()}>U</button>
      </div>

      <PlateContent
        style={{
          padding: "12px",
          minHeight: "200px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
        placeholder="Write your chapter content..."
      />
    </Plate>
  );
}
