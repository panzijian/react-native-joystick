# react-native-joystick

React-Native 虚拟手柄，支持左、右双摇杆

无需原生代码

## 安装方法如下:

**From npm package**: npm install react-native-joystick

**From yarn package**: yarn add react-native-joystick

## 使用方法:

## 示例:

import {MultiView, MultiTouchButton, MultiTouchApp} from './VirtualHandleMultiTouch';

class YourHandleView extends MultiTouchApp{

        constructor(props) {
            keyboardHashMap:{//定义你的按键值
                A : 96,
                B : 97,
                X : 99,
                Y : 100
            }
        }
        
        /**
        * 处理按键
        * @param key 键值
        * @param state 状态 true:按下 false:放开
        */
        handlerButton(keyboard,state){
            
        }
        
        render(){
        const {keyboardHashMap} = this.state;
            return(
                <View>
                    <MultiView app={this}/>
                    //按键
                        <MultiTouchButton
                            context={this}
                            keyboard={keyboardHashMap.A}
                            defaultImage={Images.game.ic_x_t}
                            focusImage={Images.game.ic_x_1_t}
                            style={styles.viewX}
                        />
                        <MultiTouchButton
                            context={this}
                            keyboard={keyboardHashMap.B}
                            defaultImage={Images.game.ic_b_t}
                            focusImage={Images.game.ic_b_1_t}
                            style={styles.viewX}
                        />
                    //摇杆
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
                            onClickUp={() => {
                                
                            }}
                            onEvent={(event) => {
                                this.handlerLeftMove(event.x, event.y);
                            }}
                        />
                    </ImageBackground>
                    </MultiView>
                <View/>
            )
        }
}

## API:

## MultiTouchButton:

|  API      |  android |   ios   |  description |
|  :---  |   :---:  |  :---:  |     :---    |
| 'context'   | YES | YES | 上下文对象(必须)
| 'keyboard'| YES | YES  |  定义的按键返回值，按钮必须，摇杆不需要
| 'defaultImage'  | YES | YES | 按钮、摇杆的默认图片
| 'focusImage' | YES | YES | 按钮、摇杆的焦点、按下图片
| 'onClickDown' | YES | YES | 按钮、摇杆的焦点、点击方法
| 'onClickUp' | YES | YES | 按钮、摇杆的焦点、点击放开方法
| 'r' | YES | YES | 摇杆的圆半径(必须)
| 'onEvent' | YES | YES | 摇杆移动事件




