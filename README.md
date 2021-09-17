# react-native-joystick

React-Native 虚拟手柄，支持左、右双摇杆

无需原生代码

##已知问题:
1.Android摇杆漂移 => 在gradle里设置compileSdkVersion和targetSdkVersion为30即可解决

## 安装方法如下:

**From npm package**: npm install react-native-joystick

**From yarn package**: yarn add react-native-joystick

![](https://github.com/panzijian/react-native-joystick/blob/main/1622013016922533.gif)

## 示例:

## 引入库:

import {MultiView, MultiTouchButton, MultiTouchApp} from 'react-native-joystick';

## 在你使用的class上继承MultiTouchApp
## 注意:MultiTouchButton一定要在MultiView组件内

    class YourHandleView extends MultiTouchApp{
    
         /**
         * 处理发送按键/摇杆
         * @param key        键值
         * @param pressed    按下/放开
         * @param value      范围值、摇杆和L2、R2
         */
        handlerJoyStick(key, pressed, value) {
            
        }
        
        render(){
            return(
                <MultiView app={this} style={{flex : 1}}>
                //按键
                    <MultiTouchButton
                        context={this}
                        defaultImage={Images.game.ic_x_t}
                        focusImage={Images.game.ic_x_1_t}
                        style={styles.viewX}
                        onClickDown={() => this.handlerJoyStick(keyboardHashMap.X, true)}
                        onClickUp={() => this.handlerJoyStick(keyboardHashMap.X, false)}
                    />
                    <MultiTouchButton
                        context={this}
                        defaultImage={Images.game.ic_y_t}
                        focusImage={Images.game.ic_y_1_t}
                        style={styles.viewY}
                        onClickDown={() => this.handlerJoyStick(keyboardHashMap.Y, true)}
                        onClickUp={() => this.handlerJoyStick(keyboardHashMap.Y, false)}
                    />
                //摇杆 此处定义你的摇杆背景图，可以不定义，也可以自定义任何其他view
                    <ImageBackground
                        source={Images.game.ic_bg_t}
                        style={styles.viewLeftImageBackground}
                    >
                        <MultiTouchButton
                            context={this}
                            ygLeftHandle={true}
                            r={dp(50)}
                            defaultImage={Images.game.ic_yaogan_t_left}
                            focusImage={Images.game.ic_yaogan_1_t_left}
                            style={styles.viewLeftHandle}
                            onEvent={(event) => {
                                const xy = `${event.x.toFixed(6)}|${event.y.toFixed(6)}`;
                                this.handlerJoyStick(keyboardHashMap.LJoyStick, true, xy);
                            }}
                        />
                    </ImageBackground>
                </MultiView>               
            )
        }   
    }
    
    class styles = StyleSheet.create({
        viewX: {
                width: 56,
                height: 56,
                position: 'absolute',
                zIndex: 999,
                bottom: 55,
                right: 106,
            },
            viewY: {
                width: 56,
                height: 56,
                position: 'absolute',
                zIndex: 999,
                bottom: 97,
                right: 60,
            },
            viewLeftImageBackground: {
                position: 'absolute',
                zIndex: 999,
                left: 46,
                bottom: 22,
                alignItems: 'center',
                justifyContent: 'center',
                width: 100,
                height: 100,
                borderRadius: 100,
            },
            viewLeftHandle: {
                width: 35,
                height: 35,
                zIndex: 9999,
            },
    });

## API:

## MultiTouchButton:

|  API      |  android |   ios   |  description |
|  :---  |   :---:  |  :---:  |     :---    |
| 'context'   | YES | YES | 上下文对象(必须)
| 'defaultImage'  | YES | YES | 按钮、摇杆的默认图片
| 'focusImage' | YES | YES | 按钮、摇杆的焦点、按下图片
| 'onClickDown' | YES | YES | 按钮、摇杆的焦点、点击方法
| 'onClickUp' | YES | YES | 按钮、摇杆的焦点、点击放开方法
| 'r' | YES | YES | 摇杆的圆半径(必须)
| 'onEvent' | YES | YES | 摇杆移动事件


如果觉得对你的项目有帮助，请点个star，谢谢！

