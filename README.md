# lib-jitsi-meet + Unity WebGL

This is a very basic example of drawing remote video tracks from lib-jitsi-meet on objects in Unity (WebGL only).

1. When lib-jitsi-meet reports new a remote video track, it is attached to an HTML `video` element, which is stored in a JS global.
2. A script component is attached to a Unity object. The script's `Start` function creates a texture and attaches it to a material on the object. The script's `Update` function calls a JS plugin method, passing a pointer to the texture.
3. The JS plugin method uses `texSubImage2D` to copy pixels from the `video` element of the first remote track onto the texture. In a real application you would identify the remote tracks (e.g. by participant ID) and paint each one on a separate object.

For other platforms than WebGL, integration would be more complex as it would require the signalling to be implemented natively. [Contact us](mailto:team@avstack.io) if you are interested in native integration.

## AVStack

If you're building with Jitsi Meet, [AVStack](https://www.avstack.io/) provides global, scalable, managed Jitsi Meet backends that can power your application from launch up to large scale.

## License

MIT license.
