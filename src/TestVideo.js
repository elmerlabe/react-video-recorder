import moment from "moment";
import { useEffect, useRef, useState } from "react";

//import Layout from "../components/Layout";

const TestVideo = () => {
  const videoRef = useRef();
  const downloadRef = useRef();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedVideo, setHasRecordedVideo] = useState(false);

  const onStopRecord = () => {
    setIsRecording(false);

    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const onStartRecord = () => {
    setIsRecording(true);

    if (mediaRecorder) {
      mediaRecorder.start(1000);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          facingMode: "user",
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          setMediaRecorder(new MediaRecorder(stream));
        }
      });
  }, []);

  useEffect(() => {
    const blobsRecorded = [];
    const onDataAvailableHandler = (e) => blobsRecorded.push(e.data);
    const onStopHandler = () => {
      const objectUrl = URL.createObjectURL(
        new Blob(blobsRecorded, { type: "video/webm" })
      );

      setHasRecordedVideo(true);

      // TODO upload video to firebase storage
      if (downloadRef.current) {
        downloadRef.current.download = `${moment().format(
          "YYYY-MM-DD HH-mm"
        )}.webm`;
        downloadRef.current.href = objectUrl;
        console.log(objectUrl);
        console.log(downloadRef);
        console.log(downloadRef.current.download);
      }
    };

    if (mediaRecorder) {
      mediaRecorder.addEventListener("dataavailable", onDataAvailableHandler);
      mediaRecorder.addEventListener("stop", onStopHandler);
    }

    return () => {
      if (mediaRecorder) {
        mediaRecorder.removeEventListener(
          "dataavailable",
          onDataAvailableHandler
        );
        mediaRecorder.removeEventListener("stop", onStopHandler);
      }
    };
  }, [mediaRecorder]);

  return (
    <div>
      <h1>Record Video for Past Client</h1>
      <video
        muted
        autoPlay
        className="w-[400px] h-[400px] object-cover mt-3 rounded-full"
        ref={videoRef}
      />
      <button
        onClick={isRecording ? onStopRecord : onStartRecord}
        className="mt-3 px-3 py-2 bg-vermilion text-white text-sm"
      >
        {isRecording ? "Stop" : "Start"}
      </button>
      <a
        className={`ml-3 mt-3 px-3 py-2 bg-vermilion text-white text-sm ${
          hasRecordedVideo ? "" : "hidden"
        }`}
        ref={downloadRef}
      >
        Download
      </a>
    </div>
  );
};

export default TestVideo;
