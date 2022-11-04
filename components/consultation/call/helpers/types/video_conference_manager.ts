import type {
	IAgoraRTC,
	IAgoraRTCClient,

	ILocalAudioTrack,
	ILocalVideoTrack,

	IRemoteAudioTrack,
	IRemoteVideoTrack
} from "agora-rtc-sdk-ng"

export type VideoConferenceManager = IAgoraRTC
export type VideoConferenceEngine = IAgoraRTCClient

export type LocalAudioTrack = ILocalAudioTrack
export type LocalVideoTrack = ILocalVideoTrack

export type RemoteAudioTrack = IRemoteAudioTrack
export type RemoteVideoTrack = IRemoteVideoTrack

export type LocalTracks = {
	"localAudioTrack": LocalAudioTrack|null
	"localVideoTrack": LocalVideoTrack|null
}

export type RemoteTracks = {
	remoteID: string,
	remoteAudioTrack: RemoteAudioTrack|null,
	remoteVideoTrack: RemoteVideoTrack|null
}
