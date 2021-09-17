/**
 * Created by pzj on 2020-12
 * email:542984705@qq.com
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    PanResponder,
    Animated,
    Image,
    ImageBackground,
    Platform,
    findNodeHandle,
    UIManager
} from 'react-native';

const panLeft = new Animated.ValueXY();
const panRight = new Animated.ValueXY();

export class MultiTouchButton extends React.Component {

    transform = {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        px: 0,
        py: 0,
    };

    constructor(props) {
        super(props);
        this.onClickDown = this.onClickDown.bind(this);
        this.onClickUp = this.onClickUp.bind(this);
        this.onEvent = this.onEvent.bind(this);
        this.ygLeftHandle = props.ygLeftHandle || false;
        this.ygRightHandle = props.ygRightHandle || false;
        this.r = props.r || null;
        // this.defaultImage = props.defaultImage;
        // this.focusImage = props.focusImage;
        this.click = false;
        this.touchId = -1;
        this.props.context.buttons.push(this);
        this.props.context.buttons.sort(function (a, b) {
            return b.props.style.zIndex - a.props.style.zIndex;
        });
    }

    onEvent(event) {
        this.props.onEvent && this.props.onEvent(event);
    }

    componentDidMount() {
        setTimeout(() => {
            this.refs['button'] && this.refs['button'].measure((ox, oy, width, height, px, py) => {
                this.transform.x = px + width / 2;
                this.transform.y = py + height / 2;
                this.transform.width = width;
                this.transform.height = height;
                this.transform.px = px;
                this.transform.py = py;
            });
        }, 100);
    }

    render() {
        const {focusImage, defaultImage} = this.props;
        return <Animated.View ref="button"
        collapsable={false}
        opacity={1}
        style={[{
                ...this.props.style,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }, this.ygLeftHandle ? {
                transform: [{translateX: panLeft.x}, {translateY: panLeft.y}],
            } : this.ygRightHandle ? {transform: [{translateX: panRight.x}, {translateY: panRight.y}]} : {}]}>
    <Image source={this.click ? focusImage : defaultImage}
        style={{
            width: this.props.style.width,
                height: this.props.style.height,
        }}/>
        </Animated.View>;
    }

    onClickDown(touchId) {
        this.click = true;
        this.props.onClickDown && this.props.onClickDown();
        this.touchId = touchId;
        this.setState({});
    }

    onClickUp() {
        this.click = false;
        this.props.onClickUp && this.props.onClickUp();
        this.touchId = -1;
        this.setState({});
    }
}

export class MultiTouchApp extends React.Component {

    componentDidMount() {
        this.buttons.forEach((e) => {
            if (e.ygLeftHandle) {
                this.left_r = e.r;
                this.ygLeftTouch = e;
            } else if (e.ygRightHandle) {
                this.right_r = e.r;
                this.ygRightTouch = e;
            }
        });
    }

    constructor(props) {
        super(props);
        this.buttons = [];//按键集合
        this.left_r = 0;//左摇杆半径
        this.right_r = 0;//右摇杆半径
        this.ygLeftTouch = null;
        this.ygRightTouch = null;
        this.ygLeftPosition = {x: 0, y: 0};//当前左摇杆的位置
        this.ygRightPosition = {x: 0, y: 0};//当前右摇杆的位置
        this.multiTouchResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onPanResponderStart: (evt, gestureState) => {
                evt.nativeEvent.touches.forEach((e) => {
                    try {
                        this.buttons.forEach((b) => {
                            if (!b.click) {
                                const pos2touch = {x: e.pageX - b.transform.x, y: e.pageY - b.transform.y};
                                const width = b.transform.width;
                                const height = b.transform.height;
                                const x1 = e.pageX;
                                const y1 = e.pageY;
                                const leftX = this.ygLeftTouch.transform.x;
                                const leftY = this.ygLeftTouch.transform.y;
                                const rightX = this.ygRightTouch.transform.x;
                                const rightY = this.ygRightTouch.transform.y;

                                const checkX = pos2touch.x > -width / 2 && pos2touch.x < width / 2;
                                const checkY = pos2touch.y > -height / 2 && pos2touch.y < height / 2;

                                if (this.calculationDistance(leftX, x1, leftY, y1, this.left_r)) {
                                    panLeft.setValue({
                                        x: x1 - this.ygLeftTouch.transform.px - this.ygLeftTouch.transform.width / 2,
                                        y: y1 - this.ygLeftTouch.transform.py - this.ygLeftTouch.transform.height / 2,
                                    });
                                    this.ygLeftTouch.onClickDown(e.identifier);
                                } else if (this.calculationDistance(rightX, x1, rightY, y1, this.right_r)) {
                                    panRight.setValue({
                                        x: x1 - this.ygRightTouch.transform.px - this.ygRightTouch.transform.width / 2,
                                        y: y1 - this.ygRightTouch.transform.py - this.ygRightTouch.transform.height / 2,
                                    });
                                    this.ygRightTouch.onClickDown(e.identifier);
                                } else if (checkX && checkY) {
                                    if (this.ygLeftTouch.click) {
                                        if (Math.abs(this.ygLeftPosition.x - e.pageX) < width) {
                                            if (Math.abs(this.ygLeftPosition.y - e.pageY) < height) {
                                                return;
                                            }
                                        }
                                    } else if (this.ygRightTouch.click) {
                                        if (Math.abs(this.ygRightPosition.x - e.pageX) < width) {
                                            if (Math.abs(this.ygRightPosition.y - e.pageY) < height) {
                                                return;
                                            }
                                        }
                                    }
                                    b.onClickDown(e.identifier);
                                    return;
                                }
                            }
                        });
                    } catch (e) {
                        console.log(e);
                    }
                });
            },
            onPanResponderEnd: (evt, gestureState) => {
                this.buttons.forEach((b) => {
                    evt.nativeEvent.changedTouches.forEach((e) => {
                        if (b.touchId === e.identifier) {
                            b.onClickUp();
                            // if (Platform.OS === 'android') {
                            setTimeout(() => {
                                if (b.ygLeftHandle) {
                                    panLeft.setValue({x: 0, y: 0});
                                    this.ygLeftPosition = {x: 0, y: 0};
                                    b.onEvent && b.onEvent({
                                        x: 0,
                                        y: 0,
                                    });
                                } else if (b.ygRightHandle) {
                                    panRight.setValue({x: 0, y: 0});
                                    this.ygRightPosition = {x: 0, y: 0};
                                    b.onEvent && b.onEvent({
                                        x: 0,
                                        y: 0,
                                    });
                                }
                            }, 10);
                            // } else {
                            //     if (b.ygLeftHandle) {
                            //         panLeft.setValue({x: 0, y: 0});
                            //     } else if (b.ygRightHandle) {
                            //         panRight.setValue({x: 0, y: 0});
                            //     }
                            // }
                        }
                    });
                });
            },
            onPanResponderGrant: (evt, gestureState) => {
                panLeft.setOffset({
                    x: panLeft.x._value,
                    y: panLeft.y._value,
                });
                panRight.setOffset({
                    x: panRight.x._value,
                    y: panRight.y._value,
                });
            },
            onPanResponderMove: (evt, gestureState) => {
                this.buttons.forEach((b) => {
                    evt.nativeEvent.changedTouches.forEach((e) => {
                        if (b.touchId === e.identifier && b.ygLeftHandle) {
                            // if (Platform.OS === 'android') {
                            const handle = findNodeHandle(b.refs.button);
                            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                                let locationX = e.pageX - pageX - (b.transform.width / 2) + panLeft.__getValue().x;
                                let locationY = e.pageY - pageY - (b.transform.height / 2) + panLeft.__getValue().y;

                                const position = this.calculationPosition(
                                    locationX,
                                    locationY,
                                    e.pageX,
                                    b.transform.x,
                                    e.pageY,
                                    b.transform.y,
                                    this.left_r,
                                );

                                this.ygLeftPosition.x = e.pageX;
                                this.ygLeftPosition.y = e.pageY;

                                panLeft.setValue({
                                    x: position.x,
                                    y: position.y,
                                });

                                b.onEvent && b.onEvent({
                                    x: position.x / this.left_r,
                                    y: position.y / this.left_r,
                                });
                                // const reg = Math.atan2(e.pageY - b.transform.py, e.pageX - b.transform.px) * 180 / Math.PI;
                                // b.onEvent && b.onEvent({
                                //     reg: reg,
                                // });
                            });
                            // } else {
                            //     let locationX = e.locationX - (b.transform.width / 2) + panLeft.__getValue().x;
                            //     let locationY = e.locationY - (b.transform.height / 2) + panLeft.__getValue().y;
                            //
                            //     console.log(locationX,
                            //         locationY,
                            //         e.pageX,
                            //         b.transform.x,
                            //         e.pageY,
                            //         b.transform.y);
                            //     const position = this.calculationPosition(
                            //         locationX,
                            //         locationY,
                            //         e.pageX,
                            //         b.transform.x,
                            //         e.pageY,
                            //         b.transform.y);
                            //
                            //     panLeft.setValue({
                            //         x: position.x,
                            //         y: position.y,
                            //     });
                            //
                            //     // b.onEvent && b.onEvent({
                            //     //     x: position.x / this.r,
                            //     //     y: -position.y / this.r,
                            //     // });
                            //     const reg = Math.atan2(e.pageY - b.transform.py, e.pageX - b.transform.px) * 180 / Math.PI;
                            //     b.onEvent && b.onEvent({
                            //         reg: reg,
                            //     });
                            // }
                        }
                        if (b.touchId === e.identifier && b.ygRightHandle) {
                            // if (Platform.OS === 'android') {
                            const handle = findNodeHandle(b.refs.button);
                            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                                let locationX = e.pageX - pageX - (b.transform.width / 2) + panRight.__getValue().x;
                                let locationY = e.pageY - pageY - (b.transform.height / 2) + panRight.__getValue().y;

                                const position = this.calculationPosition(
                                    locationX,
                                    locationY,
                                    e.pageX,
                                    b.transform.x,
                                    e.pageY,
                                    b.transform.y,
                                    this.right_r,
                                );

                                this.ygRightPosition.x = e.pageX;
                                this.ygRightPosition.y = e.pageY;

                                panRight.setValue({
                                    x: position.x,
                                    y: position.y,
                                });

                                b.onEvent && b.onEvent({
                                    x: position.x / this.right_r,
                                    y: position.y / this.right_r,
                                });
                            });
                            // } else {
                            //     let locationX = e.locationX - (b.transform.width / 2) + panRight.__getValue().x;
                            //     let locationY = e.locationY - (b.transform.height / 2) + panRight.__getValue().y;
                            //
                            //     const position = this.calculationPosition(
                            //         locationX,
                            //         locationY,
                            //         e.pageX,
                            //         b.transform.x,
                            //         e.pageY,
                            //         b.transform.y);
                            //
                            //     panRight.setValue({
                            //         x: position.x,
                            //         y: position.y,
                            //     });
                            //
                            //     b.onEvent && b.onEvent({
                            //         x: position.x / this.r,
                            //         y: -position.y / this.r,
                            //     });
                            // }
                        }
                    });
                });
            },
            onPanResponderRelease: () => {
                // pan.flattenOffset();
                // pan.resetAnimation();
                panLeft.setValue({x: 0, y: 0});
                panRight.setValue(({x: 0, y: 0}));
                this.ygLeftPosition = {x: 0, y: 0};
                this.ygRightPosition = {x: 0, y: 0};
                // Animated.spring(
                //     pan, // Auto-multiplexed
                //     {toValue: {x: 0, y: 0}}, // Back to zero
                // ).start();
            },
        });
    }

    /**
     * 计算点击是否在摇杆范围内
     * @param x
     * @param x1
     * @param y
     * @param y1
     * @param r
     */
    calculationDistance(x, x1, y, y1, r) {
        const distance = (x - x1) * (x - x1) + (y - y1) * (y - y1);
        if (Math.abs(distance) > (r * r)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 计算摇杆位置
     * @param locationX 当前X轴位置
     * @param locationY 当前Y轴位置
     * @param x1        移动的X轴位置
     * @param x0        X轴中心点
     * @param y1        移动的Y轴位置
     * @param y0        Y轴中心点
     * @param r         半径
     */
    calculationPosition(locationX, locationY, x1, x0, y1, y0, r) {
        let h = Math.atan((x1 - x0) / (y1 - y0));

        let sinBoolean = -1;
        let cosBoolean = -1;

        if (x1 - x0 < 0 && y1 - y0 > 0) {
            sinBoolean = 1;
            cosBoolean = 1;
        } else if (x1 - x0 < 0 && y1 - y0 < 0) {
            sinBoolean = -1;
            cosBoolean = -1;
        } else if (x1 - x0 > 0 && y1 - y0 > 0) {
            sinBoolean = 1;
            cosBoolean = 1;
        }

        let r1 = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2));

        let position = {};

        if (r1 >= r) {
            position.x = Math.sin(h) * r * sinBoolean;
            position.y = Math.cos(h) * r * cosBoolean;
        } else {
            position.x = locationX;
            position.y = locationY;
        }

        return position;
    }

}

export class MultiView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <View {...this.props}{...this.props.app.multiTouchResponder.panHandlers}>{this.props.children}</View>;
    }
}
