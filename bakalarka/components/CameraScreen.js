
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation} from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBeep from 'react-native-a-beep';
import Voice from '@react-native-voice/voice';
import { useCamera } from 'react-native-camera-hooks';

const CameraScreen = () => {
    const [type, setType] = useState(RNCamera.Constants.Type.back);
	const [flash, setFlash] = useState("off");
	const [photoCount, setPhotoCount] = useState('1')
    const [timerValue, setTimerValue] = useState('0')
	const [voiceFlag, setVoiceFlag] = useState(false)
	const [{ cameraRef }, { takePicture }] = useCamera(null);

	//for voice command
	const [results, setResults] = useState([]);
	const [isRecord, setIsRecord] = useState(false);

	const navigation = useNavigation();
    let camera = RNCamera
	const isFocused = useIsFocused();

    let pictureUri = [];

	//to set timerValue and photoCount when return from TimerScreen 
	useFocusEffect(
		React.useCallback(() => {
			const firstLoad = async () => {
				try {
					const timer = await AsyncStorage.getItem('timerValue');
					setTimerValue(timer);
					const photo = await AsyncStorage.getItem('photoCount');
					setPhotoCount(photo);
					const voice = await AsyncStorage.getItem('voiceFlag');
                	setVoiceFlag(JSON.parse(voice));
				} catch (err) {
					console.log(err);
				}
			};

			firstLoad();
		}, [])
	);

	//to set timerValue and photoCount when first time is screen render
	useEffect(() => {
        const firstLoad = async () => {
            try {
                const timer = await AsyncStorage.getItem('timerValue');
                setTimerValue(timer);
                const photo = await AsyncStorage.getItem('photoCount');
                setPhotoCount(photo);
				const voice = await AsyncStorage.getItem('voiceFlag');
                setVoiceFlag(JSON.parse(voice));
            } catch (err) {
                console.log(err);
            }
        };
		firstLoad();

		//Setting callbacks for the process status
		Voice.onSpeechResults = onSpeechResults;
		Voice.onSpeechEnd = onSpeechEnd;
		Voice.onSpeechError = onSpeechError;
		Voice.onSpeechPartialResults = onSpeechPartialResults;
	
		return () => {
		  	//destroy the process after switching the screen
		  	Voice.destroy().then(Voice.removeAllListeners);
		};
    }, []);

	const _onRecordVoice = async () => {
		console.log(camera)
		if (isRecord) {
			Voice.stop();
		} else {
			await Voice.start('sk-SK', { EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 10000 });
			setResults([]);
		}
		//setIsRecord(!isRecord);
	};

	const onSpeechResults = async (e) => {
		//Invoked when SpeechRecognizer is finished recognizing
		console.log('onSpeechResults: ', e);
		setResults(e.value);
		if (e.value.toString().includes('foto')) {
			await Voice.stop()
			await Voice.destroy()
			await Voice.cancel()
			voicePicture()
		}
		else {
			await _onRecordVoice()
		}
	};

	const onSpeechEnd = async (e) => {
		console.log(e)
		await Voice.stop()
	};

	const onSpeechPartialResults = (e) => {
		//Invoked when any results are computed
		console.log('onSpeechPartialResults: ', e.value);
		if (e.value.toString().includes('foto')) {
			Voice.stop()
		}
	};

	const onSpeechError = async (e) => {
		//Invoked when an error occurs.
		console.log('onSpeechError: ', e.error.code);
		if (e.error.code == 7) {
			await _onRecordVoice()
		}
	};

	const voicePicture = async () => {
		console.log(camera)
		pictureUri = []
		let options
		if(type == RNCamera.Constants.Type.front){
			options = {mirrorImage: true, fixOrientation: true}
		}
		if(type == RNCamera.Constants.Type.back){
			options = {fixOrientation: true}
		}
		const data = await takePicture(options);
		console.log(data.uri);
		pictureUri.push({id: '1', picture: data.uri})
		
		//name of picture	
		var year = new Date().getFullYear(); //Current Year
		var month = new Date().getMonth() + 1; //Current Month
		var day = new Date().getDate(); //Current Day
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
		var catype = null;
		if(type == 0){
			catype = 'b'
		}
		else {
			catype = 'f'
		}
        const date = '/' + year + '_' + month + '_' + day + '-'+ hours + '_' + min + '_' + sec + '-' + catype + '.jpg'
		await picture(date);
	}

    const settingTimer = async() => {
		console.log(photoCount + 'a' + timerValue)
		const categorie = await AsyncStorage.getItem('voiceFlag')
		
		console.log(categorie)
		console.log(results)
	}

	//when timer is active or need to take more photos than one
	const timerTakePicture = async (options) => {
		for (let index = 0; index < photoCount; index++) {
			if(camera){
				RNBeep.beep();
				const data = await takePicture(options);
				console.log(data.uri);
				pictureUri.push({id: index + 1, picture: data.uri})
			}
		}
	}

	//wait for timer end
	const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
		setTimeout(() => {
			cb();
			resolve();
		}, timeout);
	});

	//take picture function, 
	const takePictures = async () => {
		//const options = { quality: 0.5, base64: true, skipProcessing: true };
		let options
		pictureUri = []
		if(type == RNCamera.Constants.Type.front){
			options = {mirrorImage: true, fixOrientation: true}
		}
		if(type == RNCamera.Constants.Type.back){
			options = {fixOrientation: true}
		}
		
		if(photoCount == '1' && timerValue == '0'){
			if(camera){
				RNBeep.beep();
				const data = await takePicture(options);
				console.log(data.uri);
				pictureUri.push({id: '1', picture: data.uri})
			}
		}
		else {
			if(timerValue != '0'){
				await setAsyncTimeout(() => {
					console.log('timer end');
				}, timerValue*1000);
				if(camera) {
					await timerTakePicture(options);
				}
			}
			else {
				await timerTakePicture(options);
			}
		}

		//name of picture	
		var year = new Date().getFullYear(); //Current Year
		var month = new Date().getMonth() + 1; //Current Month
		var day = new Date().getDate(); //Current Day
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
		var catype = null;
		if(type == 0){
			catype = 'b'
		}
		else {
			catype = 'f'
		}
        const date = '/' + year + '_' + month + '_' + day + '-'+ hours + '_' + min + '_' + sec + '-' + catype + '.jpg'
		await picture(date);
	};

	//go to PictureScreen when photos are taken
	const picture = async (date) => {
		console.log(pictureUri)
		console.log(date)
		navigation.navigate('Picture', {
			pictureUri: pictureUri,
			pname: date
		})
	} 

    return (
		isFocused ?
        <View style={styles.container}>
            <RNCamera 
            ref={cameraRef}
            captureAudio={false}
            style={styles.camera}
            flashMode={flash}
            type={type}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }} >
                <View style={styles.buttonContainer}>
					
					<TouchableOpacity
						style={styles.flash}
						onPress={() => {
							settingTimer()
							//setFlash(flash === "off" ? "on" : "off");
						}}
					>
						{ flash === "off" ? 
							<Icon name="flash-off-outline" size={40} color="white" /> 
							: 
							<Icon name="flash-outline" size={40} color="white" /> 
						}					
					</TouchableOpacity>
					
					<TouchableOpacity
						
						onPress={() => {
							navigation.navigate("Timer", {
								paramKey: 'timer 5',
							  })
							console.log("Timer pressed")
						}}
					>
						{voiceFlag ? 
							<Icon name="mic-outline" size={15} color="white" style={{position: 'absolute', top: 0, right: 0, marginTop: 15}}/>
							: <Icon name="timer-outline" size={15} color="white" style={{position: 'absolute', top: 0, right: 0, marginTop: 15}}/>
						}
						<Icon name="menu" size={40} color="white" style={styles.timer}/>
					</TouchableOpacity>
					
					<View style={styles.takeButton}>
						<TouchableOpacity onPress={() => {if(voiceFlag == false){takePictures()}else{_onRecordVoice()}}} style={styles.takeBStyle} />
					</View>
					
					<View style={styles.flip}>
						<TouchableOpacity
						style={styles.flip}
						onPress={() => {
							setType(
								type === RNCamera.Constants.Type.back
									? RNCamera.Constants.Type.front
									: RNCamera.Constants.Type.back
							);
						}}
						>
							<Icon name="md-camera-reverse-outline" size={40} color="white" />
						</TouchableOpacity>
					</View>
					
					<View style={styles.gallery}>
						<TouchableOpacity
						style={styles.gallery}
						onPress={() => {
							navigation.navigate('HistoryExercise')
						}}
						>
							<Icon name="images-outline" size={40} color="white" />
						</TouchableOpacity>
					</View>
				</View>
            </RNCamera>
        </View> :
		<View></View>
    );
}
export default CameraScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "column",
		margin: 20,
	},
	flash: {
		position: "absolute",
		top: 0,
		left: 0,
		marginTop: 20,
	},
	timer: {
		position: "absolute",
		top: 0,
		right: 0,
		marginTop: 20,
	},
	takeButton: {
		position: "absolute",
		bottom: 0,
		alignSelf: "center",
	},
	takeBStyle: {
		width: 70,
		height: 70,
		bottom: 0,
		borderRadius: 50,
		backgroundColor: "#fff",
	},
	text: {
		fontSize: 18,
		color: "white",
	},
	flip: {
		position: "absolute",
		bottom: 5,
		right: 0,
	},
	gallery: {
		position: "absolute",
		bottom: 5,
		left: 0,
	},
	mic: {
		top: 0,
		marginTop: 20,
		alignSelf: 'center'
	}
});