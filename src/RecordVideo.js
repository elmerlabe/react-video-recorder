import {
  connectStorageEmulator,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRef, useState } from "react";
import VideoRecorder from "react-video-recorder";
import storage from "./firebase";

export default function RecordVideo() {
  const [viewingUrl, setViewingUrl] = useState("");
  const [videoBlob, setVideoBlob] = useState({});
  const [recordFin, setRecordFin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadVideo = () => {
    setIsUploading(true);

    if (!isUploading) {
      const randNum = Math.floor(100000 + Math.random() * 900000);
      const storageRef = ref(storage, `files/V${randNum}`);
      const uploadTask = uploadBytesResumable(storageRef, videoBlob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Uploading to firebase storage ...", percent);
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setIsUploading(false);
            console.log(url);
            setViewingUrl(url);
          });
        }
      );
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-white text-3xl mb-2">Record a video message</h2>
      <div className="container">
        <div
          style={{
            margin: "auto",
            height: "500px",
            width: "370px",
          }}
        >
          <VideoRecorder
            constraints={{
              audio: true,
              video: { width: { min: 360 }, height: { min: 400 } },
            }}
            isReplayingVideo={true}
            countdownTime={3000}
            timeLimit={60000}
            isFlipped={true}
            isOnInitially
            showReplayControls
            replayVideoAutoplayAndLoopOff
            onRecordingComplete={(blob) => {
              const objURL = URL.createObjectURL(blob);
              setVideoBlob(blob);
              //console.log(blob);
              //console.log(objURL);
              setRecordFin(true);
            }}
          />
        </div>

        <div className="hidden">
          <button
            type="button"
            className="mt-3 mr-4 inline bg-slate-600 hover:bg-slate-700 rounded-full px-10 py-1.5 text-gray-100 font-semibold"
          >
            Screenshot
          </button>
        </div>

        {recordFin ? (
          <div>
            <button
              type="button"
              onClick={() => {
                setRecordFin(false);
                document.getElementsByClassName("jLcHAe")[0].click();
              }}
              className="mt-3 mr-4 inline bg-yellow-600 hover:bg-yellow-700 rounded-full px-10 py-1.5 text-black-800 font-semibold"
            >
              Retake
            </button>

            {viewingUrl !== "" ? (
              <div className="mt-3 inline">
                <a
                  className="bg-slate-500 hover:bg-slate-600 rounded-full px-10 py-1.5 text-white font-semibold"
                  href={viewingUrl}
                  target="_blank"
                >
                  Video URL
                </a>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  uploadVideo();
                }}
                className="inline bg-sky-500 hover:bg-sky-600 rounded-full px-10 py-1.5 text-white font-semibold"
              >
                {isUploading ? <div>Uploading ...</div> : <div>Save</div>}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
