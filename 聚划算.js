/**
*京东年货节活动脚本
*参考脚本改编，原脚本为:淘宝+京东双十一活动脚本
*可访问：Github: https://github.com/hyue418
*感谢Hyue418大佬的原脚本
*小小耀
*/

//无障碍判定
try {
    auto();
} catch (error) {
    toast("请手动开启无障碍并授权给Auto.js");
    sleep(2000);
    exit();
}

//初始化参数
versions = 'V2.5.0';
speed = 1;
float = 1.25;
patNum = 0;
swipeTips = "滑啊滑啊滑啊滑ヽ(￣▽￣)ﾉ";
taskChooseList = ["聚划算"];
speedChooseList = [0.75, 1, 1.25, 1.5, 1.75, 2, 3];
taobaoActivityData = "taobao://m.tb.cn/h.4NvBF6z?sm=fd5d9f";
alipaysActivityData = "alipays://platformapi/startapp?appId=68687502";
width = device.width;
height = device.height;
setScreenMetrics(width, height);
alert("【聚划算 " + versions + "】", "脚本执行过程请勿手动点击屏幕，否则脚本执行可能会错乱，导致任务失败\n执行过程中可按音量+键终止\n参考脚本改编，原脚本为:淘宝+京东双十一活动脚本\n可访问：Github: https://github.com/hyue418\n年货节脚本访问：\n");
//选择任务
taskChoose();

/**
 * 任务选择
 */
function taskChoose() {
    var options = dialogs.multiChoice("需要执行的任务", taskChooseList);
    if (options == '') {
        toastLog("脚本已退出");
        exit();
    }
    //勾选调速时弹出速度选择
    options.indexOf(4) > -1 && speedChoose();
    runOptions(options);
}

/**
 * 速度选择
 */
function speedChoose() {
    var option = dialogs.singleChoice("操作间隔的倍数（越大越慢）", speedChooseList, 1);
    if (option == -1) {
        toastLog("脚本已退出");
        exit();
    }
    speed = speedChooseList[option];
}

/**
 * 执行选中任务
 * @param options 选项数组
 */
function runOptions(options) {
    console.show();
    log("聚划算" + versions + "\n");
    log("脚本执行期间请勿手动点击按钮");
    log("当前脚本操作时间间隔为【" + speed + "倍】");
    options.forEach(option => {
        switch (option) {
            case 0:
                //执行淘宝任务
                var taskList = ['签到', '去完成'];
                log("=====开始执行" + taskChooseList[option] + "=====");
                runTaobao("手机淘宝", taobaoActivityData, taskList);
                break;
            default:
                break;
        }
    });
    alert("任务已完成", "所有任务貌似都做完啦！\n若仍有任务请重新运行噢！\n\nGitHub: https://github.com/hyue418\nPowered By Hyue418");
}

/**
 * 淘宝活动脚本，兼容淘宝&支付宝
 * @param appName
 * @param activityData
 * @param taskList
 */
