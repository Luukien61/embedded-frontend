// src/WebServer.tsx
import React, {useState, useEffect} from 'react';
import {Slider, SliderSingleProps, Switch} from "antd";

type Data = {
    temperature: number;
    humidity: number;
    button1: boolean;
    button2: boolean;
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

    const [data, setData] = useState<Data>({
        temperature: 0,
        humidity: 0,
        button1: false,
        button2: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data');
                const data = await response.json();
                setData({
                    temperature: data.temperature,
                    humidity: data.humidity,
                    button1: data.button1,
                    button2: data.button2,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    const onChange = (checked: boolean) => {
        setIsAutoMode(checked);
    };

    const onLed3Change = (checked: boolean) => {
        setLed3State(checked);
    }

    const onLed1Change = (checked: boolean) => {
        setLed1State(checked);
    }
    const onLed2Change = (checked: boolean) => {
        setLed2State(checked);
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
                        Temperature: <span className="font-semibold">{data.temperature} °C</span>
                    </p>
                    <p className="text-lg text-gray-600">
                        Humidity: <span className="font-semibold">{data.humidity} %</span>
                    </p>
                </div>
                <div className={`w-1/2 flex flex-col gap-6`}>
                    <div className={`flex gap-4`}>
                        <p>Auto mode: </p>
                        <Switch value={isAutoMode} onChange={onChange}/>
                    </div>
                    {
                        isAutoMode ? (
                                <div className={`flex flex-col gap-6`}>
                                    <div className={`flex gap-4 items-center w-full`}>
                                        <p className={`w-[100px]`}>Temperature: </p>
                                        <Slider className={`flex-1`} max={60} marks={temperatureMarks} defaultValue={37}/>
                                    </div>
                                    <div className={`flex gap-4 items-center w-full`}>
                                        <p className={`w-[100px]`}>Humidity: </p>
                                        <Slider className={`flex-1`} max={80} marks={humidityMarks} defaultValue={30}/>
                                    </div>
                                </div>

                            ) :
                            (
                                <div>
                                    <div className={`flex gap-9`}>
                                        <p>Devices: </p>
                                        <Switch value={led3State} onChange={onLed3Change}/>
                                    </div>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default Screen31;
