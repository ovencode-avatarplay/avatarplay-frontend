class Microphone {
    constructor() {
        this.record = false;
        this.position = 0;
        this.sampleRate = this.getDeviceCaps()[0];
        this.channels = 2;
        this.duration = 0;
        this.initialized = false;
        this.permissionGranted = false;
        this.mediaAvailable = false;
        this.audioContext = null;
        this.requestingMedia = false;
        this.leapSync = false;
        this.mediaStreamSource = null;
        this.audioWorkletNode = null;
        this.devicesList = [];
        this.deviceKinds = {
            VideoInput: "videoinput",
            AudioInput: "audioinput",
            AudioOutput: "audioinput"
        };

        //this.delayedInitialize(this);
        this.check();
    }

    delayedInitialize(e) {
        var i = document.querySelector("#unity-canvas"), t = null;
        t = () => {
            i.removeEventListener("touchstart", t);
            i.removeEventListener("mousedown", t);
            setTimeout(() => {
                e.initialize(e);
            }, 100);
        };
        i.addEventListener("touchstart", t);
        i.addEventListener("mousedown", t);
    }

    async initialize(e) {
        if (!e.initialized) {
            e.audioContext = new (window.AudioContext || window.webKitAudioContext)();
            await e.audioContext.audioWorklet.addModule("~/mic-worklet-module.js");
            e.audioWorkletNode = new AudioWorkletNode(e.audioContext, "microphone-worklet");
            e.audioWorkletNode.port.onmessage = i => {
                e.nodeInputHandler(e, i);
            };
            e.initialized = true;
            // ✅ Unity에 초기화 완료 알림
            if (document.microphoneNative?.unityCommand) {
                document.microphoneNative.unityCommand("Initialized", true);
            }
            Microphone.log("initialized");
        }
    }

    async check() {
        await this.refreshDevices();
        await this.refreshDevices();
        setInterval(() => {
            this.permissionStatusHandler(this);
        }, 1000);
    }

    getDeviceCaps() {
        return [16000, 48000];
    }

    getPosition() {
        return this.position;
    }

    isRecording() {
        return this.record;
    }

    start(e, i, t, a) {
        if (this.record || this.requestingMedia || !this.initialized) return;

        this.sampleRate = i;
        this.position = 0;
        this.loop = t;
        this.duration = a;

        let s = this.audioWorkletNode.parameters.get("frequency");
        s.setValueAtTime(this.sampleRate, this.audioContext.currentTime);

        let o = this.audioWorkletNode.parameters.get("channels");
        o.setValueAtTime(this.channels, this.audioContext.currentTime);

        this.requestingMedia = true;

        if (navigator.mediaDevices.getUserMedia) {
            var n = null;
            n = (e !== null && navigator.mediaDevices.getSupportedConstraints().deviceId)
                ? { audio: { deviceId: { exact: e } } }
                : { audio: true };

            navigator.mediaDevices.getUserMedia(n)
                .then(e => { this.mediaGranted(this, e); })
                .catch(e => { this.mediaFailed(this, e); });
        }
    }

    end() {
        if (!this.record || this.requestingMedia || !this.initialized || this.mediaStreamSource === null) return;

        let e = this.audioWorkletNode.parameters.get("recording");
        e.setValueAtTime(0, this.audioContext.currentTime);

        this.record = false;
        this.mediaAvailable = false;

        this.mediaStreamSource.mediaStream.getTracks().forEach(e => e.stop());

        if (this.leapSync)
            this.mediaStreamSource.disconnect(this.audioContext.destination);

        this.mediaStreamSource.disconnect(this.audioWorkletNode);

        Microphone.log("end");
    }

    devices() {
        return this.devicesList;
    }

    devicePermitted(e) {
        let i = this.devices();
        let t = !!i.find(i => i.kind === e && !!i.label);
        return t;
    }

    setLeapSync(e) {
        this.leapSync = e;
    }

    mediaGranted(e, i) {
        let t = e.audioWorkletNode.parameters.get("recording");
        t.setValueAtTime(1, e.audioContext.currentTime);

        e.mediaAvailable = true;
        e.requestingMedia = false;
        e.record = true;

        e.mediaStreamSource = e.audioContext.createMediaStreamSource(i);
        e.mediaStreamSource.connect(e.audioWorkletNode);

        if (e.leapSync)
            e.mediaStreamSource.connect(e.audioContext.destination);

        Microphone.log("start");
    }

    mediaFailed(e, i) {
        e.mediaAvailable = false;
        e.requestingMedia = false;

        Microphone.log("media stream denied");
        Microphone.log(i);
    }

    async refreshDevices() {
        if (navigator.mediaDevices?.enumerateDevices) {
            if (!this.mediaAvailable) {
                try {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                } catch (e) {
                    this.devicesList = [];
                    return;
                }
            }

            var i = await navigator.mediaDevices.enumerateDevices();
            this.devicesList = [];

            for (var t = 0; t < i.length; t++) {
                if (i[t].kind === this.deviceKinds.AudioInput) {
                    var a = {
                        deviceId: i[t].deviceId,
                        kind: i[t].kind,
                        label: i[t].label,
                        groupId: i[t].groupId
                    };
                    this.devicesList.push(a);
                }
            }
        }
    }

    nodeInputHandler(e, i) {
        if (!e.record || (e.position / e.sampleRate >= e.duration && !e.loop)) return;

        let t = i.data;
        if (t === undefined || t.data[0] === undefined) return;

        let a = Math.min(t.channels, this.channels);
        let s = t.data[0].length;
        let o = t.data;
        let n = document.microphoneNative.samplesMemoryDataLeftChannel.length;
        let r = e.position;
        let d = 0;

        for (let c = 0; c < s; c++) {
            for (let l = 0; l < a; l++) {
                if (l === 0)
                    document.microphoneNative.samplesMemoryDataLeftChannel[e.position] = o[l][c];
                else
                    document.microphoneNative.samplesMemoryDataRightChannel[e.position] = o[l][c];
            }

            e.position++;
            if (e.position + 1 > n) {
                if (e.loop)
                    e.position = 0;
                else {
                    e.position = Math.max(0, n - 1);
                    break;
                }
            }
            d++;
        }

        document.microphoneNative.unityCommand("StreamChunkReceived", r + ":" + d);
    }

    async permissionStatusHandler(e) {
        await e.refreshDevices();
        let i = e.devicePermitted(e.deviceKinds.AudioInput);
        if (e.permissionGranted !== i)
            e.setPermissionStatus(i);
    }

    setPermissionStatus(e) {
        this.permissionGranted = e;
        document.microphoneNative.unityCommand("PermissionChanged", this.permissionGranted);
    }

    static log(e) {
        console.log("[Unity][WebGL][Microphone]: " + e);
    }
}