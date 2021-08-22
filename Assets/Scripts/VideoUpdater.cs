using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

public class VideoUpdater : MonoBehaviour
{
    private Texture2D texture;
    private int textureId = 0;

    [DllImport("__Internal")]
    private static extern void UpdateTextureFromVideoElement(int textureId);

    void Start() {
        texture = new Texture2D(320, 180, TextureFormat.RGBA32, false);
        var data = texture.GetPixels(0);
        for (int i = 0; i < data.Length; ++i) {
            data[i] = Color.black;
        }
        texture.SetPixels(data, 0);
        texture.Apply(false);

        var renderer = GetComponent<Renderer>();
        renderer.material.SetTexture("_MainTex", texture);
    }

    void Update() {
        if (textureId == 0) {
            textureId = texture.GetNativeTextureID();
        }
        UpdateTextureFromVideoElement(textureId);
    }
}
