define(function () {
return "@export qtek.compositor.bright\n\nuniform sampler2D texture;\n\nuniform float threshold : 1;\nuniform float scale : 1.0;\n\nuniform vec2 textureSize: [512, 512];\n\nvarying vec2 v_Texcoord;\n\nconst vec3 lumWeight = vec3(0.2125, 0.7154, 0.0721);\n\n@import qtek.util.rgbm\n\n\nvec3 median(vec3 a, vec3 b, vec3 c)\n{\n    return a + b + c - min(min(a, b), c) - max(max(a, b), c);\n}\n\nvoid main()\n{\n    vec3 texel = decodeHDR(texture2D(texture, v_Texcoord)).rgb;\n\n#ifdef ANTI_FLICKER\n            vec3 d = 1.0 / textureSize.xyx * vec3(1.0, 1.0, 0.0);\n\n    vec3 s1 = decodeHDR(texture2D(texture, v_Texcoord - d.xz)).rgb;\n    vec3 s2 = decodeHDR(texture2D(texture, v_Texcoord + d.xz)).rgb;\n    vec3 s3 = decodeHDR(texture2D(texture, v_Texcoord - d.zy)).rgb;\n    vec3 s4 = decodeHDR(texture2D(texture, v_Texcoord + d.zy)).rgb;\n    texel = median(median(texel, s1, s2), s3, s4);\n\n#endif\n\n    float lum = dot(texel, lumWeight);\n    vec4 color;\n    if (lum > threshold)\n    {\n        color.rgb = texel * scale;\n    }\n    else\n    {\n        color.rgb = vec3(0.0);\n    }\n    color.a = 1.0;\n\n    gl_FragColor = encodeHDR(color);\n}\n@end\n";
});