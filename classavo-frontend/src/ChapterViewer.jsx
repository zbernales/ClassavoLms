import React from "react";

const ChapterViewer = ({ content }) => {
  let parsedContent = [];

  try {
    parsedContent = JSON.parse(content || "[]");
  } catch (e) {
    parsedContent = [{ type: "p", children: [{ text: content || "" }] }];
  }

  const renderNode = (node, index) => {
    const text = node.children?.map((child) => child.text).join("") || "";
    switch (node.type) {
      case "h1":
        return <h1 key={index}>{text}</h1>;
      case "h2":
        return <h2 key={index}>{text}</h2>;
      case "h3":
        return <h3 key={index}>{text}</h3>;
      case "blockquote":
        return <blockquote key={index}>{text}</blockquote>;
      case "p":
      default:
        return <p key={index}>{text}</p>;
    }
  };

  return <div>{parsedContent.map(renderNode)}</div>;
};

export default ChapterViewer;