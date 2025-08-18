import { useEffect, useRef } from "react";
import { VideoTileStyled } from "./VideoTile.styled";

type VideoTileProps = {
  stream: MediaStream;
  userId: string;
};

export default function VideoTile({ stream, userId }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <VideoTileStyled>
      <video ref={videoRef} autoPlay playsInline />
      <span>{userId}</span>
    </VideoTileStyled>
  );
}
