// src/WebServer.tsx
import React, {useState, useEffect} from 'react';
import {Slider, SliderSingleProps, Switch} from "antd";
import {backendUrl} from "./Admin.tsx";

type Data = {
    temperature: number;
    humidity: number;
    button1: boolean;
    button2: boolean;
    button3: boolean;
    isAutoMode: boolean;
    temperatureThreshold: number;
    humidityThreshold: number;
};

const Screen31: React.FC = () => {
    const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
    const [led3State, setLed3State] = useState<boolean>(false);
    const [led1State, setLed1State] = useState<boolean>(true);
    const [led2State, setLed2State] = useState<boolean>(true);
    const [humidity, setHumidity] = useState<number>();
    const [temperature, setTemperature] = useState<number>();
    const [humidityThreshold, setHumidityThreshold] = useState<number>();
    const [temperatureThreshold, setTemperatureThreshold] = useState<number>();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${backendUrl}/app/data`);
                const data: Data = await response.json();
                setLed1State(data.button1)
                setLed2State(data.button2)
                setLed3State(data.button3)
                setIsAutoMode(data.isAutoMode)
                setTemperature(data.temperature)
                setHumidity(data.humidity)
                setTemperatureThreshold(data.temperatureThreshold)
                setHumidityThreshold(data.humidityThreshold)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    const onChange = async (checked: boolean) => {
        try {
            const response = await fetch(`${backendUrl}/app/auto`)
            const data: boolean = await response.json();
            setIsAutoMode(data)
            setIsAutoMode(data);
        } catch (error) {
            console.log(error)
        }
    };

    const onLed3Change = async (checked: boolean) => {
        try {
            const response = await fetch(`${backendUrl}/app/led3`);
            const data: boolean = await response.json();
            setLed3State(data);
        } catch (e) {
            console.error(e);
        }
    }

    const onLed1Change = async (checked: boolean) => {
        try {
            const response = await fetch(`${backendUrl}/app/toggle/1`);
            const data: boolean = await response.json();
            setLed1State(data);
        } catch (e) {
            console.error(e);
        }
    }
    const onLed2Change = async (checked: boolean) => {
        try {
            const response = await fetch(`${backendUrl}/app/toggle/2`);
            const data: boolean = await response.json();
            setLed2State(data);
        } catch (e) {
            console.error(e);
        }
    }

    const onHumidityThresholdChange = async (value: number) => {
        const threshold ={
            "temperature": temperatureThreshold,
            "humidity": value
        }
        updateThreshold(threshold);
    }

    const onTemperatureThresholdChange = async (value: number) => {
        const threshold ={
            "temperature": value,
            "humidity": humidityThreshold
        }
        updateThreshold(threshold);
    }

    const updateThreshold = async (threshold) => {
        try{
            const response = await fetch(`${backendUrl}/app/threshold`, {
                method: 'POST',
                body: JSON.stringify(threshold),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(!response.ok) {
                console.error('Failed to update threshold:', response.statusText);
            }
        }catch (e){
            console.log(e)
        }
    }

    const temperatureMarks: SliderSingleProps['marks'] = {
        0: '0°C',
        30: '30°C',
        60: {
            style: {
                color: '#f50',
            },
            label: <strong>60°C</strong>,
        },
    };
    const humidityMarks: SliderSingleProps['marks'] = {
        0: '0%',
        40: '40%',
        80: {
            style: {
                color: '#f50',
            },
            label: <strong>80%</strong>,
        },
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-1/2 bg-white flex p-8 rounded-lg shadow-lg">
                <div className={`w-1/2`}>
                    <h1 className="text-2xl font-bold mb-6 text-gray-700">ESP32 Web Server</h1>
                    <div className="flex flex-col gap-4 mb-6">
                        <div className={`flex gap-4`}>
                            <p>Led 1: </p>
                            <Switch value={led1State} onChange={onLed1Change}/>
                        </div>
                        <div className={`flex gap-4`}>
                            <p>Led 2: </p>
                            <Switch value={led2State} onChange={onLed2Change}/>
                        </div>
                    </div>
                    <p className="text-lg text-gray-600">
                        Temperature: <span className="font-semibold">{temperature ?? temperature} °C</span>
                    </p>
                    <p className="text-lg text-gray-600">
                        Humidity: <span className="font-semibold">{humidity && humidity} %</span>
                    </p>
                </div>
                <div className={`w-1/2 flex flex-col gap-6`}>
                    <div className={`flex gap-4`}>
                        <p>Auto mode: </p>
                        <Switch value={isAutoMode} onChange={onChange}/>
                        <div className={`flex gap-4 flex-1 justify-end `}>
                            <p>Devices: </p>
                            <Switch value={led3State} disabled={isAutoMode} onChange={onLed3Change}/>
                        </div>
                    </div>
                    {
                        isAutoMode ? (
                                <div className={`flex flex-col gap-6`}>
                                    <div className={`flex gap-4 items-center w-full`}>
                                        <p className={`w-[100px]`}>Temperature: </p>
                                        <Slider className={`flex-1`}
                                                value={temperatureThreshold}
                                                onChange={(value)=>setTemperatureThreshold(value)}
                                                onChangeComplete={onTemperatureThresholdChange}
                                                max={60}
                                                marks={temperatureMarks}
                                                defaultValue={temperatureThreshold ?? temperatureThreshold}/>
                                    </div>
                                    <div className={`flex gap-4 items-center w-full`}>
                                        <p className={`w-[100px]`}>Humidity: </p>
                                        <Slider className={`flex-1`}
                                                value={humidityThreshold}
                                                onChange={(value)=>setHumidityThreshold(value)}
                                                onChangeComplete={onHumidityThresholdChange}
                                                max={80}
                                                marks={humidityMarks}
                                                defaultValue={humidityThreshold ?? humidityThreshold}/>
                                    </div>
                                </div>

                            ) :
                            (
                                <div>

                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default Screen31;
