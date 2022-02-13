
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
let camera;
const CameraScreen = () => {
    let camera = RNCamera
    return (
        
        <RNCamera 
          ref={(ref) => {
            camera = ref;
          }}
          captureAudio={false}
          style={{flex: 1}}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }} />
        );
}
export default CameraScreen