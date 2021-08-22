// This just takes the first video element it finds.
// In a real application you would identify each video element somehow and update a separate texture for each video element.

mergeInto(LibraryManager.library, {
  UpdateTextureFromVideoElement: function (textureId) {
    const videoElement = Object.values(window.videoElements)[0];
    if (!videoElement) {
      console.log("no video element");
      return;
    }

    const texture = GL.textures[textureId];
    if (!texture) {
      console.log("no texture for id: " + textureId);
      return;
    }

    GLctx.bindTexture(GLctx.TEXTURE_2D, texture);

    GLctx.texSubImage2D(
      GLctx.TEXTURE_2D,
      0,  // level
      0,  // x offset
      0,  // y offset
      videoElement.videoWidth,
      videoElement.videoHeight,
      GLctx.RGB,
      GLctx.UNSIGNED_BYTE,
      videoElement
    );
  }
});
