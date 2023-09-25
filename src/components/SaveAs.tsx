import React from "react";
import { saveAs } from "file-saver";
import { Button } from "./ui/button";
import { Download } from 'lucide-react'


export default function SaveAs() {
  const saveFile = () => {
    saveAs(
    //   "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    //   "example.pdf",
      "relicate.png"
    );
    saveAs("https:/https://2269-102-89-22-135.ngrok-free.app/image", "image.jpg");
//     var canvas = document.getElementById("my-canvas");
//         canvas.toBlob(function(blob) 
//         {
//     saveAs(blob, "pretty image.png");
// });
  };
  return (
    <div>
      {/* <Button onClick={saveFile}>download</button> */}
      <Button onClick={saveFile}>
         <Download />
      </Button>
    </div>
  );
}