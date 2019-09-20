import { Canvas, createCanvas } from "canvas";
import { Client, IPacket } from "e131";

class LightCanvas {

    private static MAX_CHANNELS_PER_UNIVERSE = 510;
    private static IMGDATA_PER_PIXEL = 4;
    private static DATA_PER_PIXEL = 3;

    private width: number;
    private height: number;
    private canvas: Canvas;
    private client: Client;
    private packetSizes: Map<number, number>;
    private packets: Map<number, IPacket>;

    constructor(width: number, height: number, hostname: string) {
        this.packets = new Map<number, IPacket>();
        this.packetSizes = new Map<number, number>();
        this.width = width;
        this.height = height;

        this.canvas = createCanvas(width, height);
        this.client = new Client(hostname);
    }

    public getContext(contextType: "2d") {
        return this.canvas.getContext(contextType);
    }

    public setUniverseSize(universe: number, size: number) {
        this.packetSizes.set(universe, size * LightCanvas.DATA_PER_PIXEL);
    }

    public getUniverseSize(universe: number) {
        return this.packetSizes.get(universe) || LightCanvas.MAX_CHANNELS_PER_UNIVERSE;
    }

    public update() {
        const ctx = this.getContext("2d");
        const imageData = ctx.getImageData(0, 0, this.width, this.height);

        let universe = 0x01;
        let i = 0;
        let remaining = imageData.data.length;
        let sent = 0;
        while (remaining > 0) {
            const packet = this.getPacket(universe);
            const size = this.getUniverseSize(universe) /
                LightCanvas.DATA_PER_PIXEL;
            this.sendPacket(packet, imageData.data,
                sent * LightCanvas.IMGDATA_PER_PIXEL, size);
            remaining -= size * LightCanvas.IMGDATA_PER_PIXEL;
            sent += size;
            universe++;
            i++;
        }
    }

    private getPacket(universe: number): IPacket {
        if (!this.packets.get(universe)) {
            const packet = this.client.createPacket(this.getUniverseSize(universe));
            packet.setSourceName("test E1.31 client");
            packet.setUniverse(universe);  // make universe number consistent with the client
            // packet.setOption(packet.Options.PREVIEW, true);  // don't really change any fixture
            // packet.setPriority(packet.DEFAULT_PRIORITY);
            this.packets.set(universe, packet);
        }
        return this.packets.get(universe) as IPacket;
    }

    private sendPacket(packet: IPacket, data: any, start: number, size: number) {
        const slotsData = packet.getSlotsData();

        for (let i = 0; i < size; i++) {
            const red = data[i * LightCanvas.IMGDATA_PER_PIXEL + 0 + start];
            const green = data[i * LightCanvas.IMGDATA_PER_PIXEL + 1 + start];
            const blue = data[i * LightCanvas.IMGDATA_PER_PIXEL + 2 + start];

            slotsData[i * LightCanvas.DATA_PER_PIXEL + 0] = red;
            slotsData[i * LightCanvas.DATA_PER_PIXEL + 1] = green;
            slotsData[i * LightCanvas.DATA_PER_PIXEL + 2] = blue;
        }

        // console.log(packet.getUniverse(), slotsData.toString('hex'));
        this.client.send(packet, () => {
            // console.log('sent packet');
        });
    }
}

module.exports = LightCanvas;
