"use client";

import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  UID,
} from "agora-rtc-sdk-ng";
import { Loader2, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import type { MeetingJoinDetails } from "@/types/telemedicine/types";
import ToastUtils from "@/utils/toastUtils";

type AgoraMeetingProps = {
  joinDetails: MeetingJoinDetails;
  participantLabel: string;
  onLeave: () => void;
};

type RemoteTrack = {
  uid: UID;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
};

const remoteContainerId = (uid: UID) => `remote-video-${String(uid).replace(/[^A-Za-z0-9_-]/g, "-")}`;
const validAgoraChannelPattern = /^[A-Za-z0-9 !#$%&()+\-:;<=>?@[\]^_{}|~,.]+$/;

const getByteLength = (value: string) => new TextEncoder().encode(value).length;

const getAgoraJoinValidationError = (joinDetails: MeetingJoinDetails) => {
  if (!joinDetails.agoraAppId || joinDetails.agoraAppId.length !== 32) {
    return "Invalid Agora app id received from backend.";
  }

  if (!joinDetails.agoraChannelName) {
    return "Agora channel name is missing from backend response.";
  }

  const channelBytes = getByteLength(joinDetails.agoraChannelName);
  if (channelBytes > 64) {
    return `Agora channel name is too long (${channelBytes} bytes): ${joinDetails.agoraChannelName}`;
  }

  if (!validAgoraChannelPattern.test(joinDetails.agoraChannelName)) {
    return `Agora channel name has unsupported characters: ${joinDetails.agoraChannelName}`;
  }

  return null;
};

export function AgoraMeeting({ joinDetails, participantLabel, onLeave }: AgoraMeetingProps) {
  const { agoraAppId, agoraChannelName, agoraToken } = joinDetails;
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<{ audio?: ILocalAudioTrack; video?: ICameraVideoTrack | ILocalVideoTrack }>({});
  const [remoteTracks, setRemoteTracks] = useState<RemoteTrack[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const join = async () => {
      setIsConnecting(true);
      try {
        const validationError = getAgoraJoinValidationError(joinDetails);
        if (validationError) {
          ToastUtils.error(validationError);
          setIsConnecting(false);
          return;
        }

        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          setRemoteTracks((current) => {
            const existing = current.find((track) => track.uid === user.uid);
            const nextTrack = {
              uid: user.uid,
              videoTrack: mediaType === "video" ? user.videoTrack : existing?.videoTrack,
              audioTrack: mediaType === "audio" ? user.audioTrack : existing?.audioTrack,
            };
            return existing
              ? current.map((track) => (track.uid === user.uid ? nextTrack : track))
              : [...current, nextTrack];
          });

          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
          setRemoteTracks((current) =>
            current.map((track) =>
              track.uid === user.uid
                ? {
                    ...track,
                    videoTrack: mediaType === "video" ? undefined : track.videoTrack,
                    audioTrack: mediaType === "audio" ? undefined : track.audioTrack,
                  }
                : track
            )
          );
        });

        client.on("user-left", (user) => {
          setRemoteTracks((current) => current.filter((track) => track.uid !== user.uid));
        });

        await client.join(
          agoraAppId,
          agoraChannelName,
          agoraToken || null,
          null
        );

        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = { audio: audioTrack, video: videoTrack };
        if (localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
        }
        await client.publish([audioTrack, videoTrack]);

        if (isMounted) {
          setIsConnecting(false);
        }
      } catch (error) {
        ToastUtils.error(getApiErrorMessage(error, "Unable to join the video session."));
        if (isMounted) {
          setIsConnecting(false);
        }
      }
    };

    void join();

    return () => {
      isMounted = false;
      void leaveAgora();
    };
  }, [agoraAppId, agoraChannelName, agoraToken, joinDetails]);

  useEffect(() => {
    remoteTracks.forEach((track) => {
      const element = document.getElementById(remoteContainerId(track.uid));
      if (element && track.videoTrack) {
        track.videoTrack.play(element);
      }
    });
  }, [remoteTracks]);

  const leaveAgora = async () => {
    const tracks = localTracksRef.current;
    tracks.audio?.close();
    tracks.video?.close();
    localTracksRef.current = {};
    await clientRef.current?.leave();
    clientRef.current = null;
  };

  const handleLeave = async () => {
    await leaveAgora();
    onLeave();
  };

  const toggleMic = async () => {
    const nextValue = !micEnabled;
    await localTracksRef.current.audio?.setEnabled(nextValue);
    setMicEnabled(nextValue);
  };

  const toggleCamera = async () => {
    const nextValue = !cameraEnabled;
    await localTracksRef.current.video?.setEnabled(nextValue);
    setCameraEnabled(nextValue);
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-950 text-white">
      <header className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Telemedicine room</p>
          <h2 className="mt-1 text-xl font-bold">{participantLabel}</h2>
          <p className="mt-1 text-sm text-slate-400">{joinDetails.agoraChannelName}</p>
        </div>
        {isConnecting && (
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/10 px-3 py-2 text-sm font-bold text-sky-200">
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting
          </span>
        )}
      </header>

      <main className="grid min-h-0 flex-1 gap-3 p-3 md:grid-cols-[1fr_320px] md:p-4">
        <div className="relative min-h-[360px] overflow-hidden rounded-[24px] border border-white/10 bg-slate-900">
          {remoteTracks.length > 0 && remoteTracks[0].videoTrack ? (
            <div id={remoteContainerId(remoteTracks[0].uid)} className="h-full min-h-[360px] w-full" />
          ) : (
            <div className="grid h-full min-h-[360px] place-items-center text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sky-400/10 text-sky-200">
                  <Video className="h-8 w-8" />
                </div>
                <p className="mt-4 text-lg font-bold">Waiting for the other participant</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 rounded-2xl bg-slate-950/70 px-3 py-2 text-sm font-bold backdrop-blur-md">
            Remote participant
          </div>
        </div>

        <aside className="flex min-h-0 flex-col gap-3">
          <div className="relative min-h-56 overflow-hidden rounded-[24px] border border-white/10 bg-slate-900">
            <div ref={localVideoRef} className="h-full min-h-56 w-full" />
            {!cameraEnabled && (
              <div className="absolute inset-0 grid place-items-center bg-slate-900 text-slate-300">
                <VideoOff className="h-8 w-8" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 rounded-2xl bg-slate-950/70 px-3 py-2 text-sm font-bold backdrop-blur-md">
              You
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Controls</p>
            <div className="mt-4 grid gap-2">
              <Button variant="secondary" className="rounded-2xl" onClick={toggleMic} disabled={isConnecting}>
                {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                {micEnabled ? "Mute mic" : "Unmute mic"}
              </Button>
              <Button variant="secondary" className="rounded-2xl" onClick={toggleCamera} disabled={isConnecting}>
                {cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                {cameraEnabled ? "Camera off" : "Camera on"}
              </Button>
              <Button
                className={cn("rounded-2xl bg-rose-500 shadow-rose-500/20 hover:bg-rose-400")}
                onClick={handleLeave}
              >
                <PhoneOff className="h-4 w-4" />
                Leave call
              </Button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