function runTaobao(appName, activityData, taskList) {
    var i = j = 0;
    toastLog("打开【" + appName + "】活动页");
    app.startActivity({
        action: "VIEW",
        data: activityData
    });
    randomSleep(6500);
    taskList.forEach(task => {
        while (textContains(task).exists()) {
            var button = text(task).findOnce(j);
            if (button == null) {
                break;
            }
            log("开始做第" + (i + 1) + "次任务");
            switch (task) {
                case '去搜索':
                case '逛一逛':
                case '去完成':
                    log("开始【" + task + "】任务");
                    clickButton(button);
                    randomSleep(500);
                    //若未点击成功，则再次点击
                    while (textContains(task).exists()) {
                        clickButton(button);
                        randomSleep(300);
                    }
                    randomSleep(2500);
                    if (textContains("复制链接").exists()) {
                        log("跳过分享任务");
                        j++;
                        i++;
                        back();
                        randomSleep(200);
                        back();
                        break;
                    }
                    randomSleep(2500);
                    if (text("取消").findOne()) {
                        log("跳过天猫下载任务");
                        j++;
                        i++;
                        randomSleep(1200);
                        back();
                        randomSleep(1200);
                        back();
                        randomSleep(200);
                        back();
                        break;
                    }
                    if (textContains("淘宝特价版送红包").exists()) {
                        log("跳过打开APP任务");
                        j++;
                        i++;
                        back();
                        break;
                    }
                    toast(swipeTips);
                    randomSwipe();
                    randomSleep(5000);
                    toast(swipeTips);
                    randomSwipe();
                    randomSleep(6000);
                    toast(swipeTips);
                    randomSwipe();
                    descContains("任务完成").findOne(8000 * speed);
                    randomSleep(1000);
                    i++;
                    log("已完成");
                    back();
                    //支付宝任务返回后需要点击确认按钮
                    if (appName == '支付宝') {
                        randomSleep(2000);
                        clickContent('好的，我知道了');
                    }
                    break;
                case '去观看':
                case '去浏览':
                    log("开始【" + task + "】任务")
                    clickButton(button);
                    randomSleep(500);
                    //若未点击成功，则再次点击
                    while (textContains(task).exists()) {
                        clickButton(button);
                        randomSleep(300);
                    }
                    randomSleep(3500);
                    if (textContains("观看").exists() && textContains("关注").exists()) {
                        //进入直播页面直接等待，不滑屏
                        randomSleep(18000);
                    } else {
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(3500);
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(5500);
                        toast(swipeTips);
                        randomSwipe();
                    }
                    textContains("全部完成").findOne(8000 * speed);
                    randomSleep(1000);
                    i++;
                    log("已完成")
                    back();
                    break;
                case '领取奖励':
                case '签到':
                    log("跳过");
                case '领取':
                    clickButton(button);
                    randomSleep(1500);
                    log("【" + task + "】成功")
                    //支付宝任务签到后需要点击确认按钮
                    if (appName == '支付宝') {
                        clickContent('好的，我知道了');
                    }
                    break;
                default:
                    log("跳过");
                    break;
            }
            randomSleep(2000);
        }
    });
    toastLog("【" + appName + "】任务已完成");
    log("=========================");
}



/**
 * 通过文字内容模拟点击按钮
 * @param content 按钮文字内容
 * @param type 点击类型，默认为text点击
 * @param sleepTime 等待时间，默认1000毫秒
 */
function clickContent(content, type, sleepTime) {
    var type = type || "text";
    var sleepTime = sleepTime || 1000;
    sleep(sleepTime * float * speed);
    if (type == "text") {
        var button = text(content).findOne();
    } else {
        var button = desc(content).findOne();
    }
    clickButton(button);
    return button;
}

/**
 * 根据控件的坐标范围随机模拟点击
 * @param button
 */
function clickButton(button) {
    var bounds = button.bounds();
    press(random(bounds.left, bounds.right), random(bounds.top, bounds.bottom), random(50, 100));
}

/**
 * 根据控件的坐标范围随机模拟点击（京东用）
 * 京东任务按钮有圆角，通用的随机点击方法容易点出圆角外导致点击失效，此处做修正
 * @param button
 */
function jdClickButton(button) {
    var bounds = button.bounds();
    var width = bounds.right - bounds.left;
    var high = bounds.top - bounds.bottom;
    press(random(bounds.left + width / 4, bounds.right - width / 4), random(bounds.top + high / 3, bounds.bottom - high / 3), random(50, 100));
}

/**
 * 根据float倍数sleep随机时间
 * @param time
 */
function randomSleep(time) {
    sleep(ramdomByFloat(time) * speed);
}

/**
 * 随机滑动
 */
function randomSwipe() {
    smlMove(ramdomByFloat(width / 2), ramdomByFloat(height / 1.5), ramdomByFloat(width / 2), ramdomByFloat(height / 4), ramdomByFloat(800));
}

/**
 * 范围随机数生成
 * @param min
 * @param max
 */
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

/**
 * 根据float生成随机数
 * @param number
 */
function ramdomByFloat(number) {
    return random(number, number * float);
}

/**
 * 仿真随机带曲线滑动
 * @param qx 起点x轴坐标
 * @param qy 起点y轴坐标
 * @param zx 终点x轴坐标
 * @param zy 终点y轴坐标
 * @param time 滑动时间，毫秒
 */
function smlMove(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };
    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {
        eval("point.push(dx" + i + ")");
    }
    ;
    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezierCurves(point, i).x), parseInt(bezierCurves(point, i).y)];
        xxy.push(xxyy);
    }
    gesture.apply(null, xxy);
};

function bezierCurves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
};