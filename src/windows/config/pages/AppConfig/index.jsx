import { TextField, Select, MenuItem, Box, FormControlLabel, Checkbox } from '@mui/material';
import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { notification } from '@tauri-apps/api';
import { useAtom } from 'jotai';
import { nanoid } from 'nanoid';
import React from 'react';
import * as interfaces from '../../../../interfaces';
import language from '../../../../global/language';
import "flag-icons/css/flag-icons.min.css";
import ConfigList from '../../components/ConfigList';
import ConfigItem from '../../components/ConfigItem';
import { set } from '../../../../global/config';
import {
    autoCheckAtom,
    autoCopyAtom,
    autoStartAtom,
    dynamicTranslateAtom,
    targetLanguageAtom,
    defaultInterfaceAtom,
    proxyAtom,
    windowHeightAtom,
    windowWidthAtom,
    themeAtom
} from '../../App'
export default function AppConfig() {
    const [autoStart, setAutoStart] = useAtom(autoStartAtom);
    const [autoCheck, setAutoCheck] = useAtom(autoCheckAtom);
    const [dynamicTranslate, setDynamicTranslate] = useAtom(dynamicTranslateAtom);
    const [autoCopy, setAutoCopy] = useAtom(autoCopyAtom);
    const [targetLanguage, setTargetLanguage] = useAtom(targetLanguageAtom);
    const [defaultInterface, setDefaultInterface] = useAtom(defaultInterfaceAtom);
    const [proxy, setProxy] = useAtom(proxyAtom);
    const [windowWidth, setWindowWidth] = useAtom(windowWidthAtom);
    const [windowHeight, setWindowHeight] = useAtom(windowHeightAtom);
    const [theme, setTheme] = useAtom(themeAtom);

    return (
        <>
            <ConfigList label="应用设置">
                <ConfigItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={autoStart}
                                onChange={(e) => {
                                    setAutoStart(e.target.checked);
                                    if (e.target.checked) {
                                        isEnabled().then(v => {
                                            if (!v) {
                                                enable().then(_ => {
                                                    notification.sendNotification({
                                                        title: '设置开机启动',
                                                        body: '已设置为开机启动'
                                                    })
                                                })
                                            }
                                        })
                                    } else {
                                        isEnabled().then(v => {
                                            if (v) {
                                                disable().then(_ => {
                                                    notification.sendNotification({
                                                        title: '取消开机启动',
                                                        body: '已取消开机启动'
                                                    })
                                                })
                                            }
                                        })
                                    }
                                    set('auto_start', e.target.checked);
                                }} />
                        }
                        label="开机自启" />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={autoCheck}
                                onChange={(e) => {
                                    setAutoCheck(e.target.checked);
                                    set('auto_check', e.target.checked);
                                }} />
                        }
                        label="启动时检查更新" />
                </ConfigItem>

                <ConfigItem label="网络代理">
                    <TextField
                        fullWidth
                        value={proxy}
                        placeholder="eg:http://127.0.0.1:7890"
                        onChange={(e) => {
                            setProxy(e.target.value);
                            set('proxy', e.target.value);
                        }}
                    />
                </ConfigItem>
                <ConfigItem label="颜色主题">
                    <Select
                        fullWidth
                        value={theme}
                        onChange={(e) => {
                            setTheme(e.target.value);
                            set('theme', e.target.value);
                        }}
                    >
                        <MenuItem value='auto'>跟随系统</MenuItem>
                        <MenuItem value='light'>明亮</MenuItem>
                        <MenuItem value='dark'>黑暗</MenuItem>
                    </Select>
                </ConfigItem>
                <ConfigItem label="翻译窗口默认大小">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: "space-between"
                        }}
                    >
                        <TextField
                            label="宽"
                            sx={{ width: "calc(50% - 8px)" }}
                            value={windowWidth}
                            onChange={(event) => {
                                setWindowWidth(Number(event.target.value));
                                set('window_width', Number(event.target.value));
                            }}
                        />
                        <TextField
                            label="高"
                            sx={{ width: "calc(50% - 8px)" }}
                            value={windowHeight}
                            onChange={(event) => {
                                setWindowHeight(Number(event.target.value));
                                set('window_height', Number(event.target.value));
                            }}
                        />
                    </Box>
                </ConfigItem>
            </ConfigList>
            <ConfigList label="翻译设置">
                <ConfigItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={dynamicTranslate}
                                onChange={(e) => {
                                    setDynamicTranslate(e.target.checked);
                                    set('dynamic_translate', e.target.checked);
                                }} />
                        }
                        label="动态翻译" />
                </ConfigItem>
                <ConfigItem label="目标语言">
                    <Select
                        fullWidth
                        value={targetLanguage}
                        onChange={(e) => {
                            setTargetLanguage(e.target.value);
                            set('target_language', e.target.value);
                        }}
                    >
                        {
                            language.map(x => {
                                return <MenuItem value={x.value} key={nanoid()}>
                                    <span className={`fi fi-${x.code}`} /><span>{x.label}</span>
                                </MenuItem>
                            })
                        }
                    </Select>
                </ConfigItem>
                <ConfigItem label="默认接口">
                    <Select
                        fullWidth
                        value={defaultInterface}
                        onChange={(e) => {
                            setDefaultInterface(e.target.value);
                            set('interface', e.target.value);
                        }}
                    >
                        {
                            Object.keys(interfaces).map(
                                x => {
                                    return <MenuItem value={x} key={nanoid()}>{interfaces[x]['info']['name']}</MenuItem>
                                }
                            )
                        }
                    </Select>
                </ConfigItem>
                <ConfigItem label="翻译后自动复制">
                    <Select
                        fullWidth
                        value={autoCopy}
                        onChange={(e) => {
                            setAutoCopy(e.target.value);
                            set('auto_copy', e.target.value);
                        }}
                    >
                        <MenuItem value={1} >原文</MenuItem>
                        <MenuItem value={2} >译文</MenuItem>
                        <MenuItem value={3} >原文+译文</MenuItem>
                        <MenuItem value={4} >关闭</MenuItem>
                    </Select>
                </ConfigItem>
            </ConfigList>
        </>
    )
}